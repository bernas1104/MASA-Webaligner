'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('sequences', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
        },
        path: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          size: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          origin: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        edge: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        alignmentId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'alignments',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
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
    return queryInterface.dropTable('sequences');
  }
};
