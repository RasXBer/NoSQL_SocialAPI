const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReaction
} = require('../../controllers/thoughtController');

// Define routes
router.get('/', getAllThoughts);
router.get('/:thoughtId', getThoughtById);
router.post('/', createThought);
router.put('/:thoughtId', updateThought);
router.delete('/:thoughtId', deleteThought);
router.post('/:thoughtId/reactions', createReaction);

module.exports = router;