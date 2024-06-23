const User = require('../models/User');
// const User = require('../models/User');
const dayjs = require('dayjs');

// controller functions for user routes
module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().populate('thoughts').populate('friends');
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate('thoughts').populate('friends');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  createUser: async (req, res) => {
    try {
      const newUser = await User.create(req.body);
      res.status(200).json(newUser);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.userId);
      if (!deletedUser) {
        res.status(200).json({ message: 'User deleted' });
        return;
      }
    //  Remove user's associated thoughts 
      await Thought.deleteMany({ username: deletedUser.username });
      // res.json({ message: 'User and associated thoughts deleted' });
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  addFriend: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friend = await User.findById(req.params.friendId);
      if (!user || !friend) {
        res.status(404).json({ message: 'User or friend not found' });
        return;
      }
      user.friends.push(friend._id);
      await user.save();
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  },

  removeFriend: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friendIndex = user.friends.indexOf(req.params.friendId);
      if (friendIndex === -1) {
        res.status(404).json({ message: 'Friend not found in user\'s friend list' });
        return;
      }
      user.friends.splice(friendIndex, 1);
      await user.save();
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  }
};

