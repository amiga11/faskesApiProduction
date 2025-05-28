import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'select db_fasyankes.`t_tempat_tidur`.`koders` as rsId, ' +
        'db_fasyankes.`m_tempat_tidur`.`tt`,db_fasyankes.`t_tempat_tidur`.`ruang`, ' +
        'db_fasyankes.`t_tempat_tidur`.`jumlah`, db_fasyankes.`t_tempat_tidur`.`terpakai`, ' +
        '(db_fasyankes.`t_tempat_tidur`.`jumlah` - db_fasyankes.`t_tempat_tidur`.`terpakai`) as kosong, ' +
        'db_fasyankes.`t_tempat_tidur`.`antrian`, db_fasyankes.`t_tempat_tidur`.`tglUpdate` as modified_at '
    
    const sqlFrom = 'from db_fasyankes.`t_tempat_tidur` inner join db_fasyankes.`m_tempat_tidur` ' +
        'on db_fasyankes.`m_tempat_tidur`.`id_tt` = db_fasyankes.`t_tempat_tidur`.`id_tt` ' +
        'inner join db_fasyankes.`data` on db_fasyankes.`data`.`Propinsi` = db_fasyankes.`t_tempat_tidur`.`koders` '
    
    const sqlWhere = 'WHERE '

    const sqlOrder = ' ORDER BY db_fasyankes.`data`.`Propinsi`, db_fasyankes.`t_tempat_tidur`.`id_tt`'

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'

    const filter = []
    const sqlFilterValue = []

    const provinsiId = req.query.provinsiId || null
    const kabKotaId = req.query.kabKotaId || null
    const idTt = req.query.id_tt || null
    const tglUpdate = req.query.tglUpdate || null
    const rsId = req.query.rsId || null
    const startModifiedAt = req.query.startModifiedAt || null
    const endModifiedAt = req.query.endModifiedAt || null

    if (provinsiId != null) {
        filter.push("db_fasyankes.`data`.`provinsi_id` = ?")
        sqlFilterValue.push(provinsiId)
    }

    if (kabKotaId != null) {
        filter.push("db_fasyankes.`data`.`kab_kota_id` = ?")
        sqlFilterValue.push(kabKotaId)
    }

    if (rsId != null) {
        filter.push("db_fasyankes.t_tempat_tidur.koders = ?")
        sqlFilterValue.push(rsId)
    }

    if (idTt != null) {
        filter.push("db_fasyankes.`t_tempat_tidur`.`id_tt` = ?")
        sqlFilterValue.push(idTt)
    }

    if (tglUpdate !== null) {
        filter.push("date_format(db_fasyankes.`t_tempat_tidur`.`tglupdate`, '%Y-%m-%d') = ?")
        sqlFilterValue.push(tglUpdate)
    }

    if (startModifiedAt != null) {
        filter.push("db_fasyankes.`t_tempat_tidur`.`tglupdate` >= ?")
        sqlFilterValue.push(startModifiedAt)
    }

    if (endModifiedAt != null) {
        filter.push("db_fasyankes.`t_tempat_tidur`.`tglupdate` <= ?")
        sqlFilterValue.push(endModifiedAt)
    }

    console.log(filter)

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
        const sqlSelectCount = 'SELECT count(db_fasyankes.`t_tempat_tidur`.`koders`) as total_row_count '
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