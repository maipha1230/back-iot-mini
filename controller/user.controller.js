const { User } = require("../model/index.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs')
const path = require('path')

require("dotenv").config();

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (user) {
      let match = bcrypt.compareSync(req.body.password, user.password);
      console.log(match);
      if (match) {
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT, {
          expiresIn: "8h",
        });
        return res.status(200).send({ msg: "login success", token: token });
      }
      return res.status(401).send({ msg: "password invalid" });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const createUser = async (req, res) => {
  try {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);

    await User.create({
      username: req.body.username,
      password: hash,
      f_name: req.body.f_name,
      l_name: req.body.l_name,
      picture: req.body.gallery ? req.body.gallery : null,
    });

    return res.status(201).send({ msg: "register success" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getUserList = async (req, res) => {
  try {
    let user = await User.findAll({
      attributes: ["f_name", "l_name", "picture"],
      order: [["createdAt", "ASC"]],
    });
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
};

const getUserSelft = async (req, res) => {
  try {
    const user_id = res.locals.user_id;

    const self = await User.findOne({
      where: {
        user_id: user_id,
      },
      attributes: ["f_name", "l_name", "picture"],
    });
    return res.status(200).send(self);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateUserSelf = async (req, res) => {
  try {
    const user_id = res.locals.user_id;

    const update = await User.update(
      {
        f_name: req.body.firstname,
        l_name: req.body.lastname,
      },
      {
        where: {
          user_id: user_id,
        },
      }
    );
    return res.status(200).send({ msg: "update profile success" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const userUploadImageSelf = async(req, res) => {
  try {
    const user_id = res.locals.user_id

    const old = await User.findOne({
      where: {
        user_id: user_id
      },
      attributes: ['picture']
    })

    if (old.picture) {
      try {
        let absolutePath = path.resolve(
          "public/" + old.picture
        );
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(String(absolutePath));
        }
      } catch (error) {
        res.status(500).send(error.message);
      }
    }


    const upload = await User.update({
      picture: req.body.gallery[0],
    },{
      where: {
        user_id: user_id
      }
    })
    return res.status(200).send({ msg: "Upload Image Success" })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  getUserList: getUserList,
  getUserSelft: getUserSelft,
  updateUserSelf: updateUserSelf,
  userUploadImageSelf: userUploadImageSelf
};
