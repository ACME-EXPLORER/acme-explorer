import mongoose, { Schema } from 'mongoose';

const SponsorshipSchema = new Schema(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      default: null
    },
    banner: { type: String, default: null },
    link: { type: String, default: null },
    state: {
      type: String,
      required: true,
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

module.exports = mongoose.model('Sponsorships', SponsorshipSchema);
