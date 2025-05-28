import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'

export const getPengajuanSurvei = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT db_akreditasi.pengajuan_survei.id, ' +
        'db_akreditasi.pengajuan_survei.kode_rs, ' +
        'db_akreditasi.pengajuan_survei.lembaga_akreditasi_id, ' +
        'db_akreditasi.pengajuan_survei.tanggal_pengajuan_survei, ' +
        'db_akreditasi.pengajuan_survei.created_at, ' +
        'db_akreditasi.pengajuan_survei.modified_at '
    
    const sqlFrom = 'FROM db_akreditasi.pengajuan_survei '
    
    const sqlOrder = 'ORDER BY db_akreditasi.pengajuan_survei.id ' 

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE '

    const filter = []
    const sqlFilterValue = []

    // const provinsiId = req.query.provinsiId || null

    // if (provinsiId != null) {
    //     filter.push("db_akreditasi.`pengajuan_survei`.provinsi_id = ?")
    //     sqlFilterValue.push(provinsiId)
    // }

    // let sqlFilter = ''
    // if (filter.length != 0) { 
    //     filter.forEach((value, index) => {
    //         if (index == 0) {
    //             sqlFilter = sqlWhere.concat(value)
    //         } else if (index > 0) {
    //             sqlFilter = sqlFilter.concat(' and ').concat(value)
    //         }
    //     })
    // }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    const sql = sqlSelect.concat(sqlFrom).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_akreditasi.pengajuan_survei.id) as total_row_count '
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

export const getSurvei = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT db_akreditasi.survei.id, ' +
        'db_akreditasi.survei.pengajuan_survei_id, ' +
        'db_akreditasi.survei.tanggal_mulai, ' +
        'db_akreditasi.survei.created_at, ' +
        'db_akreditasi.survei.modified_at '
    
    const sqlFrom = 'FROM db_akreditasi.survei '
    
    const sqlOrder = 'ORDER BY db_akreditasi.survei.id ' 

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE '

    const filter = []
    const sqlFilterValue = []

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    const sql = sqlSelect.concat(sqlFrom).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_akreditasi.survei.id) as total_row_count '
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

export const getSurveiDetail = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT db_akreditasi.survei_detail.id, ' +
        'db_akreditasi.survei_detail.survei_id, ' +
        'db_akreditasi.survei_detail.nik_surveior, ' +
        'db_akreditasi.survei_detail.nama_surveior, ' +
        'db_akreditasi.survei_detail.created_at, ' +
        'db_akreditasi.survei_detail.modified_at '
    
    const sqlFrom = 'FROM db_akreditasi.survei_detail '
    
    const sqlOrder = 'ORDER BY db_akreditasi.survei_detail.id ' 

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE '

    const filter = []
    const sqlFilterValue = []

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    const sql = sqlSelect.concat(sqlFrom).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_akreditasi.survei_detail.id) as total_row_count '
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

export const getRekomendasi = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT db_akreditasi.rekomendasi.id, ' +
        'db_akreditasi.rekomendasi.survei_id, ' +
        'db_akreditasi.rekomendasi.url_rekomendasi_survei, ' +
        'db_akreditasi.rekomendasi.tanggal_surat_pengajuan_sertifikat, ' +
        'db_akreditasi.rekomendasi.tanggal_terbit_sertifikat, ' +
        'db_akreditasi.rekomendasi.tanggal_kadaluarsa_sertifikat, ' +
        'db_akreditasi.rekomendasi.capaian_akreditasi_id, ' +
        'db_akreditasi.rekomendasi.created_at, ' +
        'db_akreditasi.rekomendasi.modified_at '
    
    const sqlFrom = 'FROM db_akreditasi.rekomendasi '
    
    const sqlOrder = 'ORDER BY db_akreditasi.rekomendasi.id ' 

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE '

    const filter = []
    const sqlFilterValue = []

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    const sql = sqlSelect.concat(sqlFrom).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_akreditasi.rekomendasi.id) as total_row_count '
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

