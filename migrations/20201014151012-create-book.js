'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Books', {
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
    await queryInterface.dropTable('Books');
  }
};
