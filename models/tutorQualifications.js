'use strict';
const mongoose = require('mongoose');

const tutorQualificationsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BBY_21_user',
    required: true,
  },
  higherEducation: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
});

const tutorQualificationsModel = mongoose.model(
  'BBY21_tutor_qualifications',
  tutorQualificationsSchema
);
module.exports = tutorQualificationsModel;
