'use strict';
const mongoose = require('mongoose');

const tutorQualificationsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
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