export const getSertifikasi = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT db_akreditasi.sertifikasi.id, ' +
        'db_akreditasi.sertifikasi.rekomendasi_id, ' +
        'db_akreditasi.sertifikasi.url_sertifikat_akreditasi, ' +
        'db_akreditasi.sertifikasi.tanggal_terbit, ' +
        'db_akreditasi.sertifikasi.tanggal_kadaluarsa, ' +
        'db_akreditasi.sertifikasi.capaian_akreditasi_id, ' +
        'db_akreditasi.sertifikasi.created_at, ' +
        'db_akreditasi.sertifikasi.modified_at '
    
    const sqlFrom = 'FROM db_akreditasi.sertifikasi '
    
    const sqlOrder = 'ORDER BY db_akreditasi.sertifikasi.id ' 

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE '

    const filter = []
    const sqlFilterValue = []

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    const sql = sqlSelect.concat(sqlFrom).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_akreditasi.sertifikasi.id) as total_row_count '
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

export const getSertifikasiTTE = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT db_akreditasi.Sertifikat_progres1.id, ' +
        'db_akreditasi.Sertifikat_progres1.id_rekomendasi, ' +
        'db_akreditasi.Sertifikat_progres1.lembaga, ' +
        'db_akreditasi.Sertifikat_progres1.mutu, ' +
        'db_akreditasi.Sertifikat_progres1.keterangan, ' +
        'db_akreditasi.Sertifikat_progres1.dirjen, ' +
        'db_akreditasi.Sertifikat_progres1.tgl_dibuat_lembaga, ' +
        'db_akreditasi.Sertifikat_progres1.tgl_dibuat_mutu, ' +
        'db_akreditasi.Sertifikat_progres1.tgl_dibuat_dirjen, ' +
        'db_akreditasi.Sertifikat_progres1.sertifikat_1, ' +
        'db_akreditasi.Sertifikat_progres1.sertifikat_2 '
    
    const sqlFrom = 'FROM db_akreditasi.Sertifikat_progres1 '
    
    const sqlOrder = 'ORDER BY db_akreditasi.Sertifikat_progres1.id ' 

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE '

    const filter = []
    const sqlFilterValue = []

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    const sql = sqlSelect.concat(sqlFrom).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_akreditasi.Sertifikat_progres1.id) as total_row_count '
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

