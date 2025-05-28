import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT dbfaskes.kategori_pm.id, ' +
        'dbfaskes.kategori_pm.kategori_user as nama '
    
    const sqlFrom = 'FROM dbfaskes.kategori_pm '
    
    const sqlOrder = 'ORDER BY dbfaskes.kategori_pm.id ' 

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'

    const sqlFilterValue = []

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    const sql = sqlSelect.concat(sqlFrom).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKTP.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(dbfaskes.kategori_pm.id) as total_row_count '
        const sqlCount = sqlSelectCount.concat(sqlFrom)
        databaseFKTP.query(sqlCount, {
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