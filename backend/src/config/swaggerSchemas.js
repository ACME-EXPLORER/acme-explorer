import m2s from 'mongoose-to-swagger';
import { actorModel } from '../models/actorModel.js';
import { applicationModel } from '../models/applicationModel.js';
import { finderModel } from '../models/finderModel.js';
import { sponsorshipModel } from '../models/sponsorshipModel.js';
import { tripModel } from '../models/tripModel.js';

const schemaOptions = {
  omitFields: ['_id', 'createdAt', 'updatedAt']
};

export default {
  actor: m2s(actorModel, schemaOptions),
  application: m2s(applicationModel, schemaOptions),
  finder: m2s(finderModel, schemaOptions),
  sponsorship: m2s(sponsorshipModel, schemaOptions),
  trip: m2s(tripModel, schemaOptions)
};
