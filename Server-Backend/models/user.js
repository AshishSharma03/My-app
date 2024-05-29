const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true }
});

const EducationSchema = new mongoose.Schema({
  institutionName: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  graduationYear: { type: Number, required: true }
});

const Profile_UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // Using phoneNumber as the primary key
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  pastExperience: { type: [ExperienceSchema], default: [] },
  skillSets: { type: [String], default: [] },
  educationalQualification: { type: [EducationSchema], default: [] },
  profilePicture: { type: String } // Assuming the profile picture is stored as a URL
});

// Alias phoneNumber to _id for consistency in the application
Profile_UserSchema.virtual('phoneNumber')
  .get(function () { return this._id; })
  .set(function (v) { this._id = v; });

module.exports = mongoose.model('Profile_User', Profile_UserSchema);