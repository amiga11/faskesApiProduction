import { Sequelize } from "sequelize"
import moment from 'moment-timezone'

export const databaseFKTP = new Sequelize(process.env.DB_DATABASE_FKTP, process.env.DB_USERNAME_FKTP, process.env.DB_PASSWORD_FKTP, {
    host: process.env.DB_HOST_FKTP,
    dialect: "mysql",
    define: {
        freezeTableName: true,
        timestamps: false
    },
    dialectOptions: {
        // useUTC: false
        typeCast: function (field, next) {
            if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
                return moment(field.string()).tz('Asia/Jakarta').format()
            }
            return next();
        },
        connectTimeout: 60000
    },
    timezone: '+07:00', //for writing to database
    logging: console.log,
    pool: {
        max: 100,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
})

export const databaseFKRTL = new Sequelize(process.env.DB_DATABASE_FKRTL, process.env.DB_USERNAME_FKRTL, process.env.DB_PASSWORD_FKRTL, {
    host: process.env.DB_HOST_FKRTL,
    dialect: "mysql",
    define: {
        freezeTableName: true,
        timestamps: false
    },
    dialectOptions: {
        typeCast: function (field, next) {
            if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
                return moment(field.string()).tz('Asia/Jakarta').format()
            }
            return next();
        },
        connectTimeout: 60000
    },
    operatorsAliases: false,
    timezone: '+07:00', //for writing to database
    logging: console.log,
    pool: {
        max: 100,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
})
