const router = require('express').Router();

const {
    getThoughts,
    getThoughtById,
    createThought,
    addReaction,
    updateThought,
    removeThought,
    removeReaction
  } = require('../../controllers/thought-controller');

// GET all and POST at /api/thoughts
router
  .route('/')
  .get(getThoughts)
  .post(createThought);

// GET one, PUT, and DELETE at /api/thoughts/:id
router
  .route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);

// POST and DELETE at /api/thoughts/:thoughtId/reactions
router  
  .route('/:thoughtId/reactions')
  .post(addReaction)
  .delete(removeReaction);

module.exports = router;