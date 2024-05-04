const app = require('../server');
const request = require('supertest');
const db = require('../DATABASE/database');

jest.mock('../DATABASE/database');

describe('Drink management', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a new drink if not a duplicate', async () => {
        const newDrink = {
            'add-new-item-name': 'Espresso',          // Change field names
            'add-new-item-description': 'Strong coffee',
            'add-new-item-price': '2.50',             // Ensure this is a string if your server expects a string
            'add-new-item-type': 'Coffee',
            'add-new-item-url': 'https://www.google.com'
        };

        db.getCon = jest.fn().mockReturnValue({
            query: jest.fn((sql, params, callback) => callback(null, { insertId: 1 })),
        });

        const response = await request(app).post('/add-drink').send(newDrink);

        expect(response.status).toBe(200);
        expect(db.getCon().query).toHaveBeenCalled();
    });

    it('should handle database errors when adding a drink', async () => {
        const newDrink = {
            'add-new-item-name': 'Espresso',          // Change field names
            'add-new-item-description': 'Strong coffee',
            'add-new-item-price': '2.50',             // Ensure this is a string if your server expects a string
            'add-new-item-type': 'Coffee',
        };

        db.getCon = jest.fn().mockReturnValue({
            query: jest.fn((sql, params, callback) => callback(new Error('Database error'))),
        });

        const response = await request(app).post('/add-drink').send(newDrink);

        expect(response.status).toBe(500);
        // expect(response.body.error).toEqual('Failed to add drink');
        expect(db.getCon().query).toHaveBeenCalled();
    });

    it('should delete a drink and verify it is no longer in the database', async () => {
        const drinkId = 1;

        db.getCon.mockReturnValue({
            query: jest.fn((sql, params, callback) => callback(null, { affectedRows: 1 })),
        });

        const response = await request(app).delete(`/delete/${drinkId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toContain('Item deleted successfully');
        expect(db.getCon().query).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM Drinks WHERE id = ?'),
            [expect.any(Number)],
            expect.any(Function)
        );
    });



    it('should return an error if trying to delete a non-existent drink', async () => {
        const drinkId = 999;

        db.getCon.mockReturnValue({
            query: jest.fn((sql, params, callback) => callback(null, { affectedRows: 0 })),
        });

        const response = await request(app).delete(`/delete/${drinkId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toContain('Item not found');
        expect(db.getCon().query).toHaveBeenCalled();
    });

    it('should update a drink when valid data is provided', async () => {
        const drinkId = 1;
        const updatedDrink = {
            id: drinkId,
            name: 'Updated Espresso',
            description: 'Updated strong coffee',
            price: 3.00,
            type: 'Coffee',
            url: 'https://www.yahoo.com'
        };

        db.getCon.mockReturnValue({
            query: jest.fn((sql, params, callback) => callback(null, { affectedRows: 1 })),
        });

        const response = await request(app)
            .put('/edit-drinks')
            .send(updatedDrink);

        expect(response.status).toBe(200);
        expect(db.getCon().query).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE Drinks SET name = ?, price = ?, description = ?, type = ?, url = ? WHERE id = ?'),
            [updatedDrink.name, updatedDrink.price, updatedDrink.description, updatedDrink.type, updatedDrink.url, drinkId],
            expect.any(Function)
        );
    });
});
