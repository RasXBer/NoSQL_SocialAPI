const Thought = require('../models/Thought');  
const User = require('../models/User');  
const Reaction = require('../models/Reaction');
const dayjs = require('dayjs');

// controller functions for thought routes
module.exports = {
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find().populate('reactions');
      res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  getThoughtById: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId).populate('reactions');
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' });
        return;
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  createThought: async (req, res) => {
    try {
      const newThought = await Thought.create(req.body);
      // Push thought's _id to the associated user's thoughts array
      const user = await User.findOneAndUpdate(
        { username: newThought.username },
        { $push: { thoughts: newThought._id } },
        { new: true }
      );
      res.status(200).json(newThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  updateThought: async (req, res) => {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
      if (!updatedThought) {
        res.status(404).json({ message: 'Thought not found' });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  deleteThought: async (req, res) => {
    try {
      const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
      if (!deletedThought) {
        res.status(404).json({ message: 'Thought not found' });
        return;
      }
      // Remove thought from associated user's thoughts array
      await User.findOneAndUpdate(
        { username: deletedThought.username },
        { $pull: { thoughts: deletedThought._id } }
      );
      res.json({ message: 'Thought deleted' });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  createReaction: async (req, res) => {
    try {
      const { username, reactionBody } = req.body;

      // Create a new Reaction document
      const newReaction = await Reaction.create({
        username,
        reactionBody
      });

      // Find the thought by its _id
      const thought = await Thought.findById(req.params.thoughtId);
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' });
        return;
      }

      // Add the new reaction's _id to the thought's reactions array
      thought.reactions.push(newReaction._id);
      await thought.save();

      res.status(200).json(newReaction); // Respond with the newly created Reaction
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  }
};

