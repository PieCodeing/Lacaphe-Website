async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/drinks/all');
        const itemNames = await response.json();

        itemNames.forEach(menuItem => {
            const item = new Item(menuItem);
        });
    } catch(error){
        console.error("failed", error);
    }
}

class Item {
    _menuItem;
    constructor(menuItem) {
        this._menuItem = menuItem;
        this._createHTMLItem();
    }
    
    _createHTMLItem() {
        let drink = document.createElement('div');
        drink.className = 'drink';
        let collapsed = document.createElement('div');
        collapsed.id = 'collapsed';
        let nameSide = document.createElement('div');
        nameSide.className = 'name-side';
        nameSide.style.border = '5px solid red';
        let drinkName = document.createElement('p');
        drinkName.textContent = this._menuItem.name;
        nameSide.appendChild(drinkName);
        let btnSide = document.createElement('div');
        btnSide.className = 'btn-side';
        btnSide.style.border = '5px solid red';
        let pencilBtn = document.createElement('img');
        pencilBtn.className = 'logo';
        pencilBtn.src = 'pencil-solid.svg';
        let garbageBin = document.createElement('img');
        garbageBin.className = 'logo';
        garbageBin.src = 'trash-solid.svg';


        drink.appendChild(collapsed);
        collapsed.append(nameSide, btnSide);
        btnSide.append(garbageBin, pencilBtn);
    
        document.getElementById('menu-drinks').appendChild(drink);
    }
}

let items = [];

// fetchItems();















// function updateSignatureDrinks(){
//     var drinkName1 = document.getElementById("Drink1").value
//     var drinkdesc1 = document.getElementById("desc1").value
//     var drinkName2 = document.getElementById("Drink2").value
//     var drinkdesc2 = document.getElementById("desc2").value
//     var drinkName3 = document.getElementById("Drink3").value
//     var drinkdesc3 = document.getElementById("desc3").value
//     var drinkName4 = document.getElementById("Drink4").value
//     var drinkdesc4 = document.getElementById("desc4").value
//     var drinkName5 = document.getElementById("Drink5").value
//    var drinkdesc5 = document.getElementById("desc5").value

    
//     document.getElementById("prevDrink1").innerHTML = drinkName1
//     document.getElementById("prevdesc1").innerHTML = drinkdesc1
//     document.getElementById("prevDrink2").innerHTML = drinkName2
//     document.getElementById("prevdesc2").innerHTML = drinkdesc2
//     document.getElementById("prevDrink3").innerHTML = drinkName3
//     document.getElementById("prevdesc3").innerHTML = drinkdesc3
//     document.getElementById("prevDrink4").innerHTML = drinkName4
//     document.getElementById("prevdesc4").innerHTML = drinkdesc4
//     document.getElementById("prevDrink5").innerHTML = drinkName5
//     document.getElementById("prevdesc5").innerHTML = drinkdesc5
    
// }

// function updateMenu(){
//     var cn1 = document.getElementById("cn1").value
//     var cd1 = document.getElementById("cd1").value
//     var tm1 = document.getElementById("tm1").value
//     var tmd1 = document.getElementById("tmd1").value
//     var ib1 = document.getElementById("ib1").value
//     var ibd1 = document.getElementById("ibd1").value

//     var cn2 = document.getElementById("cn2").value
//     var cd2 = document.getElementById("cd2").value
//     var tm2 = document.getElementById("tm2").value
//     var tmd2 = document.getElementById("tmd2").value
//     var ib2 = document.getElementById("ib2").value
//     var ibd2 = document.getElementById("ibd2").value

//     var cn3 = document.getElementById("cn3").value
//     var cd3 = document.getElementById("cd3").value
//     var tm3 = document.getElementById("tm3").value
//     var tmd3 = document.getElementById("tmd3").value
//     var ib3 = document.getElementById("ib3").value
//     var ibd3 = document.getElementById("ibd3").value

//     var cn4 = document.getElementById("cn4").value
//     var cd4 = document.getElementById("cd4").value
//     var tm4 = document.getElementById("tm4").value
//     var tmd4 = document.getElementById("tmd4").value
//     var ib4 = document.getElementById("ib4").value
//     var ibd4 = document.getElementById("ibd4").value

//     document.getElementById("prevCn1").innerHTML = cn1
//     document.getElementById("prevCd1").innerHTML = cd1
//     document.getElementById("prevTmn1").innerHTML = tm1
//     document.getElementById("prevTmd1").innerHTML = tmd1
//     document.getElementById("prevIbn1").innerHTML = ib1
//     document.getElementById("prevIbdesc1").innerHTML = ibd1

//     document.getElementById("prevCn2").innerHTML = cn2
//     document.getElementById("prevCd2").innerHTML = cd2
//     document.getElementById("prevTmn2").innerHTML = tm2
//     document.getElementById("prevTmd2").innerHTML = tmd2
//     document.getElementById("prevIbn2").innerHTML = ib2
//     document.getElementById("prevIbdesc2").innerHTML = ibd2

//     document.getElementById("prevCn3").innerHTML = cn3
//     document.getElementById("prevCd3").innerHTML = cd3
//     document.getElementById("prevTmn3").innerHTML = tm3
//     document.getElementById("prevTmd3").innerHTML = tmd3
//     document.getElementById("prevIbn3").innerHTML = ib3
//     document.getElementById("prevIbdesc3").innerHTML = ibd3

//     document.getElementById("prevCn4").innerHTML = cn4
//     document.getElementById("prevCd4").innerHTML = cd4
//     document.getElementById("prevTmn4").innerHTML = tm4
//     document.getElementById("prevTmd4").innerHTML = tmd4
//     document.getElementById("prevIbn4").innerHTML = ib4
//     document.getElementById("prevIbdesc4").innerHTML = ibd4
// }