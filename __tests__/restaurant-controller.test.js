const { 
    acceptRestuarant, 
    init, 
    create, 
    update, 
    findByID, 
    findAll, 
    countRestaurants, 
    findByRefID 
} = require('../controllers/restaurant-controller');
const Restaurant = require('../models/restaurant');

jest.mock('../models/restaurant');  // Mock the Restaurant model

describe('Restaurant Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();  // Clear mocks after each test
    });

    it('should create a new restaurant', async () => {
        const mockRestaurant = { name: 'Test Restaurant' };
        Restaurant.create.mockResolvedValue(mockRestaurant);
        
        const result = await create(mockRestaurant);
        
        expect(Restaurant.create).toHaveBeenCalledWith(mockRestaurant);
        expect(result).toEqual(mockRestaurant);
    });

    it('should update a restaurant', async () => {
        const mockRestaurant = { _id: '12345', name: 'Updated Restaurant' };
        Restaurant.findOneAndUpdate.mockResolvedValue(mockRestaurant);
        
        const result = await update(mockRestaurant);
        
        expect(Restaurant.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: mockRestaurant._id },
            { $set: mockRestaurant },
            { new: true }
        );
        expect(result).toEqual(mockRestaurant);
    });

    it('should accept a restaurant', async () => {
        const mockRestaurant = { _id: '12345', status: 'active' };
        Restaurant.findOneAndUpdate.mockResolvedValue(mockRestaurant);
        
        const result = await acceptRestuarant(mockRestaurant._id);
        
        expect(Restaurant.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: mockRestaurant._id },
            { $set: { status: 'active' } },
            { new: true }
        );
        expect(result).toEqual(mockRestaurant);
    });

    it('should find a restaurant by ID', async () => {
        const mockRestaurant = { _id: '12345' };
        Restaurant.find.mockResolvedValue([mockRestaurant]);
        
        const result = await findByID(mockRestaurant._id);
        
        expect(Restaurant.find).toHaveBeenCalledWith({ "_id": mockRestaurant._id });
        expect(result).toEqual([mockRestaurant]);
    });

    it('should find a restaurant by refID', async () => {
        const mockRestaurant = { refID: 'abc123' };
        Restaurant.find.mockResolvedValue([mockRestaurant]);
        
        const result = await findByRefID(mockRestaurant.refID);
        
        expect(Restaurant.find).toHaveBeenCalledWith({ "refID": mockRestaurant.refID });
        expect(result).toEqual([mockRestaurant]);
    });

    it('should find all restaurants', async () => {
        const mockRestaurants = [{ name: 'Restaurant 1' }, { name: 'Restaurant 2' }];
        Restaurant.find.mockResolvedValue(mockRestaurants);
        
        const result = await findAll();
        
        expect(Restaurant.find).toHaveBeenCalled();
        expect(result).toEqual(mockRestaurants);
    });

    it('should count all restaurants', async () => {
        Restaurant.countDocuments.mockResolvedValue(10);
        
        const result = await countRestaurants();
        
        expect(Restaurant.countDocuments).toHaveBeenCalled();
        expect(result).toBe(10);
    });

    it('should initialize a new restaurant', async () => {
        const mockRestaurant = { refID: 'abc123', name: '' };
        Restaurant.create.mockResolvedValue(mockRestaurant);
        
        const result = await init(mockRestaurant.refID);
        
        expect(Restaurant.create).toHaveBeenCalled();
        expect(result.refID).toBe(mockRestaurant.refID);
    });
});
