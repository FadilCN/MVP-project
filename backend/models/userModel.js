import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  
})

userSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "userId",
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });


export const User = mongoose.model("User", userSchema)

