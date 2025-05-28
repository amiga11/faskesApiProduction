import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
        'dbfaskes.trans_final.kode_faskes_baru as idBaru, ' +
        'dbfaskes.data_pm.nama_pm as nama, ' +
        'dbfaskes.kategori_pm.kategori_user as kategori, ' +
        'dbfaskes.data_pm.no_sip as noSIP, ' +
        'dbfaskes.data_pm.tgl_berakhir_sip as tanggalBerakhirSIP, ' +
        'dbfaskes.data_pm.kepemilikan_tempat as kepemilikanTempat, ' +
        'dbfaskes.data_pm.no_str as noSTR, ' +
        'dbfaskes.data_pm.tgl_berakhir_str as tanggalBerakhirSTR, ' +
	'dbfaskes.data_pm.pelayanan_yang_diberikan as pelayananKesehatan, ' +
        'dbfaskes.data_pm.alamat_faskes as alamat, ' +
        'dbfaskes.data_pm.no_telp as noTelp, ' +
        'dbfaskes.data_pm.email as email, ' +
        'dbfaskes.data_pm.id_prov_pm as provinsiId, ' +
        'dbfaskes.propinsi.nama_prop as provinsiNama, ' +
        'dbfaskes.data_pm.id_kota_pm as kabKotaId, ' +
        'dbfaskes.kota.nama_kota as kabKotaNama, ' +
        'dbfaskes.data_pm.id_camat_pm as kecamatanId, ' +
        'dbfaskes.data_pm.puskesmas_pembina as puskesmasPembina, ' +
        'dbfaskes.data_pm.kerja_sama_bpjs_kesehatan as kerjaSamaBPJSKesehatan, ' +
        'dbfaskes.data_pm.berjejaring_fktp as berjejaringFKTP, ' +
        'dbfaskes.data_pm.jam_praktik_senin_pagi as jamPraktikSeninPagi, ' +
        'dbfaskes.data_pm.jam_praktik_senin_sore as jamPraktikSeninSore, ' +
        'dbfaskes.data_pm.jam_praktik_selasa_pagi as jamPraktikSelasaPagi, ' +
        'dbfaskes.data_pm.jam_praktik_selasa_sore as jamPraktikSelasaSore, ' +
        'dbfaskes.data_pm.jam_praktik_rabu_pagi as jamPraktikRabuPagi, ' +
        'dbfaskes.data_pm.jam_praktik_rabu_sore as jamPraktikRabuSore, ' +
        'dbfaskes.data_pm.jam_praktik_kamis_pagi as jamPraktikKamisPagi, ' +
        'dbfaskes.data_pm.jam_praktik_kamis_sore as jamPraktikKamisSore, ' +
        'dbfaskes.data_pm.jam_praktik_jumat_pagi as jamPraktikJumatPagi, ' +
        'dbfaskes.data_pm.jam_praktik_jumat_sore as jamPraktikJumatSore, ' +
        'dbfaskes.data_pm.jam_praktik_sabtu_pagi as jamPraktikSabtuPagi, ' +
        'dbfaskes.data_pm.jam_praktik_sabtu_sore as jamPraktikSabtuSore, ' +
        'dbfaskes.data_pm.jam_praktik_minggu_pagi as jamPraktikMingguPagi, ' +
        'dbfaskes.data_pm.jam_praktik_minggu_sore as jamPraktikMingguSore, ' +
        'dbfaskes.data_pm.latitude, ' +
        'dbfaskes.data_pm.longitude, ' +
        'CASE ' +
            'WHEN dbfaskes.data_rme.status = 1 THEN "Ya" ' +
            'WHEN dbfaskes.data_rme.status = 0 THEN "Tidak" ' +
        'END as statusRME, ' +


        'CASE ' +
        'WHEN dbfaskes.trans_final.status_pendaftaran = 1 THEN "Proses" ' +
        'WHEN dbfaskes.trans_final.status_pendaftaran = 2 THEN "Selesai" ' +
    'END as statusPendaftaran, ' +

        
        'dbfaskes.satu_sehat.nama_pic, '+
        'dbfaskes.satu_sehat.email_integrasi, '+
        'dbfaskes.satu_sehat.telp_pic, '+
        'dbfaskes.penanggung_jawab_faskes.nama as nama_pj, '+
        'dbfaskes.jabatan.nama as jabatan_pj, '+
        'dbfaskes.penanggung_jawab_faskes.nik as nik_pj, '+
        'dbfaskes.penanggung_jawab_faskes.email as email_pj, '+
        'dbfaskes.penanggung_jawab_faskes.telp as telp_pj, '+
        'dbfaskes.penanggung_jawab_faskes.no_str as  no_str_pj, '+

        'dbfaskes.m_jenis_vendor.nama as jenisPengembangSIM, ' +
        'dbfaskes.sim_pengembang.dtoId as idPengembangSIM, ' +
        'dbfaskes.sim_pengembang.nameFacility as namaPengembangSIM, ' +
        'dbfaskes.data_rme.persetujuan_ketentuan_satset_id as idPersetujuanKetentuanAPISatSet, ' +
        'dbfaskes.data_pm.status_pm as statusAktivasi, ' +
        'dbfaskes.data_pm.created_at, ' +
        'dbfaskes.data_pm.modified_at '

        const sqlFrom = 'FROM dbfaskes.data_pm ' +
        'INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_pm.id_faskes ' +
        'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_pm.id_prov_pm ' +
        'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_pm.id_kota_pm ' +
        'INNER JOIN dbfaskes.kategori_pm ON dbfaskes.kategori_pm.id = dbfaskes.data_pm.id_kategori ' +
        'LEFT JOIN dbfaskes.data_rme ON dbfaskes.data_rme.id_faskes = dbfaskes.data_pm.id_faskes ' +
        'LEFT JOIN dbfaskes.sim_pengembang ON dbfaskes.data_rme.sim_pengembang_id = dbfaskes.sim_pengembang.id ' +
        'LEFT JOIN dbfaskes.m_jenis_vendor ON dbfaskes.m_jenis_vendor.id = dbfaskes.data_rme.jenis_vendor_id ' +
        'LEFT JOIN dbfaskes.satu_sehat ON dbfaskes.data_pm.id_faskes = dbfaskes.satu_sehat.id_faskes '+
        'LEFT JOIN dbfaskes.penanggung_jawab_faskes ON dbfaskes.data_pm.id_faskes = dbfaskes.penanggung_jawab_faskes.id_faskes '+
        'LEFT JOIN dbfaskes.jabatan ON dbfaskes.penanggung_jawab_faskes.jabatan_id = dbfaskes.jabatan.id '
     const sqlOrder = ' ORDER BY dbfaskes.trans_final.kode_faskes_baru '
    const sqlLimit = 'LIMIT ? '
    
    const sqlOffSet = 'OFFSET ?'
    
    const sqlWhere = 'WHERE dbfaskes.trans_final.kode_faskes_baru IS NOT NULL AND dbfaskes.trans_final.kode_faskes IS NOT NULL AND dbfaskes.trans_final.kode_faskes <> "" AND '

    const filter = []
    const sqlFilterValue = []

    const provinsiId = req.query.provinsiId || null
    const kabKotaId = req.query.kabKotaId || null
    const kategoriId = req.query.kategoriId || null
    const nama = req.query.nama || null

    if (provinsiId != null) {
        filter.push("dbfaskes.data_pm.id_prov_pm = ?")
        sqlFilterValue.push(provinsiId)
    }

    if (kabKotaId != null) {
        filter.push("dbfaskes.data_pm.id_kota_pm = ?")
        sqlFilterValue.push(kabKotaId)
    }

    if (kategoriId != null) {
        filter.push("dbfaskes.data_pm.id_kategori = ?")
        sqlFilterValue.push(kategoriId)
    }

    if (nama != null) {
        filter.push("dbfaskes.data_pm.nama_pm like ?")
        sqlFilterValue.push('%'.concat(nama).concat('%'))
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE dbfaskes.trans_final.kode_faskes_baru IS NOT NULL AND dbfaskes.trans_final.kode_faskes IS NOT NULL'
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
export const show = (id, callback) => {
    const sql = 'SELECT ' +
        'dbfaskes.trans_final.kode_faskes as id, ' +
        'dbfaskes.trans_final.kode_faskes_baru as idBaru, ' +
        'dbfaskes.data_pm.nama_pm as nama, ' +
        'dbfaskes.kategori_pm.kategori_user as kategori, ' +
        'dbfaskes.data_pm.no_sip as noSIP, ' +
        'dbfaskes.data_pm.tgl_berakhir_sip as tanggalBerakhirSIP, ' +
        'dbfaskes.data_pm.kepemilikan_tempat as kepemilikanTempat, ' +
        'dbfaskes.data_pm.no_str as noSTR, ' +
        'dbfaskes.data_pm.tgl_berakhir_str as tanggalBerakhirSTR, ' +
        'dbfaskes.data_pm.pelayanan_yang_diberikan as pelayananKesehatan, ' +
	'dbfaskes.data_pm.alamat_faskes as alamat, ' +
        'dbfaskes.data_pm.no_telp as noTelp, ' +
        'dbfaskes.data_pm.email as email, ' +
        'dbfaskes.data_pm.id_prov_pm as provinsiId, ' +
        'dbfaskes.propinsi.nama_prop as provinsiNama, ' +
        'dbfaskes.data_pm.id_kota_pm as kabKotaId, ' +
        'dbfaskes.kota.nama_kota as kabKotaNama, ' +
        'dbfaskes.data_pm.id_camat_pm as kecamatanId, ' +
        'dbfaskes.data_pm.puskesmas_pembina as puskesmasPembina, ' +
        'dbfaskes.data_pm.kerja_sama_bpjs_kesehatan as kerjaSamaBPJSKesehatan, ' +
        'dbfaskes.data_pm.berjejaring_fktp as berjejaringFKTP, ' +
        'dbfaskes.data_pm.jam_praktik_senin_pagi as jamPraktikSeninPagi, ' +
        'dbfaskes.data_pm.jam_praktik_senin_sore as jamPraktikSeninSore, ' +
        'dbfaskes.data_pm.jam_praktik_selasa_pagi as jamPraktikSelasaPagi, ' +
        'dbfaskes.data_pm.jam_praktik_selasa_sore as jamPraktikSelasaSore, ' +
        'dbfaskes.data_pm.jam_praktik_rabu_pagi as jamPraktikRabuPagi, ' +
        'dbfaskes.data_pm.jam_praktik_rabu_sore as jamPraktikRabuSore, ' +
        'dbfaskes.data_pm.jam_praktik_kamis_pagi as jamPraktikKamisPagi, ' +
        'dbfaskes.data_pm.jam_praktik_kamis_sore as jamPraktikKamisSore, ' +
        'dbfaskes.data_pm.jam_praktik_jumat_pagi as jamPraktikJumatPagi, ' +
        'dbfaskes.data_pm.jam_praktik_jumat_sore as jamPraktikJumatSore, ' +
        'dbfaskes.data_pm.jam_praktik_sabtu_pagi as jamPraktikSabtuPagi, ' +
        'dbfaskes.data_pm.jam_praktik_sabtu_sore as jamPraktikSabtuSore, ' +
        'dbfaskes.data_pm.jam_praktik_minggu_pagi as jamPraktikMingguPagi, ' +
        'dbfaskes.data_pm.jam_praktik_minggu_sore as jamPraktikMingguSore, ' +
        'dbfaskes.data_pm.latitude, ' +
        'dbfaskes.data_pm.longitude, ' +
        'CASE ' +
            'WHEN dbfaskes.data_rme.status = 1 THEN "Ya" ' +
            'WHEN dbfaskes.data_rme.status = 0 THEN "Tidak" ' +
        'END as statusRME, ' +
        'dbfaskes.sim_pengembang.dtoId as idPengembangSIM, ' +
        'dbfaskes.sim_pengembang.nameFacility as namaPengembangSIM, ' +
        'dbfaskes.data_pm.status_pm as statusAktivasi, ' +
        'dbfaskes.data_pm.created_at, ' +
        'dbfaskes.data_pm.modified_at ' +
    'FROM ' +
        'dbfaskes.data_pm INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_pm.id_faskes ' +
        'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_pm.id_prov_pm ' +
        'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_pm.id_kota_pm ' +
        'INNER JOIN dbfaskes.kategori_pm ON dbfaskes.kategori_pm.id =  dbfaskes.data_pm.id_kategori ' +
        'LEFT JOIN dbfaskes.data_rme ON dbfaskes.data_rme.id_faskes = dbfaskes.data_pm.id_faskes ' +
        'LEFT JOIN dbfaskes.sim_pengembang ON dbfaskes.data_rme.sim_pengembang_id = dbfaskes.sim_pengembang.id ' +
    'WHERE dbfaskes.trans_final.kode_faskes_baru = ?'

    const sqlFilterValue = [id]
    databaseFKTP.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    })
    .then(
        (res) => {
            callback(null, res)
        },(error) => {
            throw error
        }
    )
    .catch((error) => {
            console.log(error)
        }
    )
}

