// Creating our Card model
module.exports = function(sequelize, DataTypes) {
  const Playlist = sequelize.define("Playlist", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    youtubeVideoId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mood: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Playlist.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Playlist.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Playlist;
};
