import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({

    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },

    name: {
        type: String,
        required: true
    },

    type: {
        type: String,       
        required: true
    },

})

projectSchema.virtual("files", {
  ref: "File",
  localField: "_id",
  foreignField: "projectId",
});


projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });
export const Project = mongoose.model("Project", projectSchema)