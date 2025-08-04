import mongoose ,{Schema} from "mongoose";
import {AvailableTaskStatuses,TaskStatusEnum} from "../utils/constants.js"
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: AvailableTaskStatuses,
      default: TaskStatusEnum.TODO,
    },
    attachments: {
      type: [
        {
          url: String,
          mimetype: String,
          size: Number,
        },
      ],
    },

    defult: [],
  },
  { timestamps: true },
);


export const Task = mongoose.model("Task", taskSchema);