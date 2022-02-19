import mongoose, { Schema } from 'mongoose';

const ActorSchema = new Schema(
  {
    name: {
      type: String,
      required: 'You need to provide a name'
    },
    surname: {
      type: String,
      required: 'You need to provide the surname'
    },
    email: {
      type: String,
      required: 'You need to provide a email address',
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    preferredLanguage: {
      type: String,
      required: 'Please select the preferred language',
      enum: ['en', 'es'],
      default: 'es'
    },
    role: {
      type: String,
      required: 'The user must be have one role',
      enum: ['explorer', 'sponsor', 'manager', 'admin']
    },
    state: {
      type: String,
      required: 'You need to provide a state',
      enum: ['active', 'inactive'],
      default: 'active'
    },
    createdAt: Number,
    updatedAt: Number
  },
  {
    timestamps: { currentTime: () => moment().unix() }
  }
);

module.exports = mongoose.model('Actors', ActorSchema);
