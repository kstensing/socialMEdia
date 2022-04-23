const {
    Schema,
    model
} = require('mongoose');
//const dateFormat = require('../utils/dateFormat');

const ThoughtSchema = new Schema({
            thoughtText: {
                type: String,
                required: true,
                trim: true
            },
            createdAt: {
                type: Date,
                default: Date.now,
                //get: createdAtVal => dateFormat(createdAtVal)
            },
            username: {
                type: String,
                required: true
            },
            reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        //id: false
    }
);

ThoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});


//add reaction schema


const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;