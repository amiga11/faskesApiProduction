import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
        'dbfaskes.trans_final.kode_faskes_baru as praktekMandiriId, ' +
        'dbfaskes.data_sisdmk.NIK, ' +
        'dbfaskes.data_sisdmk.NAMA as nama, ' +
        'dbfaskes.data_sisdmk_pekerjaan.SIP, ' +
        'dbfaskes.data_sisdmk_pekerjaan.STR, ' +
        'dbfaskes.data_sisdmk_pekerjaan.JENIS_SDMK as jenisSDMK, ' +
        'dbfaskes.data_sisdmk.is_active as is_active, ' +
        'dbfaskes.data_sisdmk_pekerjaan.created_at as created_at, ' +
        'dbfaskes.data_sisdmk_pekerjaan.modified_at as modified_at '

    const sqlFrom = 'FROM ' +
        'dbfaskes.data_sisdmk INNER JOIN dbfaskes.data_sisdmk_pekerjaan ON dbfaskes.data_sisdmk_pekerjaan.data_sisdmk_id = dbfaskes.data_sisdmk.id ' +
        'INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_sisdmk.id_faskes '

    const sqlOrder = ' ORDER BY dbfaskes.data_sisdmk.NAMA '

    const sqlLimit = 'LIMIT ? '
    
    const sqlOffSet = 'OFFSET ?'
    
    const sqlWhere = 'WHERE dbfaskes.trans_final.kode_faskes_baru IS NOT NULL AND '

    const filter = []
    const sqlFilterValue = []

    const praktekMandiriId = req.query.praktekMandiriId || null
    const startModifiedAt = req.query.startModifiedAt || null
    const endModifiedAt = req.query.endModifiedAt || null
    
    if (praktekMandiriId != null) {
        filter.push("dbfaskes.trans_final.kode_faskes_baru = ?")
        sqlFilterValue.push(praktekMandiriId)
    }

    if (startModifiedAt != null) {
        filter.push("dbfaskes.data_sisdmk_pekerjaan.modified_at >= ?")
        // const date = startModifiedAt
        // const time = "00:00:00"
        // const dateTime = date + ' ' + time
        sqlFilterValue.push(startModifiedAt)
    }

    if (endModifiedAt != null) {
        filter.push("dbfaskes.data_sisdmk_pekerjaan.modified_at <= ?")
        // const date = endModifiedAt
        // const time = "23:59:59"
        // const dateTime = date + ' ' + time
        sqlFilterValue.push(endModifiedAt)
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE dbfaskes.trans_final.kode_faskes_baru IS NOT NULL'
    } else {
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index > 0) {
                sqlFilter = sqlFilter.concat(' AND ').concat(value)
            }
        })
    }

    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKTP.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(dbfaskes.trans_final.kode_faskes) as total_row_count '
        const sqlCount = sqlSelectCount.concat(sqlFrom).concat(sqlFilter)
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