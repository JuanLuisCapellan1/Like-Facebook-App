const jwt = require('jsonwebtoken');
const User = require("../models/user");

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { username: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect username') {
    errors.username = 'That username is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.username = 'That username is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'login-api designer juan', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { fullName, username, password } = req.body;

  try {
    const user = new User({
      fullName,
      username,
      password
    })
    
    user.password = await User.encryptPassword(user.password);
    const savedUser = await user.save();
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.json({ user: savedUser._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors });
  }
}

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}
