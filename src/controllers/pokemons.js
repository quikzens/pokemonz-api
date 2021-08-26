const { Pokemon } = require('../../db/models')
const { Op } = require('sequelize')
const fetch = require('node-fetch')
const send = require('../utils/response')

exports.getPokemons = async (req, res) => {
  // get pokemon data from pokeAPI
  fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
    .then((response) => response.json())
    .then(async (pokemons) => {
      let pokemonData = pokemons.results
      pokemonData = await Promise.all(
        pokemonData.map(async (pokemon) => {
          const pokemonName = pokemon.name
          let pokemonImage

          // get image of each pokemon
          try {
            const response = await fetch(pokemon.url)
            const data = await response.json()
            pokemonImage = data.sprites.other['official-artwork'].front_default
          } catch (err) {
            console.log(err)
          }

          return Promise.resolve({ name: pokemonName, image: pokemonImage })
        })
      )

      res.send(pokemonData)
    })
    .catch((err) => {
      console.log(err)
      send.serverError(res)
    })
}

exports.catchPokemon = async (req, res) => {
  const { userId } = req
  const { mustGet } = req.body

  const addPokemon = async (res, userId) => {
    try {
      const randomNumber = Math.floor(Math.random() * (51 - 1) + 1)

      // check pokemon
      let checkPokemon = await Pokemon.findOne({
        where: {
          pokemonId: randomNumber,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'UserId'],
        },
      })
      if (checkPokemon) {
        // if pokemon has taken, user can't get this pokemon right away
        return res.send({
          status: 'has_taken',
        })
      }

      let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomNumber}`
      )
      let data = await response.json()

      const pokemon = await Pokemon.create({
        pokemonId: randomNumber,
        ownerId: userId,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
      })

      return res.send({
        status: 'success',
        pokemon,
      })
    } catch (err) {
      console.log(err)
      return send.serverError(res)
    }
  }

  // if mustGet true, which mean that user has been catch the pokemon four times in a row
  if (mustGet) {
    // ensure user get new pokemon
    // add new random pokemon to db with current userId
    return addPokemon(res, userId)
  }

  // if not, generate one number (from 0-4) with each number has 25% probability
  const probability25 = Math.floor(Math.random() * 4)

  if (probability25 === 3) {
    // if probability25 equal to 3
    // add pokemon
    return addPokemon(res, userId)
  } else {
    // if not, send 'try_again' status
    res.send({ status: 'try_again' })
  }
}

exports.getPokemonDetail = async (req, res) => {
  try {
    const { id } = req.params

    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    let data = await response.json()

    res.send({
      status: 'success',
      pokemon: {
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        height: data.height,
        abilities: data.abilities,
      },
    })
  } catch (err) {
    console.log(err)
    send.serverError(res)
  }
}

exports.getMyPokemons = async (req, res) => {
  const { userId } = req

  try {
    let pokemons = await Pokemon.findAll({
      where: {
        ownerId: userId,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'UserId'],
      },
    })

    res.send({ status: 'success', pokemons })
  } catch (err) {
    console.log(err)
    send.serverError(res)
  }
}

exports.getTakenPokemons = async (req, res) => {
  const { userId } = req

  try {
    let pokemons = await Pokemon.findAll({
      where: {
        [Op.not]: [{ ownerId: userId }],
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'UserId', 'image', 'ownerId'],
      },
    })

    res.send({ status: 'success', pokemons })
  } catch (err) {
    console.log(err)
    send.serverError(res)
  }
}
