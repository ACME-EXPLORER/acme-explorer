import { Types } from 'mongoose';
import { updateConfiguration } from '../../src/controllers/configurationController.js';
import { configurationModel } from '../../src/models/configurationModel.js';

describe('Configuration Controller', () => {
  const req = {
    params: {
      configurationId: new Types.ObjectId()
    }
  };

  const res = {
    json: jest.fn(),
    status: {
      send: jest.fn()
    },
    sendStatus: jest.fn()
  };

  describe('updateConfiguration', () => {
    it('should call configurationModel.findOneAndUpdate', async () => {
      // Arrange
      configurationModel.findOneAndUpdate = jest.fn().
        mockReturnValue(Promise.resolve([
          {
            _id: new Types.ObjectId()
          }
        ]));

      // Act
      await updateConfiguration(req, res);

      // Assert
      expect(configurationModel.findOneAndUpdate).toHaveBeenCalled();
    });
  });
});
