const {
    Thought, 
    User
} = require('../models');


const thoughtController = {
    getThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    getThoughtById({
        params
    }, res) {
        Thought.findOne({
                _id: params.id
            })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    createThought({
        params, 
        body
    }, res) {
        Thought.create(body)
            .then(({
                _id
            }) => {
                return User.findOneAndUpdate({
                    _id: body.userId
                }, {
                    $push: {
                        thoughts: _id
                    }
                }, {
                    new: true
                });
            })
            .then(dbThoughtData => {
                console.log('thoughtData', dbThoughtData)
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No user found with this id.' });
                    return;
                  }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    addReaction({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({
                        message: 'No thought found with this id.'
                    });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // update thought by id
    updateThought({
        params,
        body
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.id
            }, body, {
                new: true,
                runValidators: true
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({
                        message: 'No thought is found with this id.'
                    });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    // remove thought
    removeThought({
        params
    }, res) {
        Thought.findOneAndDelete({
                _id: params.id
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({
                        message: 'No thought found with this id.'
                    });
                    return;
                }
                res.json({message: 'Thought has been deleted.'});
            })
            .catch(err => res.status(400).json(err));
    },

    // delete reaction
    removeReaction({
        params
    }, res) {
        Thought.findOneAndUpdate({
                _id: params.thoughtId
            }, {
                $pull: {
                    reactions: { reactionId: params.reactionId } 
                }
            }, {
                new: true
            })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    }
}

module.exports = thoughtController;