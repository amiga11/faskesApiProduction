import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
    'db_fasyankes.`data`.Propinsi AS id, ' +
    'db_fasyankes.`data`.RUMAH_SAKIT AS nama_rs, ' +
    '(select mj.nama jenis_vendor ' +
    'from dbyankes.kondisi k ' +
    'left join dbyankes.m_jenis_vendor mj ON mj.id=k.jenis_vendor ' +
    'WHERE k.koders=db_fasyankes.`data`.Propinsi LIMIT 1) as `jenisPengembangSIM`, ' +
    '(select sm.dtoId ' +
    'from dbyankes.kondisi k ' +
    'left join db_fasyankes.sim_pengembang sm ON sm.id=k.sim_pengembang_id ' +
    'WHERE k.koders=db_fasyankes.`data`.Propinsi LIMIT 1) as `idPengembangSIM`, ' +
    '(select sm.nameFacility ' +
    'from dbyankes.kondisi k ' +
    'left join db_fasyankes.sim_pengembang sm ON sm.id=k.sim_pengembang_id ' +
    'WHERE k.koders=db_fasyankes.`data`.Propinsi LIMIT 1) as `namaPengembangSIM`, ' +
    '(SELECT if(id_detvar != \'\', \'Sudah\', \'Belum\') ' +
    'FROM dbyankes.kondisi WHERE id_detvar=19 AND koders=db_fasyankes.`data`.Propinsi) as `statusRME` '

    const sqlFrom = 'FROM db_fasyankes.`data` ' +
        'LEFT JOIN db_fasyankes.propinsi p ON p.propinsi_kode=db_fasyankes.`data`.usrpwd2 ' +
        'LEFT JOIN db_fasyankes.`kab/kota` kab ON kab.link=db_fasyankes.`data`.link ' 

        const sqlOrder = ' ORDER BY id ' 

        const sqlLimit = ' LIMIT ? '
            
        const sqlOffSet = ' OFFSET ?'

        const sqlWhere = 'WHERE db_fasyankes.`data`.jenis != 20 AND db_fasyankes.`data`.aktive= 1 AND '

        const filter = []
        const sqlFilterValue = []

        const rsId = req.query.rsId || null
        const namaRs = req.query.namaRs || null


        if (rsId != null) {
            filter.push("db_fasyankes.`data`.Propinsi = ? ")
            sqlFilterValue.push(rsId)
        }

        if (namaRs != null) {
            filter.push("db_fasyankes.`data`.RUMAH_SAKIT like ? ")
            sqlFilterValue.push('%'.concat(namaRs).concat('%'))
        }

        sqlFilterValue.push(endIndex)
        sqlFilterValue.push(startIndex)

        let sqlFilter = ''
        if (filter.length == 0) {
            sqlFilter = ' WHERE db_fasyankes.`data`.jenis != 20 AND db_fasyankes.`data`.aktive= 1  '
        } else {
            filter.forEach((value, index) => {
                if (index == 0) {
                    sqlFilter = sqlWhere.concat(value)
                } else if (index > 0) {
                    sqlFilter = sqlFilter.concat(' and ').concat(value)
                }
            })
        }

        const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_fasyankes.`data`.Propinsi) as total_row_count  '
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
