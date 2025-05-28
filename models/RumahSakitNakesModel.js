import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'

export const insert = async (req, callback) => {
    try{
        const record = [
            req.body.pekerjaan_id,
            req.body.biodata_id,
            req.body.kode_rs,
            req.body.nama,
            req.body.nik,
            req.body.no_str,
            req.body.no_sip,
            req.body.jenis_nakes_id,
            req.body.jenis_nakes_nama,
            req.body.sub_kategori_nakes_id,
            req.body.sub_kategori_nakes_nama,
            1
        ]
    
        const sqlInsert = 'INSERT INTO db_fasyankes.nakes_pekerjaan_dua ' +
            '(id, biodata_id, kode_rs, nama, nik, no_str, ' +
            'no_sip, jenis_nakes_id, jenis_nakes_nama, sub_kategori_nakes_id, ' +
            'sub_kategori_nakes_nama, is_active) ' +
            'VALUES ( ? )'
    
        databaseFKRTL.query(sqlInsert, {
            type: QueryTypes.INSERT,
            replacements: [record]
            }
        )
        .then(
            (res) => {
                callback(null, res)
            }
        )
        .catch(
            (error) => {
                callback(error, null)
            }
        )
    } catch (error) {
        await trans.rollback()
        callback(error, null)
    }
}

export const update = (req, id, callback) => {
    const trans_id = parseInt(id)
    const sqlValue = [
        req.body.biodata_id, 
        req.body.nama,
        req.body.nik,
        req.body.no_str,
        req.body.no_sip,
        req.body.jenis_nakes_id,
        req.body.jenis_nakes_nama,
        req.body.sub_kategori_nakes_id,
        req.body.sub_kategori_nakes_nama,
        req.body.is_active,
        trans_id
    ]

    const sql = 'UPDATE db_fasyankes.nakes_pekerjaan_dua SET biodata_id=?, nama=?, nik=?, no_str=?, no_sip=?, ' +
            'jenis_nakes_id=?, jenis_nakes_nama=?, sub_kategori_nakes_id=?,' +
            'sub_kategori_nakes_nama=?, is_active=? ' +
        'WHERE id = ?'
        

    databaseFKRTL.query(sql, {
        type: QueryTypes.UPDATE,
        replacements: sqlValue
        })
    .then(
        (res) => {
            if (res.affectedRows === 0 && res.changedRows === 0) {
                callback(null, 'row not matched');
                return
            }
            let resourceUpdated = {
                id: trans_id
            } 
            callback(null, resourceUpdated);
        },(error) => {
            throw error
        }
    ).catch((error) => {
        callback(error, null)
    })
}

export const softDelete = (id, callback) => {
    const trans_id = parseInt(id)
    const sqlValue = [
        trans_id
    ]

    const sql = 'UPDATE db_fasyankes.nakes_pekerjaan_dua SET is_active=0 ' +
    'WHERE id = ?'
    
    databaseFKRTL.query(sql, {
        type: QueryTypes.UPDATE,
        replacements: sqlValue
        })
    .then(
        (res) => {
            if (res.affectedRows === 0 && res.changedRows === 0) {
                callback(null, 'row not matched');
                return
            }
            let resourceUpdated = {
                id: trans_id
            } 
            callback(null, resourceUpdated);
        },(error) => {
            throw error
        }
    ).catch((error) => {
        callback(error, null)
    })
}


export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT  '+
    // 'db_fasyankes.`data`.Propinsi as kode_rs, '+
    // 'db_fasyankes.`data`.RUMAH_SAKIT as nama_rs, '+
    'db_fasyankes.nakes_pekerjaan_dua.nama,   '+
    'db_fasyankes.nakes_pekerjaan_dua.`no_str`,  '+
    'db_fasyankes.nakes_pekerjaan_dua.`no_sip`,  '+
    'db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_id as jenis_nakes_id,  '+
    'db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_nama as jenis_nakes,  '+
    'db_fasyankes.nakes_pekerjaan_dua.sub_kategori_nakes_id, ' +
    'db_fasyankes.nakes_pekerjaan_dua.sub_kategori_nakes_nama, ' +
    'db_fasyankes.nakes_pekerjaan_dua.create_at, ' +
    'db_fasyankes.nakes_pekerjaan_dua.update_at ' 

    const sqlFrom = 'FROM  '+
    'db_fasyankes.nakes_pekerjaan_dua '
   
    
    const sqlOrder = ' ORDER BY db_fasyankes.nakes_pekerjaan_dua.kode_rs, db_fasyankes.nakes_pekerjaan_dua.nama '

    const sqlLimit = ' LIMIT ? '
    
    const sqlOffSet = ' OFFSET ?'
    
    const sqlWhere = ' WHERE '

    const filter = []
    const sqlFilterValue = []

    const createAt = req.query.createAt || null
    const updateAt = req.query.updateAt || null
    const rsId = req.query.rsId || null
    // const jenis = req.query.jenis|| null
    // const nama = req.query.nama || null


    if (createAt != null) {
        filter.push("db_fasyankes.`nakes_pekerjaan_dua`.`create_at` >= ?")
        sqlFilterValue.push(createAt)
    }

    if (updateAt != null) {
        filter.push("db_fasyankes.`nakes_pekerjaan_dua`.`update_at` <= ?")
        sqlFilterValue.push(updateAt)
    }

    if (rsId != null) {
        filter.push("db_fasyankes.nakes_pekerjaan_dua.kode_rs = ? ")
        sqlFilterValue.push(rsId)
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
    // console.log('dunno ',req.query)
    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_fasyankes.`nakes_pekerjaan_dua`.`nik`) as total_row_count '
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


export const getTotalNakes= (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT  '+
    'db_fasyankes.`data`.Propinsi as rsId,   '+ 
    'db_fasyankes.`data`.RUMAH_SAKIT as namaRs,   '+
    'db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_nama as jenisNakes,   '+ 
    'count(db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_id) as jumlahNakes '

    const sqlFrom = 'FROM  '+
    'db_fasyankes.nakes_pekerjaan_dua '+ 
    'inner join db_fasyankes.`data` on '+  
    'db_fasyankes.nakes_pekerjaan_dua.kode_rs = db_fasyankes.`data`.Propinsi '
   
    
    const sqlOrder = ' GROUP BY db_fasyankes.nakes_pekerjaan_dua.kode_rs, db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_nama ORDER BY db_fasyankes.`data`.Propinsi '

    const sqlLimit = ' LIMIT ? '
    
    const sqlOffSet = ' OFFSET ?'
    
    const sqlWhere = ' WHERE '

    const filter = []
    const sqlFilterValue = []

    const rsId = req.query.rsId || null

    if (rsId != null) {
        filter.push("db_fasyankes.nakes_pekerjaan_dua.kode_rs = ? ")
        sqlFilterValue.push(rsId)
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
    // console.log('dunno ',req.query)
    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = ' SELECT count(total_row_count) as total_row_count from ( SELECT count(db_fasyankes.`nakes_pekerjaan_dua`.`jenis_nakes_id`) as total_row_count FROM  db_fasyankes.nakes_pekerjaan_dua inner join db_fasyankes.`data` on db_fasyankes.nakes_pekerjaan_dua.kode_rs = db_fasyankes.`data`.Propinsi  GROUP BY db_fasyankes.nakes_pekerjaan_dua.kode_rs, db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_nama ORDER BY db_fasyankes.`data`.Propinsi)dervi '
        const sqlCount = sqlSelectCount
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