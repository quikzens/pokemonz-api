'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Exchange extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Exchange.belongsTo(models.Pokemon, {
        as: 'pokemon',
        foreignKey: 'exchangedPokemon',
      })

      Exchange.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'exchangeOwner',
      })
    }
  }
  Exchange.init(
    {
      exchangedPokemon: DataTypes.INTEGER,
      wantedPokemon: DataTypes.INTEGER,
      exchangeOwner: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Exchange',
      tableName: 'exchanges',
    }
  )
  return Exchange
}
