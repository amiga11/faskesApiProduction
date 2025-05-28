import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
            'dbfaskes.data_klinik.pelayanan_klinik '

    const sqlFrom = 'FROM ' +
        'dbfaskes.data_klinik ' +
        'INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_klinik.id_faskes '

    const sqlLimit = 'LIMIT ? '

    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE '

    const filter = []
    const sqlFilterValue = []

    const klinikId = req.query.klinikId || null

    if (klinikId != null) {
        filter.push("dbfaskes.trans_final.kode_faskes_baru = ? ")
        sqlFilterValue.push(klinikId)
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    filter.forEach((value, index) => {
        if (index == 0) {
            sqlFilter = sqlWhere.concat(value)
        } else if (index > 0) {
            sqlFilter = sqlFilter.concat(' and ').concat(value)
        }
    })

    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlLimit).concat(sqlOffSet)
    databaseFKTP.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(dbfaskes.data_klinik.pelayanan_klinik) as total_row_count '
        const sqlCount = sqlSelectCount.concat(sqlFrom).concat(sqlFilter)
        databaseFKTP.query(sqlCount, {
            type: QueryTypes.SELECT,
            replacements: sqlFilterValue
        })
        .then(
            (resCount) => {
                if (res[0].pelayanan_klinik != null) {
                    const newResults = res[0]["pelayanan_klinik"].split(";").map((element) => {
                        const objLit = {
                            "nama": element
                        }
                        return objLit
                    })
                    const data = {
                        totalRowCount: resCount[0].total_row_count,
                        page: page,
                        limit: limit,
                        data: newResults
                    }
                    callback(null, data)
                } else if (res[0].pelayanan_klinik == null) {
                    const data = {
                        totalRowCount: resCount[0].total_row_count,
                        page: page,
                        limit: limit,
                        data: []
                    }
                    callback(null, data)
                }
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