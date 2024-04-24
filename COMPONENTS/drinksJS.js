// Get all category buttons
class Category {
    _button;
    constructor(item, isSelected = false) {
        // this._button = document.getElementById(elementID);
        let btnName = item.name.toLowerCase().replace(/\s+/g, '-') + 'btn';
        let button = document.createElement('button');
        button.id = btnName;
        button.className = 'category';
        button.addEventListener('click', () => {
            // selectButton(button);
            selectCategory(this);
        });
        let btnText = document.createElement('h2');
        btnText.textContent = item.name;
        button.appendChild(btnText);
        document.getElementById('drink-categories').appendChild(button);
        this._button = button;
        this._isSelected = isSelected;
        this._elementID = btnName;
        this._item = item;
    }

    get item() {
        return this._item;
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

const categories = [];

let lastCategory;

let buttonURL;
let allDrinksURL = '/drinks/all';

function initButtons() {
    buttonURL = '/drinks/list?type=s';
    // let categorySelected = null;
    fetch(buttonURL)
        .then(response => response.json())
        .then(items => {
            items.forEach(item => {
                const newCategory = new Category(item, false);
                categories.push(newCategory);
                if (categories.length == 1) {
                    selectCategory(newCategory);
                }
            });
        })

        .catch(error => console.error('Error:', error));
}

function selectCategory(category) {
    console.log(category.item.name);
    categories.forEach(c => {
        c.isSelected = false;
        c.button.classList.remove('selected');
    });

    category.button.classList.add('selected');
    removeCards();
    makeCard(category.item);
    makeCardsClickable();

    function removeCards() {
        while (drinkDisplay.firstChild != null) {
            drinkDisplay.removeChild(drinkDisplay.firstChild);
        }
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

        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('click', function (event) {
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
            let button = document.createElement('button');
            button.textContent = 'Order'
            button.id = 'specialty-order-btn';
            // button.style.cssText = 'align-self: center; margin-top: 20px; padding: 10px 20px; border-radius: 20px; border: 2px solid chocolate; background-color: #857f7f; cursor: pointer;';
            // let orderBtnText = document.createElement('p');
            // orderBtnText.style.cssText = 'font-size: 15px;';
            // orderBtnText.textContent = "Order";
            // orderBtnText.style.margin = '10px';
            // button.appendChild(orderBtnText);
            popup.append(descText, descBox, button);

            // descText
            let spacer = document.createElement('div');
            spacer.className = 'spacer';
            let p = document.createElement('p');
            p.textContent = 'Description';
            let spacer2 = document.createElement('div');
            spacer2.className = 'spacer';
            let closeBtn = document.createElement('img');
            closeBtn.src = 'x-symbol.svg';
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
                        button.onclick = function() {
                            window.open(item.url, '_blank');
                        }
                    })
                })
            descBox.appendChild(description);
            closeBtn.addEventListener('click', function () {
                blackBackground.remove();
            });
        }
    }
}
//const drinks = [sigDrinks, coffee, tea, iceBlended];
let lastType;
// let lastClicked;
let allCards;
let url;

document.addEventListener('DOMContentLoaded', () => {
    initButtons();
});

// refreshDisplaySection() and selectButton() are gone now


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

fetch(allDrinksURL)
    .then(response => response.json())
    .then(items => {
        const coffeeSection = document.getElementById('coffee');
        const teaSection = document.getElementById('tea');
        const iceBlendedSection = document.getElementById('ice');

        items.forEach(item => {
            switch (item.type) {
                case 'c':
                    // coffee.push(item); 
                    addNonSignatureDrink(coffeeSection);
                    break;
                case 't':
                    // tea.push(item);
                    addNonSignatureDrink(teaSection);
                    break;
                case 'i':
                    // iceBlended.push(item);
                    addNonSignatureDrink(iceBlendedSection);
                    break;
                default:
                // Do nothing
            }

            function addNonSignatureDrink(section) {
                const drinkDiv = document.createElement("div");
                drinkDiv.classList.add("menu-drink");

                const drinkLink = document.createElement("a");
                drinkDiv.classList.add("drinks_link");
                drinkLink.href = item.url;
                drinkLink.target = "_blank";

                const nameHeading = document.createElement("h3");
                nameHeading.textContent = item.name;

                const descriptionParagraph = document.createElement("p");
                descriptionParagraph.textContent = item.description;

                drinkLink.appendChild(nameHeading);
                drinkLink.appendChild(descriptionParagraph);

                drinkDiv.appendChild(drinkLink);

                section.after(drinkDiv);
            }
        });


    })
    .catch(error => console.error('Error:', error));