const { checkEmailGoogle, updateRole } = require('../controllers/user-controller'); // Import the functions to be tested
const User = require('../models/user'); // Import the User model

jest.mock('../models/user'); // Mock the User model

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should check if an email is already registered via Google', async () => {
        const mockUser = { _id: 'someId' };
        
        const mockSelect = jest.fn().mockResolvedValue(mockUser);
        User.findOne.mockReturnValue({ select: mockSelect });

        const result = await checkEmailGoogle('test@example.com');

        expect(result).toEqual(mockUser);
        expect(User.findOne).toHaveBeenCalledWith({ userEmail: 'test@example.com' });
        expect(mockSelect).toHaveBeenCalledWith('_id');
    });

    it('should update the role of a user', async () => {
        const mockUser = { id: 'someId', userRole: 'admin' };
        User.findOneAndUpdate.mockResolvedValue(mockUser);

        const credentials = { id: 'someId', role: 'admin' };
        const result = await updateRole(credentials);

        expect(result).toEqual(mockUser);
        expect(User.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: credentials.id },
            { userRole: credentials.role },
            { returnOriginal: false }
        );
    });
});
