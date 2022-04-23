const {
    Schema,
    model
} = require('mongoose');
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
                type: Date,
                default: Date.now,
                get: createdAtVal => dateFormat(createdAtVal)
            },
            friends: [],
            // comments: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: 'Comment'
        //     }
        // ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        // the id false below prevents virtuals from making a duplicate _id as `id`
        id: false
    }
);

UserSchema.virtual('friendCount').get(function () {
    return this.comments.reduce(
        (total, friends) => total + friends.length + 1, 0
    );
});

const User = model('User', UserSchema);

module.exports = User;