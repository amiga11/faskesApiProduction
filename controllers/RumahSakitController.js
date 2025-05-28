import { get, show } from '../models/RumahSakitModel.js'
import paginationDB from '../config/PaginationDB.js'
import Joi from 'joi'
import joiDate from "@joi/date"

export const getRumahSakit = (req, res) => {
    const joi = Joi.extend(joiDate) 

    const schema = joi.object({
        provinsiId: joi.string().allow(''),
        kabKotaId: joi.string().allow('').allow(null),
        nama: joi.string().allow(''),
        pelayanan: joi.string().allow(''),
        aktive: joi.number(),
        startModifiedAt: joi.date().format("YYYY-MM-DD"),
        endModifiedAt: joi.date().format('YYYY-MM-DD'),
        page: joi.number(),
        limit: joi.number()
    })

    const { error, value } =  schema.validate(req.query)

    if (error) {
        res.status(400).send({
            status: false,
            message: error.details[0].message
        })
        return
    }
    
    get(req, (err, results) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }

        const group = results.data.reduce((acc, curr) => {
            const key = `${curr.kode}`
            if (!acc[key]) {
                if (req.user.level_id == 2) {
                    acc[key] = {
                        kode : curr.kode,
                        nama : curr.nama, 
                        jenis : curr.jenis, 
                        kelas : curr.kelas, 
                        telepon : curr.telepon, 
                        email : curr.email, 
                        website : curr.website, 
                        statusBLU : curr.statusBLU, 
                        noSuratIjinOperasional : curr.noSuratIjinOperasional, 
                        tanggalSuratIjinOperasional : curr.tanggalSuratIjinOperasional, 
                        direktur : curr.direktur, 
                        ketersediaanSIMRS : curr.ketersediaanSIMRS, 
                        aksesInternet : curr.aksesInternet, 
                        luasTanah : curr.luasTanah, 
                        luasBangunan : curr.luasBangunan, 
                        kepemilikan : curr.kepemilikan, 
                        urlTarif : curr.urlTarif, 
                        statusValidasiTarif : curr.statusValidasiTarif, 
                        alamat : curr.alamat, 
                        provinsi_id : curr.provinsi_id, 
                        provinsiNama : curr.provinsiNama, 
                        kab_kota_id : curr.kab_kota_id, 
                        kabKotaNama : curr.kabKotaNama, 
                        longitude : curr.longitude, 
                        latitude : curr.latitude, 
                        no_str_pj : curr.no_str_pj, 
                        statusAktivasi : curr.statusAktivasi, 
                        urlFotoDepan : curr.urlFotoDepan, 
                        modified_at : curr.modified_at,
                        satuSehat: {
                            namaPic : curr.nama_pj,
                            emailIntegrasi : curr.email_pj,
                            telpPic : curr.telp_pj,
                        }
                    };
                } else {
                    acc[key] = {
                        kode : curr.kode,
                        nama : curr.nama, 
                        jenis : curr.jenis, 
                        kelas : curr.kelas, 
                        telepon : curr.telepon, 
                        email : curr.email, 
                        website : curr.website, 
                        statusBLU : curr.statusBLU, 
                        noSuratIjinOperasional : curr.noSuratIjinOperasional, 
                        tanggalSuratIjinOperasional : curr.tanggalSuratIjinOperasional, 
                        direktur : curr.direktur, 
                        ketersediaanSIMRS : curr.ketersediaanSIMRS, 
                        aksesInternet : curr.aksesInternet, 
                        luasTanah : curr.luasTanah, 
                        luasBangunan : curr.luasBangunan, 
                        kepemilikan : curr.kepemilikan, 
                        urlTarif : curr.urlTarif, 
                        statusValidasiTarif : curr.statusValidasiTarif, 
                        alamat : curr.alamat, 
                        provinsi_id : curr.provinsi_id, 
                        provinsiNama : curr.provinsiNama, 
                        kab_kota_id : curr.kab_kota_id, 
                        kabKotaNama : curr.kabKotaNama, 
                        longitude : curr.longitude, 
                        latitude : curr.latitude, 
                        no_str_pj : curr.no_str_pj, 
                        statusAktivasi : curr.statusAktivasi, 
                        urlFotoDepan : curr.urlFotoDepan, 
                        modified_at : curr.modified_at
                    };
                }
            }
            return acc
        }, {})

        const paginationDBObject = new paginationDB(results.totalRowCount, results.page, results.limit, results.data)
        const remarkPagination = paginationDBObject.getRemarkPagination()
        const message = results.data.length ? 'data found' : 'data not found'

        let newObj = Object.values(group)
        res.status(200).send({
            status: true,
            message: message,
            pagination: remarkPagination,
            data: newObj
        })
    })
}

export const showRumahSakit = (req, res) => {
    show(req.params.id, (err, results) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }

        const message = results.length ? 'data found' : 'data not found'
        const data = results.length ? results[0] : null

        res.status(200).send({
            status: true,
            message: message,
            data: data
        })
    })
}