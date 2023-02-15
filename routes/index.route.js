const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const mcuController = require('../controller/mcu.controller')
const validator = require("../services/validator");
const multer = require("../services/multer");

router.post("/create-user", userController.createUser);

router.post("/login-user", userController.loginUser);

router.get("/get-user-list", userController.getUserList);

router.get("/get-user-self", validator.userVerify, userController.getUserSelft);

router.post(
  "/update-user-self",
  validator.userVerify,
  userController.updateUserSelf
);

router.post(
  "/user-upload-image-self",
  validator.userVerify,
  multer.uploadImages,
  multer.resizeImagesUser,
  multer.getResult,
  userController.userUploadImageSelf
);

router.post('/insert-data', mcuController.insertData)

router.get('/get-data', mcuController.getData)

router.get('/get-splinker-status', mcuController.getSplinkerStatus)

router.post('/update-splinker-status', mcuController.updateSplinkerStatus)

module.exports = router;
