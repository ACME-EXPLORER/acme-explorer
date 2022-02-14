import mongoose from "mongoose";
const { Schema } = mongoose;

export default {
  Finder: new Schema(
    {
      keyword: {
        type: String,
        required: true,
      },
      minPrice: {
        type: Number,
        required: true,
      },
      createdAt: Number,
      updatedAt: Number,
    },
    {
      timestamps: { currentTime: () => moment().unix() },
    }
  ),
};
