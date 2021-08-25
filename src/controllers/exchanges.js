const { Exchange, Pokemon, User } = require('../../db/models')
const send = require('../utils/response')

exports.createExchange = async (req, res) => {
  const exchangeData = req.body
  const { userId } = req

  try {
    const exchange = await Exchange.create({
      ...exchangeData,
      exchangeOwner: userId,
    })

    res.send({ status: 'success', exchange })
  } catch (err) {
    console.log(err)
    send.serverError(res)
  }
}

exports.getExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.findAll({
      include: [
        {
          model: Pokemon,
          as: 'pokemon',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'UserId'],
          },
        },
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        },
      ],
      attributes: {
        exclude: [
          'PokemonId',
          'UserId',
          'createdAt',
          'updatedAt',
          'exchangedPokemon',
          'exchangeOwner',
        ],
      },
    })

    res.send({ status: 'success', exchanges })
  } catch (err) {
    console.log(err)
    send.serverError(res)
  }
}

exports.acceptExchange = async (req, res) => {
  const { userId } = req
  const { id: acceptedExchangeId } = req.params

  try {
    const userExchange = await Exchange.findOne({
      where: {
        exchangeOwner: userId,
      },
      include: [
        {
          model: Pokemon,
          as: 'pokemon',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'UserId'],
          },
        },
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        },
      ],
      attributes: {
        exclude: [
          'PokemonId',
          'UserId',
          'createdAt',
          'updatedAt',
          'exchangedPokemon',
          'exchangeOwner',
        ],
      },
    })

    const acceptedExchange = await Exchange.findOne({
      where: {
        id: acceptedExchangeId,
      },
      include: [
        {
          model: Pokemon,
          as: 'pokemon',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'UserId'],
          },
        },
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password'],
          },
        },
      ],
      attributes: {
        exclude: [
          'PokemonId',
          'UserId',
          'createdAt',
          'updatedAt',
          'exchangedPokemon',
          'exchangeOwner',
        ],
      },
    })

    await Pokemon.update(
      { ownerId: acceptedExchange.user.id },
      {
        where: {
          id: userExchange.pokemon.id,
        },
      }
    )

    await Pokemon.update(
      { ownerId: userExchange.user.id },
      {
        where: {
          id: acceptedExchange.pokemon.id,
        },
      }
    )

    await Exchange.destroy({
      where: {
        id: userExchange.id,
      },
    })

    await Exchange.destroy({
      where: {
        id: acceptedExchange.id,
      },
    })

    res.send({
      status: 'Success exchange your pokemon!',
    })
  } catch (err) {
    console.log(err)
    send.serverError(res)
  }
}
