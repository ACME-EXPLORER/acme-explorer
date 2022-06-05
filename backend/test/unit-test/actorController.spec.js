import { Types } from 'mongoose';
import { findActors, findActor, deleteActor, banActor } from '../../src/controllers/actorController.js';
import { actorModel } from '../../src/models/actorModel.js';
import { faker } from '@faker-js/faker';
import { BasicState, Roles } from '../../src/shared/enums.js';

describe('Actor Controller', () => {
  const req = {
    params: {
      actorId: new Types.ObjectId()
    }
  };

  const res = {
      json: jest.fn(),
      status: jest.fn(),
      sendStatus: jest.fn()
  };

  describe('findActors', () => {
    it('should call actorModel.find', async () => {
      // Arrange
      actorModel.find = jest.fn().
        mockReturnValue(Promise.resolve([]));
    
      // Act
      await findActors(req, res);

      // Assert
      expect(actorModel.find).toHaveBeenCalled();
    });
  });

  describe('findActor', () => {
    it('should call actorModel.findById', async () => {
      // Arrange
      actorModel.findById = jest.fn().
        mockReturnValue(Promise.resolve([
          {
            _id: new Types.ObjectId(),
            name: faker.lorem.word(),
            role: faker.random.arrayElement(Object.values(Roles)),
            state: faker.random.arrayElement(Object.values(BasicState))
          }
        ]));

      // Act
      await findActor(req, res, null);

      // Assert
      expect(actorModel.findById).toHaveBeenCalled();
    });
  });

  describe('deleteActor', () => {
    it('should call actorModel.deleteOne', async () => {
      // Arrange
      actorModel.deleteOne = jest.fn().
        mockReturnValue(Promise.resolve([]));
    
      // Act
      await deleteActor(req, res);

      // Assert
      expect(actorModel.deleteOne).toHaveBeenCalled();
    });
  })

  describe('banActor', () => {
    it('should call actorModel.findOneAndUpdate', async () => {
      // Arrange
      actorModel.findOneAndUpdate = jest.fn().
      mockReturnValue(Promise.resolve([]));
    
      // Act
      await banActor(req, res);

      // Assert
      expect(actorModel.findOneAndUpdate).toHaveBeenCalled();
    });
  });
});
