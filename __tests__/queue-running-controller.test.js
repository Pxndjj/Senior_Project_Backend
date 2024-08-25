// __tests__/queue-running-controller.test.js

const { getNextSequenceValue, getNextSequenceManyValue } = require('../controllers/queue-running-controller');
const QueueRunning = require('../models/queue-running');

// Mock the QueueRunning model
jest.mock('../models/queue-running');

describe('QueueRunning Controller', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNextSequenceValue', () => {
    it('should increment auto_sequence by 1 and return the updated value', async () => {
      const mockSequenceDoc = { auto_sequence: 5 };
      QueueRunning.findOneAndUpdate.mockResolvedValue(mockSequenceDoc);

      const result = await getNextSequenceValue('testRunBy', 'testRefID');

      expect(QueueRunning.findOneAndUpdate).toHaveBeenCalledWith(
        { run_by: 'testRunBy', refID: 'testRefID' },
        { $inc: { auto_sequence: 1 } },
        { new: true, upsert: true }
      );
      expect(result).toBe(mockSequenceDoc.auto_sequence);
    });
  });

  describe('getNextSequenceManyValue', () => {
    it('should increment auto_sequence by the specified count and return the updated value', async () => {
      const mockSequenceDoc = { auto_sequence: 10 };
      QueueRunning.findOneAndUpdate.mockResolvedValue(mockSequenceDoc);

      const result = await getNextSequenceManyValue('testRunBy', 'testRefID', 3);

      expect(QueueRunning.findOneAndUpdate).toHaveBeenCalledWith(
        { run_by: 'testRunBy', refID: 'testRefID' },
        { $inc: { auto_sequence: 3 } },
        { new: true, upsert: true }
      );
      expect(result).toBe(mockSequenceDoc.auto_sequence);
    });
  });

});
