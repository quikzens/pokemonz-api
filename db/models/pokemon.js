'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Pokemon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pokemon.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'ownerId',
      })

      Pokemon.hasOne(models.Exchange, {
        as: 'exchange',
        foreignKey: 'exchangedPokemon',
      })
    }
  }
  Pokemon.init(
    {
      pokemonId: DataTypes.INTEGER,
      ownerId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Pokemon',
      tableName: 'pokemons',
    }
  )
  return Pokemon
}
