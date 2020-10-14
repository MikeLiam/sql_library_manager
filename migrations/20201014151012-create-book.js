'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('Book', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: {
              msg: '"Title" is required'
            }
          }
        },    
      author: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: {
              msg: '"Author" is required'
            }
          }
        },
      genre: Sequelize.STRING,
      year: Sequelize.INTEGER
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Users');
  }
};
