// Get all category buttons
class Category {
    _button;
    constructor(elementID, isSelected = false) {
        this._button = document.getElementById(elementID);
        this._isSelected = isSelected;
        this._elementID = elementID;
    }

    get button() {
        return this._button;
    }

    get elementID() {
        return this._elementID;
    }

    get isSelected() {
        return this._isSelected;
    }

    set isSelected(isSelected) {
        this._isSelected = isSelected;
    }
}
const drinkDisplay = document.getElementById('drink-display');
const sigDrinks = new Category('sig-drinks-btn');
const coffee = new Category('coffee-btn');
const tea = new Category('tea-btn');
const iceBlended = new Category('ice-blended-btn');
const drinks = [sigDrinks, coffee, tea, iceBlended];
let lastType;
// let lastClicked;
let allCards;
let url;

document.addEventListener('DOMContentLoaded', () => {
    selectButton(sigDrinks.button);
});

function refreshDisplaySection(type) {
    if (type !== lastType) {
        lastType = type;
        removeCards();
        url = '/drinks/list?type=' + encodeURIComponent(type);
        // let categorySelected = null;
        fetch(url)
            .then(response => response.json())
            .then(items => {
                items.forEach(item => {
                    console.log(item.name, item.image, item.price, item.type);
                    // categorySelected = findSelected();
                    makeCard(item);
                });
                makeCardsClickable();
            })
            .catch(error => console.error('Error:', error));
    }
    /**
     * Function that makes all cards clickable. 
     * 
     * Must be inside of then function of the fetch() .then() function 
     * chain.
     */
    function makeCardsClickable() {
        let itemName;
        let itemDescription;
        /*
        allCards = document.getElementsByClassName('card');
        console.log(allCards.length);
        for (let i = 0; i < allCards.length; i++) {
            allCards[i].addEventListener('click', () => {
                // console.log("clicked!");
                createDescriptionPopup();
            });
        }
        */

        document.querySelectorAll('.card').forEach(function(card) {
            card.addEventListener('click', function(event) {
                itemName = this.querySelector('h2').textContent;
                console.log('Item: ', itemName); // For debugging
                createDescriptionPopup();
            });
        })

        function createDescriptionPopup() {
            let blackBackground = document.createElement('div');
            blackBackground.id = 'popup-bg';
            let popup = document.createElement('div');
            popup.id = 'popup';
            let descText = document.createElement('div');
            descText.id = 'desc-text';
            let descBox = document.createElement('div');
            descBox.id = 'desc-box';
            document.body.appendChild(blackBackground);
            blackBackground.appendChild(popup);
            popup.append(descText, descBox);

            // descText
            let spacer = document.createElement('div');
            spacer.className = 'spacer';
            let p = document.createElement('p');
            p.textContent = 'Description';
            let spacer2 = document.createElement('div');
            spacer2.className = 'spacer';
            let closeBtn = document.createElement('img');
            closeBtn.src = './photo-bank/x-symbol.svg'
            closeBtn.style.cssText = "cursor: pointer; margin-left: auto; margin-right: 10px;"
            closeBtn.style.width = '10px';
            closeBtn.style.height = '10px';
            closeBtn.alt = 'close';
            descText.append(spacer, p, spacer2, closeBtn);

            //descBox
            let description = document.createElement('p');
            description.style.cssText = 'margin: 30px';
            let encodedItemName = encodeURIComponent(itemName);
            url = '/drinks/list?name=' + encodedItemName;
            fetch(url) 
                .then(response => {
                    if (!response.ok) {
                        throw new Error('HTTP error! ${response.status}')
                    }
                    return response.json();
                })
                .then(items => {
                    items.forEach(item => {
                        itemDescription = item.description;
                        console.log(itemDescription);
                        description.textContent = itemDescription; // Must put in here; asynchronous
                    }) 
                })
            descBox.appendChild(description);
            closeBtn.addEventListener('click', function() {
                blackBackground.remove();  
            });
        }
    }
    function removeCards() {
        while (drinkDisplay.firstChild != null) {
            drinkDisplay.removeChild(drinkDisplay.firstChild);
        }
    }
}



function makeCard(item) {
    // Variables
    let newCard = document.createElement('div');
    let drinkImg = document.createElement('img');
    let nameElement = document.createElement('h2');
    let priceElement = document.createElement('h3');
    let imgWidth = '100px';
    let imgHeight = '200px';
    newCard.className = 'card';
    drinkImg.style.width = imgWidth;
    drinkImg.style.height = imgHeight;
    drinkImg.src = item.image;
    nameElement.textContent = item.name;
    priceElement.textContent = "$" + item.price;

    // Setting up DOM nodes
    drinkDisplay.appendChild(newCard);
    newCard.appendChild(drinkImg);
    newCard.appendChild(nameElement);
    newCard.appendChild(priceElement);
}



/**
 * Adds the appropriate CSS class to the category selected.
 * 
 * When the category (technically a button) is clicked, the function will 
 * add the .selected subclass to the button's CSS style, and remove the 
 * subclass' styling from the other category.
 *  
 * 
 * @param {*} selectedButton 
 */
function selectButton(selectedButton) {
    drinks.forEach(drink => {
        drink.isSelected = false;
        drink.button.classList.remove('selected');
    });

    selectedButton.classList.add('selected');
    falsifyAll();

    switch (selectedButton) {
        case document.getElementById('sig-drinks-btn'):
            // sigDrinks.isSelected = true;
            refreshDisplaySection('s');
            break;
        case document.getElementById('coffee-btn'):
            // coffee.isSelected = true;
            refreshDisplaySection('c');
            break;
        case document.getElementById('tea-btn'):
            // tea.isSelected = true;
            refreshDisplaySection('t');
            break;
        case document.getElementById('ice-blended-btn'):
            // iceBlended.isSelected = true;
            refreshDisplaySection('i');
            break;
    }
    // checkSelected();
    // refreshDisplaySection();
    function falsifyAll() {
        drinks.forEach(drink => {
            drink.isSelected = false;
        });
    }
    /**
     * Debugger function to check if only the correct button is considered selected 
     * by the website.
     * 
     * The website loops through each drink object to see if their isSelected variable
     * is set to true. Expected output is that only ONE button should be set to true.
     */
    function checkSelected() {
        drinks.forEach(drink => {
            if (drink.isSelected) {
                console.log(drink.elementID + " has been selected");
            } else {
                console.log(drink.elementID + " has NOT been selected");
            }
        });
    }
}


drinks.forEach(drink => {
    drink.button.addEventListener('click', () => selectButton(drink.button));
})