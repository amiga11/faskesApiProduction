import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'

export const getSertifikasiKlinik = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT dbfaskes.trans_final.kode_faskes AS kode_faskes,' +
        'dbfaskes.trans_final.kode_faskes_baru AS kode_faskes_baru,' +
        'IF (db_akreditasi_non_rs.tte_dirjen.id IS NOT NULL, db_akreditasi_non_rs.data_sertifikat.status_akreditasi, NULL) AS status_akreditasi, ' +

        'IF (db_akreditasi_non_rs.tte_dirjen.id IS NOT NULL, db_akreditasi_non_rs.data_sertifikat.tgl_survei, NULL ) AS tanggal_mulai, ' +
        'IF (db_akreditasi_non_rs.tte_dirjen.id IS NOT NULL, DATE_ADD( db_akreditasi_non_rs.data_sertifikat.tgl_survei, INTERVAL 5 YEAR ), NULL ) AS tanggal_berakhir, ' +
        'IF (db_akreditasi_non_rs.tte_dirjen.id IS NOT NULL, db_akreditasi_non_rs.data_sertifikat.nomor_surat, NULL ) AS nomor_sertifikat '
    
    const sqlFrom = 'FROM dbfaskes.trans_final ' +
    'LEFT OUTER JOIN dbfaskes.registrasi_user ON dbfaskes.registrasi_user.id = dbfaskes.trans_final.id_faskes ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.pengajuan_usulan_survei ON db_akreditasi_non_rs.pengajuan_usulan_survei.fasyankes_id = dbfaskes.trans_final.kode_faskes ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.penerimaan_pengajuan_usulan_survei ON db_akreditasi_non_rs.penerimaan_pengajuan_usulan_survei.pengajuan_usulan_survei_id = db_akreditasi_non_rs.pengajuan_usulan_survei.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.berkas_usulan_survei ON db_akreditasi_non_rs.berkas_usulan_survei.penerimaan_pengajuan_usulan_survei_id = db_akreditasi_non_rs.penerimaan_pengajuan_usulan_survei.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.kelengkapan_berkas ON db_akreditasi_non_rs.kelengkapan_berkas.berkas_usulan_survei_id = db_akreditasi_non_rs.berkas_usulan_survei.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.penetapan_tanggal_survei ON db_akreditasi_non_rs.penetapan_tanggal_survei.kelengkapan_berkas_id = db_akreditasi_non_rs.kelengkapan_berkas.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.surveior_lapangan ON db_akreditasi_non_rs.surveior_lapangan.penetapan_tanggal_survei_id = db_akreditasi_non_rs.penetapan_tanggal_survei.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.trans_final_ep_surveior ON db_akreditasi_non_rs.trans_final_ep_surveior.penetapan_tanggal_survei_id = db_akreditasi_non_rs.penetapan_tanggal_survei.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.pengiriman_laporan_survei ON db_akreditasi_non_rs.pengiriman_laporan_survei.penetapan_tanggal_survei_id = db_akreditasi_non_rs.penetapan_tanggal_survei.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.penetapan_verifikator ON db_akreditasi_non_rs.penetapan_verifikator.pengiriman_laporan_survei_id = db_akreditasi_non_rs.pengiriman_laporan_survei.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.trans_final_ep_verifikator ON db_akreditasi_non_rs.trans_final_ep_verifikator.penetapan_verifikator_id = db_akreditasi_non_rs.penetapan_verifikator.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.pengiriman_rekomendasi ON db_akreditasi_non_rs.pengiriman_rekomendasi.trans_final_ep_verifikator_id = db_akreditasi_non_rs.trans_final_ep_verifikator.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.status_rekomendasi ON db_akreditasi_non_rs.status_rekomendasi.id = db_akreditasi_non_rs.pengiriman_rekomendasi.status_rekomendasi_id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.persetujuan_ketua ON db_akreditasi_non_rs.persetujuan_ketua.pengiriman_rekomendasi_id = db_akreditasi_non_rs.pengiriman_rekomendasi.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.persetujuan_direktur ON db_akreditasi_non_rs.persetujuan_direktur.persetujuan_ketua_id = db_akreditasi_non_rs.persetujuan_ketua.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.data_sertifikat ON db_akreditasi_non_rs.data_sertifikat.persetujuan_direktur_id = db_akreditasi_non_rs.persetujuan_direktur.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.tte_lpa ON db_akreditasi_non_rs.tte_lpa.data_sertifikat_id = db_akreditasi_non_rs.data_sertifikat.id ' +
    'LEFT OUTER JOIN db_akreditasi_non_rs.tte_dirjen ON db_akreditasi_non_rs.tte_dirjen.tte_lpa_id = db_akreditasi_non_rs.tte_lpa.id '
    
    const sqlOrder = 'ORDER BY db_akreditasi_non_rs.pengajuan_usulan_survei.id ' 

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE dbfaskes.registrasi_user.id_kategori = 5 ' + 
    'AND dbfaskes.trans_final.kode_faskes IS NOT NULL ' 

    const filter = []
    const sqlFilterValue = []

    

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    const sql = sqlSelect.concat(sqlFrom).concat(sqlWhere).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKTP.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(dbfaskes.trans_final.kode_faskes) as total_row_count '
        const sqlCount = sqlSelectCount.concat(sqlFrom).concat(sqlWhere)
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

