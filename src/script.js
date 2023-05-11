// Create empty array to hold objects
let items = [];
let hasMythic = false;
let currentMythic;

function display() {
    displayInventoryItems();
    statInfo();
    //console.log(items);
}

function findItem(obj) {
    for (let i = 0; i < mythicItemList.length; i++) {
        if (mythicItemList[i].name == obj.name) {
            return mythicItemList[i];
        }
    }
}

function addToList(obj) {
    let itemObj = findItem(obj);

    if (itemObj.type === "mythic" && hasMythic) {
        alert(`Mythic item '${currentMythic.name}' already in inventory. Remove to change to a different one.`);
        return;
    }

    if (items.find((existing) => existing.name === itemObj.name)) {
        alert(`${itemObj.name} already in list.`);
    } else {
        if (items.length !== 6) {
            items.push(itemObj);
            alert(`${itemObj.name} added to list.`);
            if (itemObj.type === "mythic") {
                hasMythic = true;
                currentMythic = itemObj;
            }
        }
    }

    if (items.length === 6) {
        alert(`Max size reached. Remove items to add more.`);
    }

    display();
}

function removeFromList(obj) {
    let itemObj = findItem(obj);

    alert(`${itemObj.name} removed from list.`);
    items.splice(items.indexOf(itemObj), 1);

    if (itemObj.type === "mythic") {
        hasMythic = false;
        currentMythic = undefined;
    }
    console.log("here)");

    display();
}

// display items in grid (removable ones)
function displayInventoryItems() {
    let div = document.getElementById("item-display");
    div.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        const img = document.createElement("img");

        if (i >= items.length) {
            img.setAttribute("src", "./src/img/none.webp");
        } else {
            let itemObj = findItem(items[i]);
            let srcStr = "./src/img/mythics/" + itemObj.src + ".webp";
            img.setAttribute("src", srcStr);

            let onclickCmd = "removeFromList({name: '" + itemObj.name + "'})";
            img.setAttribute("onclick", onclickCmd);

            img.setAttribute("id", "mythic");
        }


        div.appendChild(img);
    }
}

// display items in grid (addable ones)
function displayBuyableItems() {
    const div = document.getElementById("mythic-items");
    for (let i = 0; i < mythicItemList.length; i++) {

        const img = document.createElement("img");

        // set onclick
        let onclickCmd = "addToList({name: '" + mythicItemList[i].name + "'})";
        img.setAttribute("onclick", onclickCmd);

        // set src
        let srcStr = "./src/img/mythics/" + mythicItemList[i].src + ".webp";
        img.setAttribute("src", srcStr);

        // add image to div
        div.appendChild(img);
    }

}


function statInfo() {
    const div = document.getElementById("stat-display");
    div.innerHTML = "";
    for (let stat of statStrs) {
        const textElem = document.createElement("p");
        const text = document.createTextNode(createStatStr(stat));

        textElem.appendChild(text);
        div.appendChild(textElem);
    }

    // calculate and add gold efficiency as well
    const goldEfficiency = document.createElement("p");
    const goldValue = document.createTextNode(`Gold Efficiency: ${calcGoldValue()}%`);
    goldEfficiency.appendChild(goldValue);
    div.appendChild(goldEfficiency);

}

function createStatStr(stat) {
    let sum = 0;
    for (let item of items) {
        if (item[stat[0]] !== 0) {
            sum += item[stat[0]];
        }
    }
    return `${stat[1]}: ${sum}`;
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