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
            defaultValue: 3,
            allowNull: false,
        },
        only1: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        clearn: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        complement: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        reverse: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        blockPruning: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
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
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DATEONLY,
            defaultValue: Date.now(),
            allowNull: false,
        }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('alignments');
  }
};
