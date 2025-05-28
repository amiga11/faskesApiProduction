import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'


export const getListRsModel = (req, callback) => {

    const sqlSelect = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
        'db_fasyankes.`data`.RUMAH_SAKIT AS nama '

    const sqlFrom = 'FROM ' +
        '(SELECT ' +
        'db_fasyankes.`data`.Propinsi as faskesId ' +
        'FROM ' +
        'db_fasyankes.`data` ' +
        'LEFT OUTER JOIN db_fasyankes.t_pelayanan ON db_fasyankes.t_pelayanan.koders = db_fasyankes.`data`.Propinsi ' +
        'LEFT JOIN db_fasyankes.m_pelayanan ON db_fasyankes.m_pelayanan.kode_pelayanan = db_fasyankes.t_pelayanan.kode_pelayanan ' +
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
        ') derivedtable2 ON derivedtable2.koders = db_fasyankes.`data`.Propinsi ' +
        ' LEFT JOIN db_fasyankes.penanggung_jawab_faskes ON db_fasyankes.penanggung_jawab_faskes.kode_faskes = db_fasyankes.`data`.Propinsi ' +
        ' LEFT JOIN db_fasyankes.tb_jabatan ON db_fasyankes.tb_jabatan.id = db_fasyankes.penanggung_jawab_faskes.jabatan '

    const sqlOrder = ' ORDER BY db_fasyankes.`data`.Propinsi  '

    // const sqlLimit = 'LIMIT ? '

    // const sqlOffSet = 'OFFSET ?'

    const sqlWhere = 'WHERE db_fasyankes.`data`.Propinsi NOT IN ("9999999","7371435","7371121","") AND '

    const filter = []
    const sqlFilterValue = []

    const provinsiId = req.query.provinsiId || null
    const kabKotaId = req.query.kabKotaId || null
    const nama = req.query.nama || null
    // const aktive = req.query.aktive || null

    // if (pelayananNama != null) {
    //     sqlFilterValue.push('%'.concat(pelayananNama).concat('%'))
    // }

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

    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder)

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
}


export const getProfileModel = (id, callback) => {
    const sql = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
        'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
        'db_fasyankes.m_jenis.alias AS jenis, ' +
        'db_fasyankes.m_kelas.kelas AS kelas, ' +
        'db_fasyankes.`data`.TELEPON AS telepon, ' +
        'db_fasyankes.`data`.EMAIL as email, ' +
        'db_fasyankes.`m_blu`.blu AS statusBLU, ' +
	'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
        'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
        'db_fasyankes.`data`.ALAMAT AS alamat, ' +
        'db_fasyankes.`data`.provinsi_id as provinsiId, ' +
        'db_fasyankes.provinsi.nama as provinsiNama, ' +
        'db_fasyankes.`data`.kab_kota_id as kabKotaId, ' +
        'db_fasyankes.kab_kota.nama as kabKotaNama, ' +
        'db_fasyankes.koordinat.long as longitude, ' +
        'db_fasyankes.koordinat.alt as latitude, ' +
        'db_fasyankes.`data`.aktive as statusAktivasi, ' +
        'db_fasyankes.`data`.TANGGAL_UPDATE as modified_at ' +
        'FROM ' +
        'db_fasyankes.`data` INNER JOIN db_fasyankes.provinsi ' +
        'ON db_fasyankes.provinsi.id = db_fasyankes.`data`.provinsi_id ' +
        'LEFT OUTER JOIN db_fasyankes.kab_kota ' +
        'ON db_fasyankes.kab_kota.id = db_fasyankes.`data`.kab_kota_id ' +
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
                console.log("halo ", res)
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
                                    "statusBLU": value.statusBLU,
                                    "direktur": value.direktur,
                                    "kepemilikan": value.kepemilikan,
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
                        }), (error) => {
                            throw error
                        }
            }, (error) => {
                throw error
            }
        )
        .catch((error) => {
            console.log(error)
        }
        )
}