export const getRumahSakitAkreditasi = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT '+
    'akreditasi.nama_faskes, '+
    'akreditasi.provinsi_id, '+
    'akreditasi.propinsi, '+
    'akreditasi.kab_kota_id, '+
    'akreditasi.kabkot, '+
    'akreditasi.alamat, '+
    'akreditasi.status_akreditasi, '+
    'MAX(akreditasi.tgl_mulai_sertifikat) as tgl_mulai_sertifikat, '+
    'akreditasi.tgl_akhir_sertifikat, '+  
    'akreditasi.kode_rs ' 
    

        const sqlFrom = 'FROM ('+
        'SELECT '+
        'db_fasyankes.`data`.RUMAH_SAKIT as nama_faskes, '+
        'db_fasyankes.`data`.provinsi_id, '+
        'db_fasyankes.provinsi.nama as propinsi, '+
        'db_fasyankes.`data`.kab_kota_id, '+
        'db_fasyankes.kab_kota.nama as kabkot, '+
        'db_fasyankes.`data`.ALAMAT as alamat, '+
        'db_akreditasi.capaian_akreditasi.nama AS `status_akreditasi`, '+
        ' MAX(db_akreditasi.sertifikasi.tanggal_terbit) as tgl_mulai_sertifikat, '+
        'db_akreditasi.sertifikasi.tanggal_kadaluarsa as tgl_akhir_sertifikat,   '+
        'db_akreditasi.pengajuan_survei.kode_rs '+
        'FROM  db_akreditasi.sertifikasi '+
        'INNER JOIN db_akreditasi.capaian_akreditasi ON  db_akreditasi.sertifikasi.capaian_akreditasi_id = db_akreditasi.capaian_akreditasi.id '+
        'INNER JOIN db_akreditasi.rekomendasi ON  db_akreditasi.sertifikasi.rekomendasi_id = db_akreditasi.rekomendasi.id '+
        'INNER JOIN db_akreditasi.survei ON db_akreditasi.rekomendasi.survei_id = db_akreditasi.survei.id '+
        'INNER JOIN db_akreditasi.pengajuan_survei ON db_akreditasi.survei.pengajuan_survei_id = db_akreditasi.pengajuan_survei.id '+
        'INNER JOIN db_fasyankes.`data` ON db_akreditasi.pengajuan_survei.kode_rs = db_fasyankes.`data`.Propinsi '+
        'INNER JOIN db_fasyankes.kab_kota ON db_fasyankes.kab_kota.id = db_fasyankes.`data`.kab_kota_id '+
        'INNER JOIN db_fasyankes.provinsi ON db_fasyankes.provinsi.id = db_fasyankes.`data`.provinsi_id '+
        'GROUP BY db_akreditasi.pengajuan_survei.kode_rs '+
        'UNION '+
        'SELECT  '+
        'db_fasyankes.`data`.RUMAH_SAKIT as nama_faskes, '+
        'db_fasyankes.`data`.provinsi_id, '+
        'db_fasyankes.provinsi.nama as propinsi, '+
        'db_fasyankes.`data`.kab_kota_id, '+
        'db_fasyankes.kab_kota.nama as kabkot, '+
        'db_fasyankes.`data`.ALAMAT as alamat, '+
        'db_akreditasi.capaian_akreditasi.nama AS `status`, '+
        'MAX(db_akreditasi.rekomendasi.tanggal_terbit_sertifikat) as tanggal_terbit, '+
        'db_akreditasi.rekomendasi.tanggal_kadaluarsa_sertifikat as tanggal_kadaluarsa,   '+
        'db_akreditasi.pengajuan_survei.kode_rs '+
        'FROM  db_akreditasi.Sertifikat_progres1 '+
        'INNER JOIN db_akreditasi.rekomendasi ON  db_akreditasi.Sertifikat_progres1.id_rekomendasi = db_akreditasi.rekomendasi.id '+
        'INNER JOIN db_akreditasi.capaian_akreditasi ON  db_akreditasi.rekomendasi.capaian_akreditasi_Id = db_akreditasi.capaian_akreditasi.id '+
        'INNER JOIN db_akreditasi.survei ON db_akreditasi.rekomendasi.survei_id = db_akreditasi.survei.id '+
        'INNER JOIN db_akreditasi.pengajuan_survei ON db_akreditasi.survei.pengajuan_survei_id = db_akreditasi.pengajuan_survei.id '+
        'INNER JOIN db_fasyankes.`data` ON db_akreditasi.pengajuan_survei.kode_rs = db_fasyankes.`data`.Propinsi '+
        'INNER JOIN db_fasyankes.kab_kota ON db_fasyankes.kab_kota.id = db_fasyankes.`data`.kab_kota_id '+
        'INNER JOIN db_fasyankes.provinsi ON db_fasyankes.provinsi.id = db_fasyankes.`data`.provinsi_id '+
        'GROUP BY db_akreditasi.pengajuan_survei.kode_rs '+
        ') akreditasi '
        // 'GROUP BY akreditasi.kode_rs'

    const sqlOrder = 'ORDER BY akreditasi.kode_rs ' 

    const sqlLimit = 'LIMIT ? ' 
            
    const sqlOffSet = 'OFFSET ?'
    const sqlWhere = ' WHERE '
    const sqlGroupBy = 'GROUP BY akreditasi.kode_rs '

    const filter = []
    const sqlFilterValue = []

    const provinsiId = req.query.provinsiId || null
    const kabKotaId = req.query.kabKotaId || null
    const namaFaskes = req.query.namaFaskes || null

    
    if (provinsiId != null) {
        filter.push(" akreditasi.provinsi_id = ? ")
        sqlFilterValue.push((provinsiId))
    }

    if (kabKotaId != null) {
        filter.push(" akreditasi.kab_kota_id = ? ")
        sqlFilterValue.push((kabKotaId))
    }

    if (namaFaskes != null) {
        filter.push(" akreditasi.nama_faskes like ? ")
        sqlFilterValue.push('%'.concat(namaFaskes).concat('%'))
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)


    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = ' ' 
    } else {
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index > 0) {
                sqlFilter = sqlFilter.concat(' and ').concat(value)
            }
        })
    }

    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlGroupBy).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    // const from = 


    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(akreditasi.nama_faskes) as total_row_count '
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