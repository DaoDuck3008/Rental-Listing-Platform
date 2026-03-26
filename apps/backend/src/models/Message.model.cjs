"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // Message belongs to Chat
      Message.belongsTo(models.Chat, {
        foreignKey: "chat_id",
        as: "chat",
      });

      // Message belongs to User (sender)
      Message.belongsTo(models.User, {
        foreignKey: "sender_id",
        as: "sender",
      });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      chat_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      sender_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      message_type: {
        type: DataTypes.ENUM("text", "image", "file"),
        allowNull: false,
        defaultValue: "text",
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  return Message;
};