export const getTTRSModel = (rsId, callback) => {
    const mapping = {
        '1': 'vvip',
        '2': 'vip',
        '3': 'kelasI',
        '4': 'kelasII',
        '5': 'kelasIII',
        '6,24,25,26,27,38': 'icu',
        '8,51': 'iccu',
        '9,50': 'ricu',
        '7': 'hcu',
        '10,30,39': 'nicu',
        '11,31,40': 'picu',
        '12,28,29,34': 'isolasi',
        '14': 'perinatologi'
    }

    const sql = 'SELECT ' +
        'db_fasyankes.t_tempat_tidur.koders, ' +
        'db_fasyankes.m_tempat_tidur.id_tt, db_fasyankes.m_tempat_tidur.tt, ' +
        'db_fasyankes.t_tempat_tidur.ruang, db_fasyankes.t_tempat_tidur.jumlah ' +
        'FROM' +
        '    db_fasyankes.m_tempat_tidur ' +
        'LEFT JOIN' +
        '    db_fasyankes.t_tempat_tidur ON db_fasyankes.t_tempat_tidur.id_tt = db_fasyankes.m_tempat_tidur.id_tt ' +
        '    AND db_fasyankes.t_tempat_tidur.koders = ? ' +
        'WHERE' +
        '    db_fasyankes.m_tempat_tidur.id_tt in ' +
        '     (1, 2, 3, 4, 5, 6, 24, 25, 26, 27, 38, 8, 51, 9, 50, 7, 10, 30, 39, 11, 31, 40, 12, 28, 29, 34, 14) '

    const sqlFilterValue = [rsId]
    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    })
        .then(
            (res) => {
                const result = res.reduce((acc, item) => {
                    let category;
                    for (const key in mapping) {
                        if (key.includes(item.id_tt)) {
                            category = mapping[key];
                            break;
                        }
                    }
                    if (category) {
                        acc[category] = (acc[category] || 0) + item.jumlah;
                    }
                    return acc;
                }, {});

                callback(null, result);
            }, (error) => {
                throw error
            }
        )
        .catch((error) => {
            console.log(error)
            callback(error, null);
        })
}

export const getNakesRSModel = (rsId, callback) => {
    const mapping = {
        '101010101': 'dokter',
        '101020101': 'dokterGigi',
        '103010102, 103010101, 103020101, 103030101, 103040101, 103050101, 103060101, 103070101, 1030103': 'perawat',
        '10401010, 104010102, 104020101, 104010103': 'bidan',
        '101030101': 'spPd',
        '101030103': 'spA',
        '101030104': 'spB',
        '101030102': 'spOg',
        '101030202': 'spAn',
        '101030203': 'spPk',
        '101030204': 'spPa',
        '101030223, 1010309': 'spRmSpKfr',
        '101030201': 'spRad',
        '101030228': 'spM',
        '101030225': 'SpTht',
        '101030214': 'spS',
        '101030229': 'spJp',
        '101030213': 'spKk',
        '101030222': 'spKjPsikiatri',
        '101030216': 'spP',
        '101030212': 'spU',
        '101030215': 'spO',
        '105010101': 'apoteker',
        '105020203': 'analisFarmasi',
        '111030101': 'atlm',
        '108010101, 108020101': 'nutrisionisDietisien',
        '109010101': 'fisioterapi',
        '111010101': 'radiografer'
    }
    const sql = 'SELECT ' +
        'daftar_nakes.jenis_nakes_id, ' +
        'db_fasyankes.nakes_pekerjaan_dua.kode_rs, ' +
        'db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_nama ' +
        'FROM (  SELECT 101010101 AS jenis_nakes_id ' +
        '    UNION SELECT 101020101 UNION SELECT 103010102 UNION SELECT 103010101 UNION SELECT 103020101 ' +
        '    UNION SELECT 103030101 UNION SELECT 103040101 UNION SELECT 103050101 UNION SELECT 103060101 ' +
        '    UNION SELECT 103070101 UNION SELECT 1030103 UNION SELECT 10401010 UNION SELECT 104010102 ' +
        '    UNION SELECT 104020101 UNION SELECT 104010103 UNION SELECT 101030101 UNION SELECT 101030103 ' +
        '    UNION SELECT 101030104 UNION SELECT 101030102 UNION SELECT 101030202 UNION SELECT 101030203 ' +
        '    UNION SELECT 101030204 UNION SELECT 101030223 UNION SELECT 1010309 UNION SELECT 101030201 ' +
        '    UNION SELECT 101030228 UNION SELECT 101030225 UNION SELECT 101030214 UNION SELECT 101030229 ' +
        '    UNION SELECT 101030213 UNION SELECT 101030222 UNION SELECT 101030216 UNION SELECT 101030212 ' +
        '    UNION SELECT 101030215 UNION SELECT 105010101 UNION SELECT 105020203 UNION SELECT 111030101 ' +
        '    UNION SELECT 108010101 UNION SELECT 108020101 UNION SELECT 109010101 UNION SELECT 111010101 ' +
        ') AS daftar_nakes ' +
        'LEFT JOIN ' +
        'db_fasyankes.nakes_pekerjaan_dua ON daftar_nakes.jenis_nakes_id = db_fasyankes.nakes_pekerjaan_dua.jenis_nakes_id  ' +
        'AND db_fasyankes.nakes_pekerjaan_dua.kode_rs = ? ORDER BY daftar_nakes.jenis_nakes_id'

    const sqlFilterValue = [rsId]
    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    })
        .then(
            (res) => {
                const result = {};

                Object.values(mapping).forEach(category => {
                    result[category] = 0;
                });

                res.forEach(item => {
                    if (item.kode_rs !== null) {
                      for (const key in mapping) {
                        const ids = key.split(',');
                        if (ids.map(Number).includes(item.jenis_nakes_id)) {
                          result[mapping[key]]++;
                          break;
                        }
                      }
                    }
                  });
                callback(null, result)
            }, (error) => {
                throw error
            }
        )
        .catch((error) => {
            console.log(error)
        })
}