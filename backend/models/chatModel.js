import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },

    history: {
        type: [String],
        default: []
    },

})

export const Chat = mongoose.model("Chat", chatSchema)