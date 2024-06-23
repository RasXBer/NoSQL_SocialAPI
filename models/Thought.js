const mongoose = require('mongoose');
const { Schema } = mongoose;
const Reaction = require('./Reaction');
const dayjs = require('dayjs');

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    maxlength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    required: true
  },
  reactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reaction'
    }
  ]
});

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// Method to remove a reaction from a thought
thoughtSchema.methods.removeReaction = async function(reactionId) {
  this.reactions.pull(reactionId);
  await this.save();
};

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;