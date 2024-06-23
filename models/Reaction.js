const mongoose = require('mongoose');
const { Schema } = mongoose;
const dayjs = require('dayjs');

const reactionSchema = new Schema({
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// module.exports = reactionSchema;

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;