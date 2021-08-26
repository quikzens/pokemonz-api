const { Router } = require('express')

// controllers
const { login, register } = require('../controllers/users')
const {
  getPokemons,
  catchPokemon,
  getPokemonDetail,
  getMyPokemons,
  getTakenPokemons,
} = require('../controllers/pokemons')
const {
  createExchange,
  getExchanges,
  acceptExchange,
  getMyExchange,
} = require('../controllers/exchanges')

// middlewares
const { auth } = require('../middlewares/auth')

const router = Router()

// login
router.post('/login', login)
// register
router.post('/register', register)

// get all pokemons
router.get('/pokemons', getPokemons)
// get pokemon detail
router.get('/pokemon/:id', getPokemonDetail)
// get my pokemon
router.get('/mypokemons', auth, getMyPokemons)
// catch pokemon
router.post('/catch-pokemon', auth, catchPokemon)
// get taken pokemons
router.get('/takenpokemons', auth, getTakenPokemons)

// create exchanges
router.post('/exchange', auth, createExchange)
// get my exchange
router.get('/my-exchange', auth, getMyExchange)
// get exchanges list
router.get('/exchanges', auth, getExchanges)
// accept exchanges
router.get('/acceptexchange/:id', auth, acceptExchange)

module.exports = router
