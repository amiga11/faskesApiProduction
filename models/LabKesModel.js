import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
        'dbfaskes.trans_final.kode_faskes_baru as idBaru, ' +
        'dbfaskes.data_labkes.nama_lab as nama, ' +
        'dbfaskes.data_labkes.jenis_pelayanan as jenisPelayanan, ' +
        'dbfaskes.data_labkes.jenis_lab as jenisLab, ' +
        'dbfaskes.data_labkes.lab_medis_khusus as labMedisKhusus, ' +
        'dbfaskes.data_labkes.pelayanan_lain as pelayananLain, ' +
        'dbfaskes.data_labkes.bentuk_pelayanan as bentukPelayanan, ' +
        'dbfaskes.data_labkes.bentuk_lab as bentukLab, ' +
        'dbfaskes.data_labkes.nama_fasyankes_terintegrasi as namaFasyankesTerintegrasi, ' +
        'dbfaskes.data_labkes.status_akreditasi as statusAkreditasi, ' +
        'dbfaskes.data_labkes.rumah_sakit_yang_bekerja_sama as rumahSakitYangBekerjaSama, ' +
        'dbfaskes.data_labkes.status_labkes as statusLabkes, ' +
        'dbfaskes.data_labkes.pemilik as pemilik, ' +
        'dbfaskes.data_labkes.nama_pemilik as namaPemilik, ' +
        'dbfaskes.data_labkes.alamat_faskes as alamat, ' +
        'dbfaskes.data_labkes.email as email, ' +
        'dbfaskes.data_labkes.no_telp as noTelp, ' +
        'dbfaskes.data_labkes.id_prov as provinsiId, ' +
        'dbfaskes.propinsi.nama_prop as provinsiNama, ' +
        'dbfaskes.data_labkes.id_kota as kabKotaId, ' +
        'dbfaskes.kota.nama_kota as kabKotaNama, ' +
        'dbfaskes.data_labkes.id_camat as kecamatanId, ' +
        'dbfaskes.data_labkes.latitude, ' +
        'dbfaskes.data_labkes.longitude, ' +
        'CASE ' +
        'WHEN dbfaskes.data_rme.status = 1 THEN "Ya" ' +
        'WHEN dbfaskes.data_rme.status = 0 THEN "Tidak" ' +
        'END as statusRME, ' +

        'CASE ' +
        'WHEN dbfaskes.trans_final.status_pendaftaran = 1 THEN "Proses" ' +
        'WHEN dbfaskes.trans_final.status_pendaftaran = 2 THEN "Selesai" ' +
        'END as statusPendaftaran, ' +

        'dbfaskes.satu_sehat.nama_pic, ' +
        'dbfaskes.satu_sehat.email_integrasi, ' +
        'dbfaskes.satu_sehat.telp_pic, ' +
        'dbfaskes.penanggung_jawab_faskes.nama as nama_pj, ' +
        'dbfaskes.jabatan.nama as jabatan_pj, ' +
        'dbfaskes.penanggung_jawab_faskes.nik as nik_pj, ' +
        'dbfaskes.penanggung_jawab_faskes.email as email_pj, ' +
        'dbfaskes.penanggung_jawab_faskes.telp as telp_pj, ' +
        'dbfaskes.penanggung_jawab_faskes.no_str as  no_str_pj, ' +

        'dbfaskes.m_jenis_vendor.nama as jenisPengembangSIM, ' +
        'dbfaskes.sim_pengembang.dtoId as idPengembangSIM, ' +
        'dbfaskes.sim_pengembang.nameFacility as namaPengembangSIM, ' +
        'dbfaskes.data_rme.persetujuan_ketentuan_satset_id as idPersetujuanKetentuanAPISatSet, ' +
        'CASE ' +
        'WHEN dbfaskes.data_labkes.status_labkes = "Aktif" THEN 1 ' +
        'WHEN dbfaskes.data_labkes.status_labkes = "Tidak Aktif" THEN 0 ' +
        'END as statusAktivasi, ' +
        'dbfaskes.data_labkes.created_at, ' +
        'dbfaskes.data_labkes.modified_at '

    const sqlFrom = 'FROM ' +
        'dbfaskes.data_labkes INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_labkes.id_faskes ' +
        'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_labkes.id_prov ' +
        'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_labkes.id_kota ' +
        'LEFT JOIN dbfaskes.data_rme ON dbfaskes.data_rme.id_faskes = dbfaskes.data_labkes.id_faskes ' +
        'LEFT JOIN dbfaskes.sim_pengembang ON dbfaskes.data_rme.sim_pengembang_id = dbfaskes.sim_pengembang.id ' +
        'LEFT JOIN dbfaskes.m_jenis_vendor ON dbfaskes.m_jenis_vendor.id = dbfaskes.data_rme.jenis_vendor_id ' +
        'LEFT JOIN dbfaskes.satu_sehat ON dbfaskes.data_labkes.id_faskes = dbfaskes.satu_sehat.id_faskes ' +
        'LEFT JOIN dbfaskes.penanggung_jawab_faskes ON dbfaskes.data_labkes.id_faskes = dbfaskes.penanggung_jawab_faskes.id_faskes ' +
        'LEFT JOIN dbfaskes.jabatan ON dbfaskes.penanggung_jawab_faskes.jabatan_id = dbfaskes.jabatan.id '


     const sqlOrder = ' ORDER BY dbfaskes.trans_final.kode_faskes_baru '

    const sqlLimit = 'LIMIT ? '

    const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE dbfaskes.trans_final.kode_faskes_baru !="" AND dbfaskes.trans_final.kode_faskes IS NOT NULL AND '
    const filter = []
    const sqlFilterValue = []

    const provinsiId = req.query.provinsiId || null
    const kabKotaId = req.query.kabKotaId || null
    const nama = req.query.nama || null

    if (provinsiId != null) {
        filter.push("dbfaskes.data_labkes.id_prov = ?")
        sqlFilterValue.push(provinsiId)
    }

    if (kabKotaId != null) {
        filter.push("dbfaskes.data_labkes.id_kota = ?")
        sqlFilterValue.push(kabKotaId)
    }

    if (nama != null) {
        filter.push("dbfaskes.data_labkes.nama_lab like ?")
        sqlFilterValue.push('%'.concat(nama).concat('%'))
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE dbfaskes.trans_final.kode_faskes_baru !="" AND  dbfaskes.trans_final.kode_faskes IS NOT NULL '
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
                }, (error) => {
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
        'dbfaskes.trans_final.kode_faskes_baru as idBaru, ' +
        'dbfaskes.data_labkes.nama_lab as nama, ' +
        'dbfaskes.data_labkes.jenis_pelayanan as jenisPelayanan, ' +
        'dbfaskes.data_labkes.jenis_lab as jenisLab, ' +
        'dbfaskes.data_labkes.lab_medis_khusus as labMedisKhusus, ' +
        'dbfaskes.data_labkes.pelayanan_lain as pelayananLain, ' +
        'dbfaskes.data_labkes.bentuk_pelayanan as bentukPelayanan, ' +
        'dbfaskes.data_labkes.bentuk_lab as bentukLab, ' +
        'dbfaskes.data_labkes.nama_fasyankes_terintegrasi as namaFasyankesTerintegrasi, ' +
        'dbfaskes.data_labkes.status_akreditasi as statusAkreditasi, ' +
        'dbfaskes.data_labkes.rumah_sakit_yang_bekerja_sama as rumahSakitYangBekerjaSama, ' +
        'dbfaskes.data_labkes.status_labkes as statusLabkes, ' +
        'dbfaskes.data_labkes.pemilik as pemilik, ' +
        'dbfaskes.data_labkes.nama_pemilik as namaPemilik, ' +
        'dbfaskes.data_labkes.alamat_faskes as alamat, ' +
        'dbfaskes.data_labkes.email as email, ' +
        'dbfaskes.data_labkes.no_telp as noTelp, ' +
        'dbfaskes.data_labkes.id_prov as provinsiId, ' +
        'dbfaskes.propinsi.nama_prop as provinsiNama, ' +
        'dbfaskes.data_labkes.id_kota as kabKotaId, ' +
        'dbfaskes.kota.nama_kota as kabKotaNama, ' +
        'dbfaskes.data_labkes.id_camat as kecamatanId, ' +
        'dbfaskes.data_labkes.latitude, ' +
        'dbfaskes.data_labkes.longitude, ' +
        'CASE ' +
        'WHEN dbfaskes.data_rme.status = 1 THEN "Ya" ' +
        'WHEN dbfaskes.data_rme.status = 0 THEN "Tidak" ' +
        'END as statusRME, ' +
        'dbfaskes.sim_pengembang.dtoId as idPengembangSIM, ' +
        'dbfaskes.sim_pengembang.nameFacility as namaVendorSIM, ' +
        'CASE ' +
        'WHEN dbfaskes.data_labkes.status_labkes= "Aktif" THEN 1 ' +
        'WHEN dbfaskes.data_labkes.status_labkes= "Tidak Aktif" THEN 0 ' +
        'END as statusAktivasi, ' +
        'dbfaskes.data_labkes.created_at, ' +
        'dbfaskes.data_labkes.modified_at ' +
        'FROM ' +
        'dbfaskes.data_labkes INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_labkes.id_faskes ' +
        'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_labkes.id_prov ' +
        'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_labkes.id_kota ' +
        'LEFT JOIN dbfaskes.data_rme ON dbfaskes.data_rme.id_faskes = dbfaskes.data_labkes.id_faskes ' +
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
            }, (error) => {
                throw error
            }
        )
        .catch((error) => {
            console.log(error)
        }
        )
}