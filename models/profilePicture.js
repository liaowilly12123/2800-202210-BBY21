var mongoose = require('mongoose');

var profilePicSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BBY_21_user',
    required: true,
  },
  img: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BBY_21_Image',
    required: true,
  },
});

// Image is a model which has a schema imageSchema
module.exports = new mongoose.model('BBY_21_Profile_Image', profilePicSchema);
