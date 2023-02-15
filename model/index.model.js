const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: "localhost",
    charset: "utf8",
    collate: "utf8_general_ci",
    operatorsAliases: 0,
  }
);

const User = sequelize.define(
  "user",
  {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING(50),
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    f_name: {
      type: Sequelize.STRING(30),
    },
    l_name: {
      type: Sequelize.STRING(30),
    },
    picture: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

const DHT = sequelize.define(
  "dht",
  {
    dht_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    humid: {
      type: Sequelize.DOUBLE,
    },
    temp: {
      type: Sequelize.DOUBLE,
    },
    splinker_status: {
        type: Sequelize.INTEGER(1)
    }
  },
  {
    freezeTableName: true
  }
);

// sequelize.sync({ force: true });
sequelize.sync();
module.exports = {
  User: User,
  DHT: DHT
};
