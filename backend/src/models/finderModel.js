import mongoose from 'mongoose';
import moment from 'moment';

const { Schema } = mongoose;

const FinderSchema = new Schema(
  {
    keyword: {
      type: String,
      default: null
    },
    minPrice: {
      type: Number,
      default: null
    },
    maxPrice: {
      type: Number,
      default: null
    },
    startDate: {
      type: Number,
      default: null
    },
    endDate: {
      type: Number,
      default: null
    },
    createdAt: Number,
    updatedAt: Number
  },
  {
    timestamps: { currentTime: () => moment().unix() }
  }
);

FinderSchema.index({ keyword: 'text' });

module.exports = mongoose.model('Finders', FinderSchema);
