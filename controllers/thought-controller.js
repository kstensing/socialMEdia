const {
    Thought
} = require('../models');
const {
    User,
    Thoughts
} = require('./models');

const thoughtController = {
    getThoughts() {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
          })
          .select('-__v')
          .then(dbPizzaData => res.json(dbPizzaData))
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
          console.log(err);
          res.sendStatus(400);
        });
    },

    addReaction({ params, body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
          return User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: _id } },
            { new: true }
          );
        })
        .then(dbThoughtData => {
          console.log(dbThoughtData);
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id.' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    // update thought by id
    updateThought({ params, body }, res) {
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
        Comment.findOneAndDelete({
                _id: params.commentId
            })
            .then(deletedThought => {
                if (!deletedThought) {
                    return res.status(404).json({
                        message: 'No thought found with this id.'
                    });
                }
                return Thought.findOneAndUpdate({
                    _id: params.userId
                }, {
                    $pull: {
                        comments: params.thoughtId
                    }
                }, {
                    new: true
                });
            })
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

    // delete reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate({
                _id: params.commentId
            }, {
                $pull: {
                    reactions: {
                        reactionId: params.reactionId
                    }
                }
            }, {
                new: true
            })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.json(err));
    }
}

module.exports = thoughtController;