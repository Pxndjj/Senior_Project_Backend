// __tests__/review-controller.test.js
const { create, update, remove, findByID } = require('../controllers/review-controller');
const Review = require('../models/review');

// Mock the Review model
jest.mock('../models/review');

describe('Review Controller', () => {
  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test the create function
  it('should create a new review', async () => {
    const reviewData = { title: 'Great Restaurant', content: 'Loved the food!', restaurantID: '12345' };
    Review.create.mockResolvedValue(reviewData);

    const result = await create(reviewData);
    expect(Review.create).toHaveBeenCalledWith(reviewData);
    expect(result).toEqual(reviewData);
  });

  // Test the update function
  it('should update an existing review', async () => {
    const reviewID = '12345';
    const updateData = { content: 'Amazing experience!' };
    const updatedReview = { _id: reviewID, ...updateData };
    Review.findOneAndUpdate.mockResolvedValue(updatedReview);

    const result = await update(reviewID, updateData);
    expect(Review.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: reviewID },
      { $set: updateData },
      { new: true }
    );
    expect(result).toEqual(updatedReview);
  });

  // Test the remove function
  it('should delete a review', async () => {
    const reviewID = '12345';
    const deletedReview = { _id: reviewID, title: 'Old Review' };
    Review.findOneAndDelete.mockResolvedValue(deletedReview);

    const result = await remove(reviewID);
    expect(Review.findOneAndDelete).toHaveBeenCalledWith({ _id: reviewID });
    expect(result).toEqual(deletedReview);
  });

  // Test the findByID function
  it('should find a review by ID', async () => {
    const reviewID = '12345';
    const reviewData = { _id: reviewID, title: 'Some Review' };
    Review.findById.mockResolvedValue(reviewData);

    const result = await findByID(reviewID);
    expect(Review.findById).toHaveBeenCalledWith({ _id: reviewID });
    expect(result).toEqual(reviewData);
  });
});
