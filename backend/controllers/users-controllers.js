const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
let DUMMY_USERS = [
  {
    id: "u1",
    name: "Darpan Mendiratta",
    email: "darpan.exe@gmail.com",
    password: "12345678",
    placeCount: 2,
  },
];

const getUsers = (req, res, next) => {
  const users = DUMMY_USERS;

  if (!users || users.length === 0) {
    return next(
      new HttpError("Could not find the place for the provided user id.")
    );
  }
  res.json({ users });
};

const addUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Input response,please check your data", 422)
    ); 
  }
  const { name, email, password,places } = req.body;
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

  const createdUser = new User({
    name,
    email,
    places,
    image:"https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000",
    password
  });
  try {
    createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up Failed , please try again",
      500
    );
    console.log(err);
    return next(error);
  }
  res.status(201).json({user:createdUser.toObject({getters:true})});
};

const loginUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid Input response,please check your data", 422);
  }
  const { email, password } = req.body;
  const user = DUMMY_USERS.find((u) => {
    return u.email === email && u.password === password;
  });
  if (user) res.status(200).json("Login Successfully");
  else
    res
      .status(404)
      .json({ message: "Email and password does not match with the database" });
};

exports.addUser = addUser;
exports.getUsers = getUsers;
exports.loginUser = loginUser;
