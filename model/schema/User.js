module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("user", {
        user_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING(50),
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        f_name: {
            type: Sequelize.STRING(30)
        },
        l_name: {
            type: Sequelize.STRING(30)
        },
        picture: {
            type: Sequelize.STRING
        }
    },
    {
        freezeTableName: true
    })
}
