// const { createElement } = required('./COMPONENTS/elementCreator.js');

async function handleFormSubmit(event, form, endpoint, method = 'POST', postSend) {
    event.preventDefault();
    // const form = document.getElementById(formId);
    const formData = new FormData(form);

    try {
        const response = await fetch(endpoint, {
            method: method,
            body: formData
        });

        if (response.ok) {
            console.log("submission successful");
            postSend(response);
        } else {
            console.log("submission not successful");
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}



async function fetchItems() {
    let items = [];
    try {
        const response = await fetch('http://localhost:3000/drinks/all');
        const itemNames = await response.json();

        itemNames.forEach(menuItem => {
            const item = new Item(menuItem);
            items.push(item);
        });
    } catch (error) {
        console.error("failed", error);
    }
    return items;
}

async function getItemByID(id, actionUponReceivingItem) {
    let encodedId = encodeURIComponent(id);
    let url = '/drinks/list?id=' + encodedId;
    let newItem = await fetch(url);
    let newItemJson = await newItem.json();
    newItemJson.forEach(item => {
        actionUponReceivingItem(item);
    });
}

class Item {
    _menuItem;
    _drinkName;
    constructor(menuItem) {
        this._menuItem = menuItem;
        this._createHTMLItem();
    }

    async _refreshItem(displayName) {
        // let encodedId = encodeURIComponent(this._menuItem.id);
        // let url = '/drinks/list?id=' + encodedId;
        // let newItem = await fetch(url);
        // let newItemJson = await newItem.json();
        // newItemJson.forEach(item => {
        //     this._menuItem = item;
        // })
        getItemByID(this._menuItem.id, (item) => {
            this._menuItem = item;
            this._drinkName.textContent = this._menuItem.name + " (id:" + this._menuItem.id + ")";
        });
    }

    _createHTMLItem() {
        let drink = document.createElement('div');
        drink.className = 'drink';
        let collapsed = document.createElement('div');
        collapsed.id = 'collapsed';
        let nameSide = document.createElement('div');
        nameSide.className = 'name-side';
        // nameSide.style.border = '5px solid red';
        this._drinkName = document.createElement('p');
        this._drinkName.textContent = this._menuItem.name + " (id:" + this._menuItem.id + ")";
        nameSide.appendChild(this._drinkName);
        let btnSide = document.createElement('div');
        btnSide.className = 'btn-side';
        // btnSide.style.border = '5px solid red';
        let pencilBtn = document.createElement('img');
        pencilBtn.className = 'logo';
        pencilBtn.src = 'pencil-solid.svg';
        pencilBtn.onclick = () => {
            // let collapsedElement = document.getElementById('collapsed');
            if (collapsed.nextElementSibling && collapsed.nextElementSibling.tagName === 'FORM') {
                console.log("removing form");
                collapsed.nextElementSibling.remove();
            } else {
                console.log("adding form");
                // Creating the Edit Form
                let editForm = document.createElement('form');
                editForm.action = "/edit-drinks";
                editForm.method = "POST";
                editForm.enctype = "multipart/form-data";


                // ID: [HIDDEN INPUT]
                let hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'id';
                hiddenInput.value = this._menuItem.id;
                editForm.appendChild(hiddenInput);

                // Drink Name
                let labelForName = document.createElement('label');
                labelForName.setAttribute('for', 'name');
                labelForName.textContent = 'Drink Name:';
                let inputName = document.createElement('input');
                inputName.type = 'text';
                inputName.id = 'name';
                inputName.name = 'name';
                inputName.value = this._menuItem.name;
                inputName.required = true;
                editForm.appendChild(labelForName);
                editForm.appendChild(inputName);

                // Price
                let labelPrice = document.createElement('label');
                labelPrice.setAttribute('for', 'price');
                labelPrice.textContent = 'Price (eg. 5.00):';
                let inputPrice = document.createElement('input');
                inputPrice.type = 'text';
                inputPrice.id = 'price';
                inputPrice.name = 'price';
                inputPrice.value = this._menuItem.price;
                inputPrice.required = true;
                editForm.appendChild(labelPrice);
                editForm.appendChild(inputPrice);

                // URL
                let labelURL = document.createElement('label');
                labelURL.setAttribute('for', 'url');
                labelURL.textContent = 'URL';
                let inputURL = document.createElement('input');
                inputURL.type = 'text';
                inputURL.id = 'url';
                inputURL.name = 'url';
                inputURL.value = this._menuItem.url;
                inputURL.required = true;
                editForm.appendChild(labelURL);
                editForm.appendChild(inputURL);


                // Description
                let labelDescription = document.createElement('label');
                labelDescription.setAttribute('for', 'description');
                labelDescription.textContent = 'Description:';
                let inputDescription = document.createElement('textarea');
                // inputDescription.type = 'text';
                inputDescription.id = 'edited-description';
                inputDescription.name = 'description';
                inputDescription.value = this._menuItem.description;
                inputDescription.required = true;
                editForm.appendChild(labelDescription);
                editForm.appendChild(inputDescription);


                // Image
                /*
                <label for="image">Image:</label>
                <img src="[pull from server]" width='100px' height='200px'></img>
                <input id="add-file" type="file" name="add-file" accept="image/*"> 
                */
                let labelEditImage = document.createElement('label');
                labelEditImage.setAttribute('for', 'image');
                labelEditImage.textContent = 'Old Image:';
                editForm.appendChild(labelEditImage);

                let oldImage = document.createElement('img');
                oldImage.style.width = '100px';
                oldImage.style.height = '200px';
                oldImage.src = this._menuItem.image;
                editForm.appendChild(oldImage);

                let labelInputEditedImage = document.createElement('label');
                labelInputEditedImage.textContent = "New Image:"
                let inputEditedImage = document.createElement('input');
                inputEditedImage.id = 'add-new-image';
                inputEditedImage.type = 'file';
                inputEditedImage.name = 'add-new-image';
                inputEditedImage.accept = 'image/*';
                editForm.appendChild(labelInputEditedImage);
                editForm.appendChild(inputEditedImage);

                // Drink dropdown
                let labelEditDrinkType = document.createElement('label');
                labelEditDrinkType.setAttribute('for', 'type');
                labelEditDrinkType.textContent = "Drink Type:";
                editForm.appendChild(labelEditDrinkType);


                let editDrinkType = document.createElement('select');
                editDrinkType.name = 'type'

                let option1 = document.createElement('option');
                option1.value = "s";
                option1.text = "Signature Drink";
                editDrinkType.appendChild(option1);

                let option2 = document.createElement('option');
                option2.value = "c";
                option2.text = "Coffee";
                editDrinkType.appendChild(option2);

                let option3 = document.createElement('option');
                option3.value = "t";
                option3.text = "Tea";
                editDrinkType.appendChild(option3);

                let option4 = document.createElement('option');
                option4.value = "i";
                option4.text = "Ice Blended";
                editDrinkType.appendChild(option4);

                editDrinkType.value = this._menuItem.type;

                editForm.appendChild(editDrinkType);


                // Submit Button
                let submitBtn = document.createElement('button');
                submitBtn.type = 'submit';
                submitBtn.style = "margin-top: 10px; margin-bottom: 10px;";
                submitBtn.textContent = "Edit"
                editForm.appendChild(submitBtn);

                let self = this;
                // editForm.addEventListener('submit', async (e) => {
                //     e.preventDefault();
                //     const formData = new FormData(editForm);

                //     const response = await fetch('/edit-drinks', {
                //         method: 'PUT',
                //         body: formData,
                //     });

                //     if (response.ok) {
                //         console.log('Upload successful');
                //         editForm.remove();
                //         self._refreshItem();
                //     } else {
                //         console.error('Upload failed');
                //     }
                // });
                editForm.addEventListener('submit', (e) => handleFormSubmit(e, editForm, '/edit-drinks', 'PUT', () => {
                    editForm.remove();
                    self._refreshItem(self._drinkName);
                }));

                drink.appendChild(editForm);
            }
        }


        let garbageBin = document.createElement('img');
        garbageBin.className = 'logo';
        garbageBin.src = 'trash-solid.svg';
        garbageBin.onclick = () => {
            fetch(`http://localhost:3000/delete/${this._menuItem.id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to delete item");
                }
                return response.text();
            })
            .then(message => {
                console.log(message);
                drink.remove();
            })
            .catch(error => {
                console.error("Error", error);
            });
        }

        drink.appendChild(collapsed);
        collapsed.append(nameSide, btnSide);
        btnSide.append(garbageBin, pencilBtn);

        document.getElementById('menu-drinks').appendChild(drink);
    }


}



document.addEventListener('DOMContentLoaded', (event) => {
    let addNewItemForm = document.getElementById("add-new-item");

    // addNewItemForm.addEventListener('submit', async (e) => {
    //     e.preventDefault();

    //     const formData = new FormData(addNewItemForm);
    //     const response = await fetch('/add-drink', {
    //         method: 'POST',
    //         body: formData,
    //     });

    //     // console.log(response);

    //     if (response.ok) {
    //         console.log("Upload successful");

    //     } else {
    //         console.log("Upload failed");
    //     }
    // });
    addNewItemForm.addEventListener('submit', (e) => handleFormSubmit(e, addNewItemForm, '/add-drink', 'POST', async (response) => {
        // let currentNumItems = (await items).length;
        // let encodedId = encodeURIComponent(currentNumItems + 1);
        // let url = '/drinks/list?id=' + encodedId;
        // let newItem = await fetch(url);
        // let newItemJson = await newItem.json();
        // newItemJson.forEach(item => {

        // });
        // console.log(this._menuItem);
        ////////////////////////////////////////
        // getItemByID(currentNumItems + 1, (item) => {
        //     const newItem = new Item(item);
        // });


        fetch('http://localhost:3000/get-latest')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed');
                }
                return response.json();
            })
            .then(item => {
                console.log(item);
                const newItem = new Item(item);
            })
            .catch(error => {
                console.error("Error in fetching latest item");
            });


    }));
});

let items = fetchItems();


