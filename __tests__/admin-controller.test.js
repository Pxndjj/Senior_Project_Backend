const { checkAdmin } = require('../controllers/admin-controller');
const Admin = require('../models/admin');

// Mock the Admin model
jest.mock('../models/admin');

describe('checkAdmin', () => {
    it('should return the admin data when the email exists', async () => {
        // Arrange
        const mockEmail = 'test@example.com';
        const mockAdminData = { email: mockEmail };
        
        // Mock the Admin.findOne method
        Admin.findOne.mockResolvedValue(mockAdminData);
        
        // Act
        const result = await checkAdmin(mockEmail);
        
        // Assert
        expect(Admin.findOne).toHaveBeenCalledWith({ $or: [{ email: mockEmail }] });
        expect(result).toEqual(mockAdminData);
    });

    it('should return null when the email does not exist', async () => {
        // Arrange
        const mockEmail = 'notfound@example.com';
        
        // Mock the Admin.findOne method
        Admin.findOne.mockResolvedValue(null);
        
        // Act
        const result = await checkAdmin(mockEmail);
        
        // Assert
        expect(Admin.findOne).toHaveBeenCalledWith({ $or: [{ email: mockEmail }] });
        expect(result).toBeNull();
    });
});
