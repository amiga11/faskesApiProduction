import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'

export const get = (req, callback) => {
    const sqlSelect = 'SELECT db_api_auth.user.id, ' +
        'db_api_auth.user.user_name, ' +
        'db_api_auth.user.password, ' +
        'db_api_auth.user.level_id '
    
    const sqlFrom = 'FROM db_api_auth.user '

    const sqlWhere = 'WHERE db_api_auth.user.activated_date <= NOW() AND ' +
        'db_api_auth.user.expired_date >= NOW() AND ' +
        'db_api_auth.user.is_active = 1 AND '
    
    const filter = []
    const sqlFilterValue = []

    const userName = req.body.userName || null

    if (userName != null) {
        filter.push("db_api_auth.user.user_name = ?")
        sqlFilterValue.push(userName)
    }

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE db_api_auth.user.activated_date <= NOW() AND ' +
        'db_api_auth.user.expired_date >= NOW() AND ' +
        'db_api_auth.user.is_active = 1'
    } else {
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index > 0) {
                sqlFilter = sqlFilter.concat(' and ').concat(value)
            }
        })
    }

    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        callback(null, res)
    })
    .catch((error) => {
        callback(error, null)
    })
}