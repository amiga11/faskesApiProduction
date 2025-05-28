import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT db_fasyankes.kab_kota.id, ' +
        'db_fasyankes.kab_kota.nama '
    
    const sqlFrom = 'FROM db_fasyankes.kab_kota '
    
    const sqlOrder = 'ORDER BY db_fasyankes.kab_kota.id ' 

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE '

    const filter = []
    const sqlFilterValue = []

    const provinsiId = req.query.provinsiId || null

    if (provinsiId != null) {
        filter.push("db_fasyankes.`kab_kota`.provinsi_id = ?")
        sqlFilterValue.push(provinsiId)
    }

    let sqlFilter = ''
    if (filter.length != 0) { 
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index > 0) {
                sqlFilter = sqlFilter.concat(' and ').concat(value)
            }
        })
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_fasyankes.kab_kota.id) as total_row_count '
        const sqlCount = sqlSelectCount.concat(sqlFrom)
        databaseFKRTL.query(sqlCount, {
            type: QueryTypes.SELECT,
            replacements: sqlFilterValue
        })
        .then(
            (resCount) => {
                const data = {
                    totalRowCount: resCount[0].total_row_count,
                    page: page,
                    limit: limit,
                    data: res
                }
                callback(null, data)
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
            throw error
        })
    })
    .catch((error) => {
        callback(error, null)
    })
}