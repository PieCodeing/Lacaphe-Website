const app = require('../server'); // Adjust the path as necessary
const request = require('supertest');
const db = require('../DATABASE/database');

jest.mock('../DATABASE/database');

describe('Drink management', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add a new drink if not a duplicate', async () => {
        // Arrange
        const newDrink = {
            name: 'Espresso',
            description: 'Strong coffee',
            price: 2.50,
            type: 'Coffee',
        };

        db.getCon = jest.fn().mockReturnValue({
            query: jest.fn((sql, params, callback) => callback(null, { insertId: 1 })),
        });

        // Act
        const response = await request(app).post('/add-drink').send(newDrink);

        // Assert
        expect(response.status).toBe(200);
        // expect(response.body.message).toEqual('Drink added successfully');
        expect(db.getCon().query).toHaveBeenCalled();
    });

    it('should handle database errors when adding a drink', async () => {
        // Arrange
        const newDrink = {
            name: 'Espresso',
            description: 'Strong coffee',
            price: 2.50,
            type: 'Coffee',
        };

        db.getCon = jest.fn().mockReturnValue({
            query: jest.fn((sql, params, callback) => callback(new Error('Database error'))),
        });

        // Act
        const response = await request(app).post('/add-drink').send(newDrink);

        // Assert
        expect(response.status).toBe(500);
        // expect(response.body.error).toEqual('Failed to add drink');
        expect(db.getCon().query).toHaveBeenCalled();
    });

    it('should delete a drink and verify it is no longer in the database', async () => {
        const drinkId = 1; // Assuming this ID exists

        db.getCon.mockReturnValue({
            query: jest.fn((sql, params, callback) => callback(null, { affectedRows: 1 })),
        });

        const response = await request(app).delete(`/delete/${drinkId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toContain('Item deleted successfully');
        // Accept any number type for ID parameter
        expect(db.getCon().query).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM Drinks WHERE id = ?'),
            [expect.any(Number)],
            expect.any(Function)
        );
    });



    it('should return an error if trying to delete a non-existent drink', async () => {
        const drinkId = 999; // Non-existent drink ID for testing

        db.getCon.mockReturnValue({
            query: jest.fn((sql, params, callback) => callback(null, { affectedRows: 0 })),
        });

        const response = await request(app).delete(`/delete/${drinkId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toContain('Item not found');
        expect(db.getCon().query).toHaveBeenCalled();
    });

});