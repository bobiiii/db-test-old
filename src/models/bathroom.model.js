const mongooose = require('mongoose');

const colorsSchema = new mongooose.Schema({
  colorName: {
    type: String,
  },
  colorCardImage: {
    type: String,
  },
  mainImage: {
    type: String,
  },
});

const bathroomSchema = new mongooose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    cardImage: {
      type: String,
      required: true,
      trim: true,
    },
    colors: [colorsSchema],

  },
  {
    timestamps: true,
  },
);

const bathroomModel = mongooose.model('bathrooms', bathroomSchema);

module.exports = bathroomModel;
