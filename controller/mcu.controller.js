const { DHT } = require("../model/index.model");
require("dotenv").config();
const lineNotify = require("line-notify-nodejs")(process.env.LINE_NOTIFY_KEY);
const getData = async (req, res) => {
  try {
    const data = await DHT.findAll({
      attributes: { exclude: ["dht_id"] },
      order: [["createdAt", "DESC"]],
      limit: 7,
    });
    return res.status(200).send(data);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const insertData = async (req, res) => {
  try {
    console.log(req.body);
    await DHT.create({
      humid: req.body.humid,
      temp: req.body.temp,
      splinker_status: req.body.splinker_status,
    });

    if (req.body.notify) {
      if (req.body.notify == 1) {
        if (req.body.splinker_status == 1) {
          await lineNotify.notify({
            message: "Splinker status: ON (From Hardware)",
          });
        } else {
          await lineNotify.notify({
            message: "Splinker status: OFF (From Hardware)",
          });
        }
      } else {
        await lineNotify.notify({
          message:
            "Humidity less than 45 % and Temperature greater than 34 Celcius, Splinker : ON",
        });
      }
    }

    return res.status(201).send({ msg: "inserted data success" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getSplinkerStatus = async (req, res) => {
  try {
    const spliker = await DHT.findOne({
      attributes: { exclude: ["dht_id"] },
      order: [["createdAt", "DESC"]],
      limit: 1,
    });
    return res.status(200).send(spliker);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateSplinkerStatus = async (req, res) => {
  try {
    const latest = await DHT.findOne({
      attributes: ["dht_id"],
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    const dht_id = latest.dht_id;

    await DHT.update(
      {
        splinker_status: req.body.splinker_status,
      },
      {
        where: {
          dht_id: dht_id,
        },
      }
    );

    if (req.body.splinker_status == 1) {
      await lineNotify.notify({
        message: "Splinker status: ON (From Web Application)",
      });
    } else {
      await lineNotify.notify({
        message: "Splinker status: OFF (From Web Application)",
      });
    }

    return res.status(200).send({ msg: "updated splinker status" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = {
  getData: getData,
  insertData: insertData,
  getSplinkerStatus: getSplinkerStatus,
  updateSplinkerStatus: updateSplinkerStatus,
};
