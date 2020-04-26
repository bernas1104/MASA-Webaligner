'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('alignments', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
        },
        extension: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        only1: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        clearn: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        complement: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        reverse: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        blockPruning: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        fullName: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        createdAt: {
            type: Sequelize.DATEONLY,
            defaultValue: Date.now(),
        },
        updatedAt: {
            type: Sequelize.DATEONLY,
            defaultValue: Date.now(),
        }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('alignments');
  }
};
