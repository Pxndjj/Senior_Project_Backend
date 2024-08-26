const Queue = require('../models/queue');  // นำเข้า Queue โมเดลที่ใช้ในโค้ด
const { nextQueue } = require('../controllers/queue-controller');

jest.mock('../models/queue');  // Mock โมเดล Queue ทั้งหมด

describe('nextQueue', () => {
    it('should update the next available queue', async () => {
        const mockQueue = { _id: 'someId', queue_used: 0, queue_status: 'pending' };
        Queue.find = jest.fn().mockResolvedValue([mockQueue]);  // Mock find ฟังก์ชัน
        Queue.findOneAndUpdate = jest.fn().mockResolvedValue({ ...mockQueue, queue_used: 1, queue_status: 'called' });  // Mock findOneAndUpdate ฟังก์ชัน

        const result = await nextQueue('12345', 'called');

        expect(Queue.find).toHaveBeenCalledWith({ refID: '12345', queue_date: expect.any(String) });
        expect(Queue.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: mockQueue._id },
            { $set: expect.objectContaining({
                queue_used: 1,
                queue_status: 'called'
            })},
            { new: true }
        );
        expect(result).toBe(true);
    });

    it('should return false if no available queue is found', async () => {
        Queue.find = jest.fn().mockResolvedValue([]);  // Mock find ฟังก์ชันที่คืนค่าเป็นอาร์เรย์ว่าง

        const result = await nextQueue('12345', 'called');

        expect(Queue.find).toHaveBeenCalledWith({ refID: '12345', queue_date: expect.any(String) });
        expect(result).toBe(false);
    });
});
