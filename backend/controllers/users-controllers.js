const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
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

const addUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new HttpError("Invalid Input response,please check your data", 422);
    }
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user, email already exist");
  }
  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json(createdUser);
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
