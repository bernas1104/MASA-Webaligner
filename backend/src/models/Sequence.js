const Sequelize = require('sequelize');
const { uuid } = require('uuidv4');

const sequelize = require('../database/connection');

const Model = Sequelize.Model;

class Sequence extends Model {}

Sequence.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    file: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
        isInt: true,
        }
    },
    origin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
        isInt: true,
        min: 1,
        max: 3,
        }
    },
    edge: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
        len: [1, 1],
        is: /[1-3|+|*]/g,
        notEmpty: true,
        }
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
}, {
    sequelize,
    modelName: 'sequence'
});

Sequence.beforeCreate((sequence, _) => {
    return sequence.id = uuid();
});

module.exports = Sequence;
