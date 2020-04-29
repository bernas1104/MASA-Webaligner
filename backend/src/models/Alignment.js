const Sequelize = require('sequelize');
const { uuid } = require('uuidv4');

const sequelize = require('../database/connection');
const Sequence = require('./Sequence');

const Model = Sequelize.Model;

function isBoolean(value) {
  if (value !== true && value !== false) {
    throw new Error('Value must be TRUE or FALSE.');
  }
}

class Alignment extends Model {}

Alignment.init({
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    extension: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1,
            max: 3,
        }
    },
    only1: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        validate: {
            isBoolean,
        }
    },
    clearn: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        validate: {
            isBoolean,
        }
    },
    complement: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
            isInt: true,
            min: 0,
            max: 3,
        }
    },
    reverse: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
            isInt: true,
            min: 0,
            max: 3
        }
    },
    blockPruning: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        validate: {
            isBoolean,
        }
    },
    fullName: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            is: /^([A-Z][a-z]+)( [A-Z][a-z]+)*$/gi,
            notEmpty: true,
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        }
    },
    createdAt: {
        type: Sequelize.DATEONLY,
        defaultValue: Date.now(),
    },
    updatedAt: {
        type: Sequelize.DATEONLY,
        defaultValue: Date.now(),
    }
}, {
  sequelize,
  modelName: 'alignments'
});

Alignment.hasMany(Sequence);

Alignment.beforeCreate((alignment, _) => {
    return alignment.id = uuid();
});

module.exports = Alignment;
