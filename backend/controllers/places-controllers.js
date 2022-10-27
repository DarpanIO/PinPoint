const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Place = require("../models/place");

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
    throw new HttpError("Invalid Input response,please check your data", 422);
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
  try {
    createdPlace.save();
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

const updatePlace = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error= new HttpError("Invalid Input response,please check your data", 422);
    return next(error)
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try{
    place= await Place.findById(placeId)
  }catch(err){
    const Error= new HttpError("Something went wrong , could not update",500)
    return next(Error)
  }
  place.title = title;
  place.description = description;
  try{
    await place.save()
  }catch(err){
    const Error= new HttpError("Something went wrong , could not update",500)
    return next(Error)
  }
  res.status(200).json({ place: place.toObject({getters:true}) });
};


const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted Place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
