const {
    Schema,
    model,
    Types
} = require('mongoose');
// const {
//     stringify
// } = require('querystring');
//const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/]
    },
    thoughts: {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    },
    friends: [ this ]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    // the id false below prevents virtuals from making a duplicate _id as `id`
    id: false
});

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// UserSchema.virtual('friendId', {
//     ref: 'User',
//     localField: 'friends',
//     foreignField: '__id'
// });

const User = model('User', UserSchema);

module.exports = User;