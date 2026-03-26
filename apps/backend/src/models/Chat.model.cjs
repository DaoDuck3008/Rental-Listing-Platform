"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // Chat has many Messages
      Chat.hasMany(models.Message, {
        foreignKey: "chat_id",
        as: "messages",
        onDelete: "CASCADE",
      });

      // Chat belongs to owner
      Chat.belongsTo(models.User, {
        foreignKey: "owner_id",
        as: "owner",
      });

      // Chat belongs to tenant
      Chat.belongsTo(models.User, {
        foreignKey: "tenant_id",
        as: "tenant",
      });
    }
  }

  Chat.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Chat",
      tableName: "chats",
      timestamps: true,
      underscored: true,
    }
  );

  return Chat;
};