export const getKlinikAkreditasi = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT  '+
    'dbfaskes.trans_final.kode_faskes_baru as idBaru, '+
    'db_akreditasi_non_rs.data_sertifikat.nama_faskes, '+
    'dbfaskes.data_klinik.id_prov, '+
    'db_akreditasi_non_rs.data_sertifikat.provinsi , '+
    'dbfaskes.data_klinik.id_kota, '+
    'db_akreditasi_non_rs.data_sertifikat.kabkot , '+
    'db_akreditasi_non_rs.data_sertifikat.alamat, '+
    'db_akreditasi_non_rs.data_sertifikat.status_akreditasi, '+
    'db_akreditasi_non_rs.data_sertifikat.tgl_survei as tgl_mulai_sertifikat, '+
    'DATE_ADD( db_akreditasi_non_rs.data_sertifikat.tgl_survei, INTERVAL 5 YEAR ) as tgl_akhir_sertifikat '
    
    const sqlFrom = 'FROM db_akreditasi_non_rs.data_sertifikat '+
    'INNER JOIN db_akreditasi_non_rs.tte_dirjen ON db_akreditasi_non_rs.data_sertifikat.kode_faskes = db_akreditasi_non_rs.tte_dirjen.id_faskes '+
    'JOIN dbfaskes.trans_final ON db_akreditasi_non_rs.data_sertifikat.kode_faskes = dbfaskes.trans_final.kode_faskes '+
    'JOIN dbfaskes.data_klinik ON dbfaskes.trans_final.id_faskes = dbfaskes.data_klinik.id_faskes '
    
    const sqlOrder = ' ORDER BY db_akreditasi_non_rs.data_sertifikat.provinsi ' 

    const sqlLimit = 'LIMIT ? '
            
    const sqlOffSet = 'OFFSET ?'
 
    const sqlWhere = 'WHERE data_sertifikat.jenis_faskes = "Klinik" and '

    const sqlGroupBy = 'GROUP BY db_akreditasi_non_rs.data_sertifikat.kode_faskes '

    const filter = []
    const sqlFilterValue = []

    const provinsiId = req.query.provinsiId || null
    const kabKotaId = req.query.kabKotaId || null
    const namaFaskes = req.query.namaFaskes || null

    
    if (provinsiId != null) {
        filter.push(" dbfaskes.data_klinik.id_prov = ? ")
        sqlFilterValue.push((provinsiId))
    }

    if (kabKotaId != null) {
        filter.push(" dbfaskes.data_klinik.id_kota = ? ")
        sqlFilterValue.push((kabKotaId))
    }

    if (namaFaskes != null) {
        filter.push(" db_akreditasi_non_rs.data_sertifikat.nama_faskes like ? ")
        sqlFilterValue.push('%'.concat(namaFaskes).concat('%'))
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)


    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE data_sertifikat.jenis_faskes = "Klinik" ' 
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

    databaseFKTP.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_akreditasi_non_rs.data_sertifikat.kode_faskes) as total_row_count '
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