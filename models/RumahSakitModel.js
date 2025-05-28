import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
        'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
        'db_fasyankes.m_jenis.alias AS jenis, ' +
        'db_fasyankes.m_kelas.kelas AS kelas, ' +
        'db_fasyankes.`data`.TELEPON AS telepon, ' +
        'db_fasyankes.`data`.EMAIL as email, ' +
        'db_fasyankes.`data`.WEBSITE AS website, ' +
        'db_fasyankes.`m_blu`.blu AS statusBLU, ' +
        'db_fasyankes.`data`.NO_SURAT_IJIN AS noSuratIjinOperasional, ' +
        'db_fasyankes.`data`.TANGGAL_SURAT_IJIN AS tanggalSuratIjinOperasional, ' +
        'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
        'db_fasyankes.m_simrs.simrs AS ketersediaanSIMRS, ' +
	        '(select dbyankes.status_internet.status_akses as akses_internet ' + 
        'from dbyankes.kondisi  ' +
        'left join dbyankes.status_internet ON dbyankes.status_internet.id_akses=dbyankes.kondisi.id_akses  ' +
        'WHERE dbyankes.kondisi.koders=db_fasyankes.`data`.Propinsi LIMIT 1) as `aksesInternet`,  ' +
        'db_fasyankes.`data`.LUAS_TANAH AS luasTanah, ' +
        'db_fasyankes.`data`.LUAS_BANGUNAN AS luasBangunan, ' +
        'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
        'db_fasyankes.m_blu.blu as statusBLU, ' +
        'db_fasyankes.t_dok_tariflayanan_rs.url as urlTarif, ' +
        'db_fasyankes.t_dok_tariflayanan_rs.status_validasi as statusValidasiTarif, ' +
        'db_fasyankes.`data`.ALAMAT AS alamat, ' +
        'db_fasyankes.`data`.provinsi_id, ' +
        'db_fasyankes.provinsi.nama as provinsiNama, ' +
        'db_fasyankes.`data`.kab_kota_id, ' +
        'db_fasyankes.kab_kota.nama as kabKotaNama, ' +
        'db_fasyankes.koordinat.long as longitude, ' +
        'db_fasyankes.koordinat.alt as latitude, ' +
	'db_fasyankes.penanggung_jawab_faskes.nik as nik_pj, ' + 
	'db_fasyankes.penanggung_jawab_faskes.nama as nama_pj, ' +
	'db_fasyankes.tb_jabatan.nama as jabatan_pj, ' +
	'db_fasyankes.penanggung_jawab_faskes.email as email_pj, ' + 
	'db_fasyankes.penanggung_jawab_faskes.telp as telp_pj,  ' +
	'db_fasyankes.penanggung_jawab_faskes.no_str as no_str_pj, ' +
        'db_fasyankes.`data`.aktive as statusAktivasi, ' +
        'derivedtable2.url as urlFotoDepan, ' +
        // 'derivedtable3.idPengembangSIM, ' +
        // 'derivedtable3.namaPengembangSIM, ' +
        'db_fasyankes.`data`.TANGGAL_UPDATE as modified_at '

        const sqlFrom = 'FROM ' +
        '(SELECT ' +
        'db_fasyankes.`data`.Propinsi as faskesId ' +
        'FROM ' +
            'db_fasyankes.`data` ' +
            'LEFT OUTER JOIN db_fasyankes.t_pelayanan ON db_fasyankes.t_pelayanan.koders = db_fasyankes.`data`.Propinsi ' +
            'LEFT JOIN db_fasyankes.m_pelayanan ON db_fasyankes.m_pelayanan.kode_pelayanan = db_fasyankes.t_pelayanan.kode_pelayanan ' +
        'WHERE ' +
            'db_fasyankes.m_pelayanan.pelayanan LIKE ? ' +
        'GROUP BY db_fasyankes.`data`.Propinsi) derivedTable1 ' +
        'INNER JOIN db_fasyankes.`data` ON db_fasyankes.`data`.Propinsi = derivedTable1.faskesId ' +
        'LEFT OUTER JOIN db_fasyankes.provinsi ON db_fasyankes.provinsi.id = db_fasyankes.`data`.provinsi_id ' +
        'LEFT OUTER JOIN db_fasyankes.kab_kota ON db_fasyankes.kab_kota.id = db_fasyankes.`data`.kab_kota_id ' +
        'LEFT OUTER JOIN db_fasyankes.m_jenis ' +
        'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data`.JENIS ' +
        'LEFT OUTER JOIN db_fasyankes.m_kelas ' +
        'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data`.KLS_RS ' +
        'LEFT OUTER JOIN db_fasyankes.m_kepemilikan ' +
        'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data`.PENYELENGGARA ' +
        'LEFT OUTER JOIN db_fasyankes.m_blu ON db_fasyankes.m_blu.id_blu = db_fasyankes.`data`.blu  ' +
        'LEFT OUTER JOIN db_fasyankes.koordinat ON db_fasyankes.koordinat.koders = db_fasyankes.`data`.propinsi ' +
        'LEFT OUTER JOIN db_fasyankes.m_simrs ON db_fasyankes.m_simrs.id_simrs = db_fasyankes.`data`.simrs ' +
        'LEFT OUTER JOIN db_fasyankes.t_dok_tariflayanan_rs on db_fasyankes.t_dok_tariflayanan_rs.koders = db_fasyankes.`data`.Propinsi ' +
        'LEFT OUTER JOIN ( ' +
            'SELECT db_fasyankes.t_images.koders, db_fasyankes.t_images.url ' +
            'FROM db_fasyankes.t_images ' +
            'WHERE db_fasyankes.t_images.keterangan = "depan" ' +
        ') derivedtable2 ON derivedtable2.koders = db_fasyankes.`data`.Propinsi '+
	' LEFT JOIN db_fasyankes.penanggung_jawab_faskes ON db_fasyankes.penanggung_jawab_faskes.kode_faskes = db_fasyankes.`data`.Propinsi ' +
	' LEFT JOIN db_fasyankes.tb_jabatan ON db_fasyankes.tb_jabatan.id = db_fasyankes.penanggung_jawab_faskes.jabatan '
        // 'LEFT OUTER JOIN ( ' +
        //     'select dbyankes.kondisi.koders as koders, dbyankes.kondisi.sim_pengembang_id as idPengembangSIM, db_fasyankes.sim_pengembang.nameFacility as namaPengembangSIM ' +
        //     'from dbyankes.kondisi ' +
        //     'LEFT JOIN db_fasyankes.sim_pengembang ON dbyankes.kondisi.sim_pengembang_id = db_fasyankes.sim_pengembang.id ' +
        //     'where dbyankes.kondisi.sim_pengembang_id is not null ' +
        // ') derivedtable3 ON derivedtable3.koders = db_fasyankes.`data`.Propinsi '

        const sqlOrder = ' ORDER BY db_fasyankes.`data`.Propinsi  ' 

        const sqlLimit = 'LIMIT ? '
            
        const sqlOffSet = 'OFFSET ?'

        const sqlWhere = 'WHERE db_fasyankes.`data`.Propinsi NOT IN ("9999999","7371435","7371121","") AND '

        const filter = []
        const sqlFilterValue = []

        const pelayananNama = req.query.pelayanan || ""
        const provinsiId = req.query.provinsiId || null
        const kabKotaId = req.query.kabKotaId || null
        const nama = req.query.nama || null
        const aktive = req.query.aktive || null
        const startModifiedAt = req.query.startModifiedAt || null
        const endModifiedAt = req.query.endModifiedAt || null

        if (pelayananNama != null) {
            sqlFilterValue.push('%'.concat(pelayananNama).concat('%'))
        }

        if (provinsiId != null) {
            filter.push("db_fasyankes.`data`.provinsi_id = ?")
            sqlFilterValue.push(provinsiId)
        }

        if (kabKotaId != null) {
            filter.push("db_fasyankes.`data`.kab_kota_id = ?")
            sqlFilterValue.push(kabKotaId)
        }

        if (nama != null) {
            filter.push("db_fasyankes.`data`.RUMAH_SAKIT like ?")
            sqlFilterValue.push('%'.concat(nama).concat('%'))
        }

        if (aktive != null) {
            filter.push("db_fasyankes.`data`.aktive = ?")
            sqlFilterValue.push(aktive)
        }

        if (startModifiedAt != null) {
            filter.push("db_fasyankes.`data`.TANGGAL_UPDATE >= ?")
            sqlFilterValue.push(startModifiedAt)
        }
    
        if (endModifiedAt != null) {
            filter.push("db_fasyankes.`data`.TANGGAL_UPDATE <= ?")
            sqlFilterValue.push(endModifiedAt)
        }

        sqlFilterValue.push(endIndex)
        sqlFilterValue.push(startIndex)

        let sqlFilter = ''
        if (filter.length == 0) {
            sqlFilter = 'WHERE db_fasyankes.`data`.Propinsi NOT IN ("9999999","7371435","7371121","")  '
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
        const sqlSelectCount = 'SELECT count(db_fasyankes.`data`.Propinsi) as total_row_count '
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

export const show = (id, callback) => {
    const sql = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
        'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
        'db_fasyankes.m_jenis.alias AS jenis, ' +
        'db_fasyankes.m_kelas.kelas AS kelas, ' +
        'db_fasyankes.`data`.TELEPON AS telepon, ' +
        'db_fasyankes.`data`.EMAIL as email, ' +
        'db_fasyankes.`data`.WEBSITE AS website, ' +
        'db_fasyankes.`m_blu`.blu AS statusBLU, ' +
        'db_fasyankes.`data`.NO_SURAT_IJIN AS noSuratIjinOperasional, ' +
        'db_fasyankes.`data`.TANGGAL_SURAT_IJIN AS tanggalSuratIjinOperasional, ' +
        'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
        'db_fasyankes.m_simrs.simrs AS ketersediaanSIMRS, ' +
        'db_fasyankes.`data`.LUAS_TANAH AS luasTanah, ' +
        'db_fasyankes.`data`.LUAS_BANGUNAN AS luasBangunan, ' +
        'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
        'db_fasyankes.m_blu.blu as statusBLU, ' +
        'db_fasyankes.t_dok_tariflayanan_rs.url as urlTarif, ' +
        'db_fasyankes.`data`.ALAMAT AS alamat, ' +
        'db_fasyankes.`data`.provinsi_id as provinsiId, ' +
        'reference.provinsi.nama as provinsiNama, ' +
        'db_fasyankes.`data`.kab_kota_id as kabKotaId, ' +
        'reference.kab_kota.nama as kabKotaNama, ' +
        'db_fasyankes.koordinat.long as longitude, ' +
        'db_fasyankes.koordinat.alt as latitude, ' +
        'db_fasyankes.`data`.aktive as statusAktivasi, ' +
        'db_fasyankes.`data`.TANGGAL_UPDATE as modified_at ' +
    'FROM ' +
        'db_fasyankes.`data` INNER JOIN reference.provinsi ' +
        'ON reference.provinsi.id = db_fasyankes.`data`.provinsi_id ' +
        'LEFT OUTER JOIN reference.kab_kota ' +
        'ON reference.kab_kota.id = db_fasyankes.`data`.kab_kota_id ' +
        'LEFT OUTER JOIN db_fasyankes.m_jenis ' +
        'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data`.JENIS ' +
        'LEFT OUTER JOIN db_fasyankes.m_kelas ' +
        'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data`.KLS_RS ' +
        'LEFT OUTER JOIN db_fasyankes.m_kepemilikan ' +
        'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data`.PENYELENGGARA ' +
        'LEFT OUTER JOIN db_fasyankes.m_blu ON db_fasyankes.m_blu.id_blu = db_fasyankes.`data`.blu  ' +
        'LEFT OUTER JOIN db_fasyankes.koordinat ON db_fasyankes.koordinat.koders = db_fasyankes.`data`.propinsi ' +
        'LEFT OUTER JOIN db_fasyankes.m_simrs ON db_fasyankes.m_simrs.id_simrs = db_fasyankes.`data`.simrs ' +
        'LEFT OUTER JOIN db_fasyankes.t_dok_tariflayanan_rs on db_fasyankes.t_dok_tariflayanan_rs.koders = db_fasyankes.`data`.Propinsi ' +
    'WHERE db_fasyankes.`data`.Propinsi = ?'

    const sqlFilterValue = [id]
    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    })
    .then(
        (res) => {
            const fotoQuery = 'SELECT db_fasyankes.t_images.url as urlFoto, db_fasyankes.t_images.keterangan ' +
            'FROM db_fasyankes.t_images ' +
            'WHERE db_fasyankes.t_images.koders = ?'
            databaseFKRTL.query(fotoQuery, {
                type: QueryTypes.SELECT,
                replacements: sqlFilterValue
            })
            .then(
                (resFoto) => {
                    const results = res.map((value) => {
                        return {
                            "kode": value.kode,
                            "nama": value.nama,
                            "jenis": value.jenis,
                            "kelas": value.kelas,
                            "telepon": value.telepon,
                            "email": value.email,
                            "website": value.website,
                            "statusBLU": value.statusBLU,
                            "noSuratIjinOperasional": value.noSuratIjinOperasional,
                            "tanggalSuratIjinOperasional": value.tanggalSuratIjinOperasional,
                            "direktur": value.direktur,
                            "ketersediaanSIMRS": value.ketersediaanSIMRS,
                            "luasTanah": value.luasTanah,
                            "luasBangunan": value.luasBangunan,
                            "kepemilikan": value.kepemilikan,
                            "urlTarif": value.urlTarif,
                            "statusValidasiTarif": value.statusValidasiTarif,
                            "alamat": value.alamat,
                            "provinsiId": value.provinsiId,
                            "provinsiNama": value.provinsiNama,
                            "kabKotaId": value.kabKotaId,
                            "kabKotaNama": value.kabKotaNama,
                            "longitude": value.longitude,
                            "latitude": value.latitude,
                            "statusAktivasi": value.statusAktivasi,
                            "modified_at": value.modified_at,
                            "gambar": resFoto
                        }
                    })
                    callback(null, results)
                }),(error) => {
                    throw error
                }
        },(error) => {
            throw error
        }
    )
    .catch((error) => {
            console.log(error)
        }
    )
}