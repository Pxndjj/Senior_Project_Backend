const { checkAdmin, init } = require('../controllers/admin-controller');
const Admin = require('../models/admin');

jest.mock('../models/admin');

describe('Admin Controller', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        it('should create a new admin record', async () => {
            const mockAdmin = { email: "admin@gmail.com" };
            Admin.create.mockResolvedValue(mockAdmin);

            const result = await init();

            expect(result).toEqual(mockAdmin);
            expect(Admin.create).toHaveBeenCalledWith({ email: "admin@gmail.com" });
        });
    });

    describe('checkAdmin', () => {
        it('should return an admin record if email exists', async () => {
            const mockAdmin = { email: "admin@gmail.com" };
            Admin.findOne.mockResolvedValue(mockAdmin);

            const result = await checkAdmin(mockAdmin.email);

            expect(result).toEqual(mockAdmin);
            expect(Admin.findOne).toHaveBeenCalledWith({ $or: [{ email: mockAdmin.email }] });
        });

        it('should return null if email does not exist', async () => {
            Admin.findOne.mockResolvedValue(null);

            const result = await checkAdmin('nonexistent@example.com');

            expect(result).toBeNull();
            expect(Admin.findOne).toHaveBeenCalledWith({ $or: [{ email: 'nonexistent@example.com' }] });
        });
    });
});
