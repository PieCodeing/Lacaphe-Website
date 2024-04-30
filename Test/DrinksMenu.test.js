/**
 * @jest-environment jsdom
 */

// Import the function to test
const { createDrinkElements } = require('../COMPONENTS/drinksJS.js');

// Mock the necessary DOM elements
document.body.innerHTML = '<div class="menu"></div>';

// Run the function under test
const menuData = [
    {
        category: "Coffee",
        drinks: [
            { name: "MUỐI", description: "salted phin-dripped milk coffee, cloud cream", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=6#3"  },
            { name: "COCONUT", description: "phin-dripped coffee, coconut cream, grass jelly", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=15#3"  },
            { name: "UBE", description: "phin-dripped coffee, ube fresh milk", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=17#3"  },
            { name: "NÂU", description: "vietnamese coffee", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=14#3"  },
            { name: "BẠC XỈU", description: "lighter version of Nâu, less caffeinated", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=20#3"  }
        ]
    },
    {
        category: "Tea & Milk Tea",
        drinks: [
            { name: "LYCHEE", description: "premium lotus tea, fresh lychee pulps", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=16#4"},
            { name: "STRAWBERRY", description: "full-leaf oolong tea, homemade strawberries",link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=13#4" },
            { name: "KUMQUAT CHIA", description: "kumquat lotus tea, chia seeds, aloe vera", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=8#4" },
            { name: "HOUSE MILK TEA", description: "oolong jasmine milk tea, oolong pearls", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=4#4"  },
            { name: "GOLDEN LOTUS", description: "full-leaf oolong tea, lotus seeds, cloud cream", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=9#4"  }
        ]
    },
    {
        category: "Ice Blended",
        drinks: [
            { name: "KUMQUAT SALTED PLUM", description: "kumquat juice blended with salted plum and mint", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=12#5"  },
            { name: "COCOMANGO", description: "coconut milk blended with fresh mango bits", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=11#5"  },
            { name: "SAIGON FREEZE", description: "Signature Saigon but blended", link: "https://lacaphe.square.site/?location=11ee213d7e10ea94b2b23cecef6d5b2a&item=18#5"  }
        ]
    }
];

// Now you can proceed with testing your createDrinkElements function
createDrinkElements(menuData);


// Write your test cases
test('createDrinkElements correctly creates DOM elements', () => {
    // Assert that the correct number of categories are created
    const categories = document.querySelectorAll('.menu > div');
    expect(categories.length).toBe(menuData.length);

    // Assert that each category contains the correct number of drinks
    categories.forEach((category, index) => {
        const drinks = category.querySelectorAll('.menu-drink');
        expect(drinks.length).toBe(menuData[index].drinks.length);

        // Assert that each drink has the correct name, description, and link
        menuData[index].drinks.forEach((drink, drinkIndex) => {
            const drinkElement = drinks[drinkIndex];
            expect(drinkElement.querySelector('h3').textContent).toBe(drink.name);
            expect(drinkElement.querySelector('p').textContent).toBe(drink.description);
            expect(drinkElement.querySelector('a').href).toBe(drink.link);
        });
    });
});
