// __tests__/verifyNewAccount.test.js
const {checkDuplicateEmail} = require('../MIDDLEWARE/verifyNewAcount');
const db = require('../DATABASE/database');

jest.mock('../DATABASE/database');

describe('verifyNewAccount', () => {
  describe('checkDuplicateEmail', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call next() if no duplicate email is found', async () => {
      // Arrange
      const req = { body: { email: 'new@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      db.getCon = jest.fn().mockReturnValue({
        query: jest.fn((sql, params, callback) => {
          callback(null, []);
        }),
      });

      // Act
    
      await checkDuplicateEmail(req, res, next);

      // Assert
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should return an error if a duplicate email is found', async () => {
      // Arrange
      const req = { body: { email: 'test@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      db.getCon = jest.fn().mockReturnValue({
        query: jest.fn((sql, params, callback) => {
          callback(null, [{ email: 'test@example.com' }]);
        }),
      });

      // Act
      await checkDuplicateEmail(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Email already in use!' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return an error if there is an error during verification', async () => {
      // Arrange
      const req = { body: { email: 'test@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      db.getCon = jest.fn().mockReturnValue({
        query: jest.fn((sql, params, callback) => {
          callback(new Error('Database error'));
        }),
      });

      // Act
      await checkDuplicateEmail(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Error during verifing Email!' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});