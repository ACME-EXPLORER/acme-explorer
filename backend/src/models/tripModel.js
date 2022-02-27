const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StageSchema = new Schema({
  title: {
    type: String,
    required: 'Kindly enter the title of the stage'
  },
  description: {
    type: String,
    required: 'Kindly enter the description of the stage'
  },
  price: {
    type: Number,
    min: 0,
    required: 'Kindly enter the price of the stage'
  }

})

const State = [
  'ACTIVE',
  'INACTIVE',
  'CANCELLED',
  'STARTED'
]

  // TODO: Define indexes
  // TODO: Add pre methods
  // TODO: strict: false ???
  const TripSchema = new Schema({
    ticker: {
      type: String,
      unique: true,
      validate: {
        validator: function(v) {
          return /\d{6}-[A-Z]{4}/.test(v);
        },
        message: 'ticker is not valid, Pattern is: "220527-ABCD"'
      }
    },
    title: {
      type: String,
      required: 'Title is required'
    },
    description: {
      type: String,
      required: 'Description is required'
    },
    price: {
      type: Number,
      min: 0
    },
    requirements: {
      type: [String],
      default: []
    },
    // startDate must be in the future
    startDate: {
      type: Date,
      required: 'Start date is required',
      validate: {
        validator: function(v) {
          return v > new Date();
        },
        message: 'Start date must be in the future'
      }
    },
    endDate: {
      type: Date,
      required: 'End date is required',
      validate: {
        validator: function(v) {
          return v > this.startDate;    // StartDate before endDate
        }
      }
    },
    pictures: {
      type: [String],
      default: []
    },
    state: {
      type: String,
      required: true,
      enum: State,
      default: 'INACTIVE'
    },
    reasonCancelled: {
      type: String
    },
    stages: [{  // TODO: MinSize = 1
      type: Schema.Types.ObjectId,
      ref: 'Stage'
    }],

    // TODO: Add userId (MANAGER)
    // manager: { type: Schema.Types.ObjectId, ref: 'Actor', default: null },
  });

TripSchema.index({ ticker: 'text', title: 'text', description: 'text' });

// TODO: Generate ticker
TripSchema.pre('save', (callback) => {
  callback();
});


module.exports = mongoose.model('Trip', TripSchema);
module.exports = mongoose.model('Stage', StageSchema);
module.exports = State;
// export const tripModel = mongoose.model('Trips', TripSchema);
