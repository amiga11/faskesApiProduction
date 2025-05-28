import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
            'db_fasyankes.t_pelayanan.koders, ' +
            'db_fasyankes.m_pelayanan.kode_pelayanan as pelayananId,  ' +
            'db_fasyankes.m_pelayanan.pelayanan as pelayananNama  '

    const sqlFrom = 'FROM ' +
        'db_fasyankes.t_pelayanan INNER JOIN db_fasyankes.m_pelayanan ' +
        'ON db_fasyankes.m_pelayanan.kode_pelayanan = db_fasyankes.t_pelayanan.kode_pelayanan '

    const sqlOrder = ' ORDER BY db_fasyankes.t_pelayanan.koders ' 

    const sqlLimit = 'LIMIT ? '

    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE '

    const filter = []
    const sqlFilterValue = []

    const rsId = req.query.rsId || null

    if (rsId != null) {
        filter.push("db_fasyankes.t_pelayanan.koders = ? ")
        sqlFilterValue.push(rsId)
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

    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)
    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_fasyankes.t_pelayanan.id_t_pelayanan) as total_row_count '
        const sqlCount = sqlSelectCount.concat(sqlFrom).concat(sqlFilter)
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
                // if (res[0].pelayanan_klinik != null) {
                //     const newResults = res[0]["pelayanan_klinik"].split(";").map((element) => {
                //         const objLit = {
                //             "nama": element
                //         }
                //         return objLit
                //     })
                //     const data = {
                //         totalRowCount: resCount[0].total_row_count,
                //         page: page,
                //         limit: limit,
                //         data: newResults
                //     }
                //     callback(null, data)
                // } else if (res[0].pelayanan_klinik == null) {
                //     const data = {
                //         totalRowCount: resCount[0].total_row_count,
                //         page: page,
                //         limit: limit,
                //         data: []
                //     }
                //     callback(null, data)
                // }
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