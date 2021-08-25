'use strict'
const bcrypt = require('bcrypt')
const hashStrenght = 10

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'user1',
          password: await bcrypt.hash('user1234', hashStrenght),
        },
        {
          username: 'user2',
          password: await bcrypt.hash('user1234', hashStrenght),
        },
        {
          username: 'user3',
          password: await bcrypt.hash('user1234', hashStrenght),
        },
        {
          username: 'user4',
          password: await bcrypt.hash('user1234', hashStrenght),
        },
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {})
  },
}