export const getAsri = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

const sqlSelect = 'SELECT '+
    'dbfaskes.trans_final.kode_faskes_baru as id, '+
    'dbfaskes.data_pm.nama_pm as nama, '+
    'dbfaskes.data_pm.email as email, '+
    'dbfaskes.registrasi_user.no_hp as no_telp, '+
    'satu_sehat_id.secret_key, '+
    'satu_sehat_id.client_id, '+
    'satu_sehat_id.organization_id, '+
    'dbfaskes.kategori_pm.kategori_user as kategori, '+
    'dbfaskes.data_sisdmk.NAMA as namaNakes,'+
    'dbfaskes.data_sisdmk.NIK as nikNakes, ' +
    'dbfaskes.data_sisdmk_pekerjaan.JENIS_SDMK as profesiNakes, '+
    'dbfaskes.data_sisdmk.email as emailNakes, '+
    'dbfaskes.satu_sehat.nama_pic, '+
    'dbfaskes.satu_sehat.email_integrasi, '+
    'dbfaskes.satu_sehat.telp_pic, '+
    'dbfaskes.penanggung_jawab_faskes.nama as nama_pj, '+
    'dbfaskes.jabatan.nama as jabatan_pj, '+
    'dbfaskes.penanggung_jawab_faskes.nik as nik_pj, '+
    'dbfaskes.penanggung_jawab_faskes.email as email_pj, '+
    'dbfaskes.penanggung_jawab_faskes.telp as telp_pj, '+
    'dbfaskes.penanggung_jawab_faskes.no_str as  no_str_pj '

         const sqlFrom = ' FROM dbfaskes.data_pm '+
        ' INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_pm.id_faskes '+
        ' INNER JOIN dbfaskes.registrasi_user ON dbfaskes.registrasi_user.id  = dbfaskes.trans_final.id_faskes '+
        ' INNER JOIN dbfaskes.kategori_pm ON dbfaskes.kategori_pm.id = dbfaskes.registrasi_user.id_kategori_pm '+
        ' INNER JOIN dbfaskes.data_rme ON dbfaskes.data_rme.id_faskes = dbfaskes.data_pm.id_faskes '+
        ' INNER JOIN dbfaskes.data_sisdmk ON dbfaskes.data_sisdmk.id_faskes = dbfaskes.data_pm.id_faskes'+
        ' INNER JOIN dbfaskes.data_sisdmk_pekerjaan ON dbfaskes.data_sisdmk.id = dbfaskes.data_sisdmk_pekerjaan.data_sisdmk_id' +
        ' INNER JOIN dbfaskes.asri_verifikasi ON dbfaskes.asri_verifikasi.kode_faskes = dbfaskes.trans_final.kode_faskes_baru' +
        ' INNER JOIN dbfaskes.satu_sehat_id ON dbfaskes.asri_verifikasi.kode_faskes = dbfaskes.satu_sehat_id.kode_baru_faskes ' +
        'LEFT JOIN dbfaskes.satu_sehat ON dbfaskes.data_pm.id_faskes = dbfaskes.satu_sehat.id_faskes '+
        'LEFT JOIN dbfaskes.penanggung_jawab_faskes ON dbfaskes.data_pm.id_faskes = dbfaskes.penanggung_jawab_faskes.id_faskes '+
        'LEFT JOIN dbfaskes.jabatan ON dbfaskes.penanggung_jawab_faskes.jabatan_id = dbfaskes.jabatan.id '
                
    const sqlOrder = ' ORDER BY dbfaskes.trans_final.kode_faskes_baru '

    // const sqlLimit = 'LIMIT ? '
    
    // const sqlOffSet = 'OFFSET ?'
    
    const sqlWhere = ' WHERE dbfaskes.trans_final.kode_faskes IS NOT NULL AND dbfaskes.trans_final.kode_faskes_baru IS NOT NULL AND dbfaskes.trans_final.kode_faskes <> "" AND dbfaskes.data_rme.sim_pengembang_id = 323  AND dbfaskes.data_rme.status = 1 AND dbfaskes.data_sisdmk.is_active = 1 '
    const filter = []
    const sqlFilterValue = []

    const kodeFaskes = req.query.provinsiId || null

    if (kodeFaskes != null) {
        filter.push(" dbfaskes.trans_final.kode_faskes_baru = ?")
        sqlFilterValue.push(kodeFaskes)
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = ' WHERE dbfaskes.trans_final.kode_faskes IS NOT NULL AND dbfaskes.trans_final.kode_faskes_baru IS NOT NULL AND dbfaskes.trans_final.kode_faskes <> "" AND dbfaskes.data_rme.sim_pengembang_id = 323  AND dbfaskes.data_rme.status = 1 AND dbfaskes.data_sisdmk.is_active = 1 '
    } else {
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index > 0) {
                sqlFilter = sqlFilter.concat(' and ').concat(value)
            }
        })
    }

    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder)
    // .concat(sqlLimit).concat(sqlOffSet)

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

export const insertAsriVerif= (req, callback) => {
    const sqlInsert = 'INSERT INTO dbfaskes.asri_verifikasi (kode_faskes) VALUES ( ? )'
    databaseFKTP.query(sqlInsert, {
        type: QueryTypes.INSERT,
        replacements: [req]
    })
        .then((res) => {
            callback(null, res)
        })
        .catch((error) => {
            callback(error, null)
        })
}
