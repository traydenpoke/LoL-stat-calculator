// Create empty array to hold objects
let items = [];
let hasMythic = false;
let currentMythic;

function display() {
    displayInventoryItems();
    statInfo();
}

function findItem(obj) {
    if (obj.type === "mythic") {
        for (let i = 0; i < mythicItemList.length; i++) {
            if (mythicItemList[i].name == obj.name) {
                return mythicItemList[i];
            }
        }
    } else if (obj.type === "legendary") {
        for (let i = 0; i < legendaryItemList.length; i++) {
            if (legendaryItemList[i].name == obj.name) {
                return legendaryItemList[i];
            }
        }
    }

}

function addToList(obj) {
    let itemObj = findItem(obj);
    // problem is within findItem(), only checks for mythics, need to check for type?
    // can have multiple if statements, one for each type, OR have one master list?

    if (itemObj.type === "mythic" && hasMythic) {
        alert(`There is already mythic item '${currentMythic.name}' in inventory. Remove to change to a different one.`);
        return;
    }

    if (items.find((existing) => existing.name === itemObj.name)) {
        alert(`${itemObj.name} is already in inventory.`);
    } else {
        if (items.length !== 6) {
            items.push(itemObj);
            //alert(`${itemObj.name} added to list.`);
            if (itemObj.type === "mythic") {
                hasMythic = true;
                currentMythic = itemObj;
            }
        } else {
            alert(`Max size reached. Remove items to add more.`);
        }
    }
    display();
}

function removeFromList(obj) {
    let itemObj = findItem(obj);

    //alert(`${itemObj.name} removed from list.`);
    items.splice(items.indexOf(itemObj), 1);

    if (itemObj.type === "mythic") {
        hasMythic = false;
        currentMythic = undefined;
    }

    display();
}

// display items in grid (removable ones)
function displayInventoryItems() {
    let div = document.getElementById("current-items-display");
    div.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const img = document.createElement("img");

        if (i >= items.length) {
            img.setAttribute("src", "./src/img/none.webp");
        } else {
            let itemObj = findItem(items[i]);
            if (itemObj.type === "mythic") {
                let srcStr = "./src/img/mythics/" + itemObj.src + ".webp";
                img.setAttribute("src", srcStr);

                let onclickCmd = "removeFromList({name: '" + itemObj.name + "', type: \"mythic\"})";
                img.setAttribute("onclick", onclickCmd);

                img.setAttribute("id", "mythic"); // so that mythics will have yellow border in inventory

            } else if (itemObj.type === "legendary") {
                let srcStr = "./src/img/legendaries/" + itemObj.src + ".webp";
                img.setAttribute("src", srcStr);

                let onclickCmd = "removeFromList({name: '" + itemObj.name + "', type: \"legendary\"})";
                img.setAttribute("onclick", onclickCmd);;
            }

        }
        div.appendChild(img);
    }
}

// display items in grid (addable ones)
function displayBuyableItems() {

    // mythic items
    const mythicDiv = document.getElementById("mythic-items");
    for (let i = 0; i < mythicItemList.length; i++) {

        const img = document.createElement("img");

        // set onclick
        let onclickCmd = "addToList({name: '" + mythicItemList[i].name + "', type: \"mythic\"})";
        img.setAttribute("onclick", onclickCmd);

        // set src
        let srcStr = "./src/img/mythics/" + mythicItemList[i].src + ".webp";
        img.setAttribute("src", srcStr);

        // add image to div
        mythicDiv.appendChild(img);
    }

    // legendary items
    const legendaryDiv = document.getElementById("legendary-items");
    for (let i = 0; i < legendaryItemList.length; i++) {

        const img = document.createElement("img");

        // set onclick
        let onclickCmd = "addToList({name: '" + legendaryItemList[i].name + "', type: \"legendary\"})";
        img.setAttribute("onclick", onclickCmd);

        // set src
        let srcStr = "./src/img/legendaries/" + legendaryItemList[i].src + ".webp";
        img.setAttribute("src", srcStr);

        // add image to div
        legendaryDiv.appendChild(img);
    }
}


function statInfo() {
    const div = document.getElementById("stat-text");
    div.innerHTML = "";
    for (let stat of statStrs) {
        const textStatElem = document.createElement("p");
        const textStat = document.createTextNode(stat[1]);
        textStatElem.appendChild(textStat);
        div.appendChild(textStatElem);

        const textAmtElem = document.createElement("p");
        const textAmt = document.createTextNode(getStatStr(stat));
        textAmtElem.appendChild(textAmt);
        div.appendChild(textAmtElem);
    }

    // calculate and add gold efficiency as well


    const goldEfficiencyStr = document.createElement("p");
    const goldValueStr = document.createTextNode(`Gold Efficiency %`);
    goldEfficiencyStr.appendChild(goldValueStr);
    div.appendChild(goldEfficiencyStr);

    const goldEfficiencyAmt = document.createElement("p");
    const goldValueAmt = document.createTextNode(calcGoldValue());
    goldEfficiencyAmt.appendChild(goldValueAmt);
    div.appendChild(goldEfficiencyAmt);

}

function getStatStr(stat) {
    let sum = 0;
    for (let item of items) {
        if (item[stat[0]] !== 0) {
            sum += item[stat[0]];
        }
    }
    return `${sum}`;
}


function calcGoldValue() {
    let value = 0;
    let cost = 0;

    if (items.length === 0) {
        return 0;
    }

    for (let item of items) {
        value += goldStatValue(item);
        cost += item["cost"];
    }

    const goldValue = (value / cost * 100).toFixed(2);
    return goldValue;

}

function goldStatValue(item) {
    let value = 0;

    for (let i = 0; i < statStrs.length - 1; i++) {
        let curStat = statStrs[i][0];
        if (item[curStat] !== 0) {
            value += item[curStat] / calculations[curStat][0] * calculations[curStat][1];
        }
    }
    return value;
}

function showStats() {
    const x = document.getElementById("stats-display");
    const buttonText = document.getElementById("stat-display-button");

    if (x.style.display === "none") {
        x.style.display = "block";
        buttonText.innerText = "Hide Stats";
    } else {
        x.style.display = "none";
        buttonText.innerText = "Show Stats";
    }
}

function showAllItems() {
    const x = document.getElementById("items-display");
    const buttonText = document.getElementById("item-display-button");

    if (x.style.display === "none") {
        x.style.display = "block";
        buttonText.innerText = "Hide Items";
    } else {
        x.style.display = "none";
        buttonText.innerText = "Show Items";
    }
}