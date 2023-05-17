// Create empty array to hold objects
let items = [];
let hasMythic = false;
let currentMythic;

function display() {
    displayInventoryItems();
    statInfo();
}

function findItem(obj) {
    let itemLists = [
        mythicItemList, legendaryItemList, epicItemList, basicItemList, starterItemList, bootsItemList
    ];

    let rightList;

    if (obj.type === "mythic") {
        rightList = itemLists[0];
    } else if (obj.type === "legendary") {
        rightList = itemLists[1];
    } else if (obj.type === "epic") {
        rightList = itemLists[2];
    } else if (obj.type === "basic") {
        rightList = itemLists[3];
    } else if (obj.type === "starter") {
        rightList = itemLists[4];
    } else {
        rightList = itemLists[5];
    }

    for (let item of rightList) {
        if (item.name === obj.name) {
            return item;
        }
    }

}

function addToList(obj) {
    // problem is within findItem(), only checks for mythics, need to check for type?
    // can have multiple if statements, one for each type, OR have one master list?
    let itemObj = findItem(obj);

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

// display items in inventory
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
                img.setAttribute("id", "mythic"); // so that mythics will have yellow border in inventory
            }
            let srcStr = `./src/img/${itemObj.type}/${itemObj.src}.webp`;
            img.setAttribute("src", srcStr);

            let onclickCmd = `removeFromList({name: '${itemObj.name}', type: \"${itemObj.type}\"})`;
            img.setAttribute("onclick", onclickCmd);

        }
        div.appendChild(img);
    }
}

// display items in shop
function displayBuyableItems() {

    let itemType = [
        "mythic", "legendary", "epic", "basic", "starter", "boots"
    ];

    let itemLists = [
        mythicItemList, legendaryItemList, epicItemList, basicItemList, starterItemList, bootsItemList
    ];

    for (let t = 0; t < itemType.length; t++) {
        let curItemType = itemType[t];
        const div = document.getElementById(`${curItemType}-items`);
        for (let i = 0; i < itemLists[t].length; i++) {
            const img = document.createElement("img");

            // nested divs:
            // curItemType-items => item-container => img-container => text-container

            // set src
            let srcStr = `./src/img/${curItemType}/${itemLists[t][i].src}.webp`;
            img.setAttribute("src", srcStr);

            const container = document.createElement("div");
            container.setAttribute("class", "item-container");

            const imgContainer = document.createElement("div");
            imgContainer.setAttribute("class", "img-container");

            const textContainer = document.createElement("div");
            textContainer.setAttribute("class", "text-container");
            const text = document.createElement("p");
            const textNode = document.createTextNode(itemLists[t][i].name);
            text.appendChild(textNode);

            // set onclick
            let onclickCmd = `addToList({name: '${itemLists[t][i].name}', type: \"${curItemType}\"})`;
            textContainer.setAttribute("onclick", onclickCmd);

            textContainer.appendChild(text);

            imgContainer.appendChild(img);
            imgContainer.appendChild(textContainer);
            container.appendChild(imgContainer);

            div.appendChild(container);
        }
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

    // claculate and add gold efficiency
    const goldEfficiencyStr = document.createElement("p");
    const goldValueStr = document.createTextNode(`Gold Efficiency % `);
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
    return `${sum} `;
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
    } else {
        x.style.display = "none";
    }
}

function showHideItems(divTag) {
    const x = document.getElementById(`${divTag}-items`);
    const buttonText = document.getElementById("item-display-button");

    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
};