const { create, update, remove, findByID, findAll, findByRefID } = require('../controllers/gallery-controller');
const Gallery = require('../models/gallery');

// Mock the Gallery model
jest.mock('../models/gallery');

describe('Gallery Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new gallery entry', async () => {
            const mockGallery = { refID: '123', fileName: 'image.jpg' };
            Gallery.create.mockResolvedValue(mockGallery);

            const result = await create(mockGallery);

            expect(Gallery.create).toHaveBeenCalledWith(mockGallery);
            expect(result).toEqual(mockGallery);
        });
    });

    describe('update', () => {
        it('should update a gallery entry', async () => {
            const mockGallery = { refID: '123', fileName: 'new-image.jpg' };
            const id = 'mockId';
            Gallery.findOneAndUpdate.mockResolvedValue(mockGallery);

            const result = await update(id, mockGallery);

            expect(Gallery.findOneAndUpdate).toHaveBeenCalledWith({ _id: id }, { $set: mockGallery }, { new: true });
            expect(result).toEqual(mockGallery);
        });
    });

    describe('remove', () => {
        it('should delete a gallery entry', async () => {
            const mockGallery = { _id: 'mockId', refID: '123', fileName: 'image.jpg' };
            Gallery.findOneAndDelete.mockResolvedValue(mockGallery);

            const result = await remove(mockGallery._id);

            expect(Gallery.findOneAndDelete).toHaveBeenCalledWith({ _id: mockGallery._id });
            expect(result).toEqual(mockGallery);
        });
    });

    describe('findByID', () => {
        it('should find a gallery entry by ID', async () => {
            const mockGallery = { _id: 'mockId', refID: '123', fileName: 'image.jpg' };
            Gallery.findById.mockResolvedValue(mockGallery);

            const result = await findByID(mockGallery._id);

            expect(Gallery.findById).toHaveBeenCalledWith(mockGallery._id);
            expect(result).toEqual(mockGallery);
        });
    });

    describe('findAll', () => {
        it('should find all gallery entries', async () => {
            const mockGalleries = [
                { _id: '1', refID: '123', fileName: 'image1.jpg' },
                { _id: '2', refID: '124', fileName: 'image2.jpg' }
            ];
            Gallery.find.mockResolvedValue(mockGalleries);

            const result = await findAll();

            expect(Gallery.find).toHaveBeenCalled();
            expect(result).toEqual(mockGalleries);
        });
    });

    describe('findByRefID', () => {
        it('should find gallery entries by refID', async () => {
            const mockGalleries = [
                { _id: '1', refID: '123', fileName: 'image1.jpg' }
            ];
            const refID = '123';
            Gallery.find.mockResolvedValue(mockGalleries);

            const result = await findByRefID(refID);

            expect(Gallery.find).toHaveBeenCalledWith({ "refID": refID });
            expect(result).toEqual(mockGalleries);
        });
    });
});
