const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please enter an full name'],
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: [true, 'Please enter an username'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
},{
  versionKey: false
});

UserSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

UserSchema.statics.comparePassword = async (password, receivedPassword) => {
  return bcrypt.compare(password, receivedPassword)
}

UserSchema.statics.login = async function(username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect username');
};


const User = mongoose.model('User', UserSchema);

module.exports = User;