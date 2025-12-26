import mongoose from "mongoose";

const VisionSchema = new mongoose.Schema(
  {
    userId: String,
    visionStatement: String,
    areas: [String],
    finalGoals: [
      {
        text: String,
        // FIX: Wrap the definition when the field name is 'type'
        type: { type: String }, 
        subTasks: [
          {
            text: String,
            done: Boolean
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

// Helper to prevent model overwrite errors during hot-reload
export default mongoose.models.Vision || mongoose.model("Vision", VisionSchema);