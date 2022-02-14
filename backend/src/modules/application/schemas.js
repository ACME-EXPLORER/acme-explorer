import mongoose from "mongoose";
const { Schema } = mongoose;

export default {
  Application: new Schema(
    {
      explorer: { type: Schema.Types.ObjectId, ref: "Actor" },
      state: {
        type: String,
        required: true,
        enum: ["pending", "rejected", "due", "accepted"],
        default: "pending",
      },
      comment: String,
      rejectedReason: String,
      isPaid: { type: Boolean, default: false },
    },
    { timestamps: true }
  ),
};
