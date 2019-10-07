import { DataTypes } from "sequelize";

export const user = {
    user_id: {
        type: DataTypes.INTEGER,
        unique: 'compositeIndex',
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userSecret: {
        type: DataTypes.STRING(600),
        allowNull: false,
        unique: true,
    },
    qrCodeUrl: {
        type: DataTypes.STRING(600),
        allowNull: false,
        unique: true,
    }

}