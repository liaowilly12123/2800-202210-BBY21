var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BBY_21_user',
    required: true,
  },
  name: String,
  desc: String,
  img: {
    type: String,
    required: true,
  },
});

// Image is a model which has a schema imageSchema
module.exports = new mongoose.model('BBY_21_Image', imageSchema);
