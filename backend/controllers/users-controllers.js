const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
let DUMMY_USERS = [
  {
    id: "u1",
    name: "Darpan Mendiratta",
    email: "darpan.exe@gmail.com",
    password: "12345678",
    placeCount: 2,
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const addUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid Input response,please check your data", 422)
    );
  }
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const Error = new HttpError(
      "Signing Up failed , please try again later",
      500
    );
    return next(Error);
  }
  if (existingUser) {
    const Error = new HttpError(
      "User exists already, Please login instead",
      422
    );
    return next(Error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, please try agin", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    places: [],
    image: req.file.path,
    password: hashedPassword,
  });
  try {
    createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up Failed , please try again", 500);
    console.log(err);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up Failed , please try again", 500);
    console.log(err);
    return next(error);
  }
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Input response,please check your data", 422)
    );
  }
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const Error = new HttpError(
      "Loging in failed , please try again later",
      500
    );
    return next(Error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      401
    );

    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in , please check your credentials and try again",
      500
    );
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      401
    );

    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up Failed , please try again", 500);
    console.log(err);
    return next(error);
  }

  res.json({
    userId:existingUser.id,
    email:existingUser.email,
    token:existingUser.token
  });
};

exports.addUser = addUser;
exports.getUsers = getUsers;
exports.loginUser = loginUser;
