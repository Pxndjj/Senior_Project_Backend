const {
    create,
    update,
    remove,
    findByID,
    findAll,
    findByRefID
} = require('../controllers/uploadfile-controller'); // นำเข้าฟังก์ชันที่ต้องการทดสอบ
const Uploadfile = require('../models/uploadfile'); // นำเข้าโมเดลที่เกี่ยวข้อง

jest.mock('../models/uploadfile'); // Mock the Uploadfile model

describe('Uploadfile Controller', () => {

    afterEach(() => {
        jest.clearAllMocks(); // ล้าง mock หลังจากทดสอบเสร็จในแต่ละ test
    });

    it('should create a new uploadfile record', async () => {
        const mockFile = { filename: 'test.png', refID: '12345' };

        // Mock the create function to return the mockFile
        Uploadfile.create.mockResolvedValue(mockFile);

        const result = await create(mockFile);

        expect(result).toEqual(mockFile);
        expect(Uploadfile.create).toHaveBeenCalledWith(mockFile);
    });

    it('should update an existing uploadfile record', async () => {
        const mockFile = { _id: 'someId', filename: 'updated.png' };

        // Mock the update function
        Uploadfile.findOneAndUpdate.mockResolvedValue(mockFile);

        const result = await update(mockFile._id, { filename: 'updated.png' });

        expect(result).toEqual(mockFile);
        expect(Uploadfile.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: mockFile._id }, 
            { $set: { filename: 'updated.png' } }, 
            { new: true }
        );
    });

    it('should delete an uploadfile record', async () => {
        const mockFile = { _id: 'someId', filename: 'test.png' };

        // Mock the remove function
        Uploadfile.findOneAndDelete.mockResolvedValue(mockFile);

        const result = await remove(mockFile._id);

        expect(result).toEqual(mockFile);
        expect(Uploadfile.findOneAndDelete).toHaveBeenCalledWith({ _id: mockFile._id });
    });

    it('should find an uploadfile by ID', async () => {
        const mockFile = { _id: 'someId', filename: 'test.png' };

        // Mock the findByID function
        Uploadfile.findById.mockResolvedValue(mockFile);

        const result = await findByID(mockFile._id);

        expect(result).toEqual(mockFile);
        expect(Uploadfile.findById).toHaveBeenCalledWith(mockFile._id);
    });

    it('should find all uploadfiles', async () => {
        const mockFiles = [{ filename: 'test1.png' }, { filename: 'test2.png' }];

        // Mock the findAll function
        Uploadfile.find.mockResolvedValue(mockFiles);

        const result = await findAll();

        expect(result).toEqual(mockFiles);
        expect(Uploadfile.find).toHaveBeenCalled();
    });

    it('should find uploadfiles by refID', async () => {
        const mockFiles = [{ filename: 'test1.png', refID: '12345' }, { filename: 'test2.png', refID: '12345' }];

        // Mock the findByRefID function
        Uploadfile.find.mockResolvedValue(mockFiles);

        const result = await findByRefID('12345');

        expect(result).toEqual(mockFiles);
        expect(Uploadfile.find).toHaveBeenCalledWith({ refID: '12345' });
    });
});
