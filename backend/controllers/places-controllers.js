const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Place = require("../models/place");
const User = require("../models/user");
const user = require("../models/user");
let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "Oneof the most famous sky scrappers in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th st. New York",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const Error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    console.log(err);
    return next(Error);
  }
  if (!place) {
    const error = new HttpError(
      "Could not find the place for the provided id.",
      404
    );
    return next(error);
  }
  // res.json({ place});
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const Error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    console.log(err);
    return next(Error);
  }
  if (!places || places.length === 0) {
    const error = new HttpError(
      "Could not find the place for the provided user id.",
      404
    );
    return next(error);
  }
  // res.json({ places });
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid Input response,please check your data", 422)
    ) 
  }
  const { title, description, address, creator } = req.body;
  let coordinates = {
    lat: 40.7484474,
    lng: -73.9871516,
  };
  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    creator,
    image:
      "https://cropper.watch.aetnd.com/public-content-aetn.video.aetnd.com/video-thumbnails/AETN-History_VMS/21/202/tdih-may01-HD.jpg?w=548",
    creator,
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating Place failed,please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("could not find the user for provided id", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating Place Failed , please try again",
      500
    );
    console.log(err);
    return next(error);
  }
  res.status(201).json(createdPlace);
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(
      "Invalid Input response,please check your data",
      422
    );
    return next(error);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const Error = new HttpError("Something went wrong , could not update", 500);
    return next(Error);
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const Error = new HttpError("Something went wrong , could not update", 500);
    return next(Error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    console.log(err);
    const Error = new HttpError(
      "Something went wrong , could not delete 1",
      500
    );
    return next(Error);
  }

  if(!place){
    const error= new HttpError("Could not find place for this id",404);
    return next(error)
  }

  try {
    // await place.remove();
    const sess= await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session:sess});
    place.creator.places.pull(place)
    await place.creator.save({session:sess})
    sess.commitTransaction();
  } catch (err) {
    const Error = new HttpError(
      "Something went wrong , could not delete 2",
      500
    );
    return next(Error);
  }

  res.status(200).json({ message: "Deleted Place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
