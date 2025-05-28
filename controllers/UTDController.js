import { get, show } from '../models/UTDModel.js'
import paginationDB from '../config/PaginationDB.js'
import Joi from 'joi'

export const getUTD = (req, res) => {
    const schema = Joi.object({
        provinsiId: Joi.string().allow(''),
        kabKotaId: Joi.string().allow('').allow(null),
        nama: Joi.string().allow(''),
        page: Joi.number()
    })

    const { error, value } = schema.validate(req.query)

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
            const key = `${curr.idBaru}`
            if (!acc[key]) {
                if (req.user.level_id == 2) {
                    acc[key] = {
                        idBaru: curr.idBaru,
                        nama: curr.nama,
                        alamat: curr.alamat,
                        statusKepemilikan: curr.statusKepemilikan,
                        namaInstansi: curr.namaInstansi,
                        namaRS: curr.namaRS,
                        jenisUTD: curr.jenisUTD,
                        namaKepalaUTD: curr.namaKepalaUTD,
                        noTelp: curr.noTelp,
                        provinsiId: curr.provinsiId,
                        provinsiNama: curr.provinsiNama,
                        kabKotaId: curr.kabKotaId,
                        kabKotaNama: curr.kabKotaNama,
                        kecamatanId: curr.kecamatanId,
                        email: curr.email,
                        latitude: curr.latitude,
                        longitude: curr.longitude,
                        statusRME: curr.statusRME,
                        jenisPengembangSIM: curr.jenisPengembangSIM,
                        idPengembangSIM: curr.idPengembangSIM,
                        namaPengembangSIM: curr.namaPengembangSIM,
                        akreditasiUTD: curr.akreditasiUTD,
                        idPersetujuanKetentuanAPISatSet: curr.idPersetujuanKetentuanAPISatSet,
                        statusAktivasi: curr.statusAktivasi,
                        statusPendaftaran: curr.statusPendaftaran,
                        satuSehat: {
                            namaPic: curr.nama_pic,
                            emailIntegrasi: curr.email_integrasi,
                            telpPic: curr.telp_pic,
                        },
                        penanggungJawabFaskes: {
                            nama: curr.nama_pj,
                            jabatan: curr.jabatan_pj,
                            //nik: curr.nik_pj,
                            email: curr.email_pj,
                            telp: curr.telp_pj,
                            noStr: curr.no_str_pj,
                        },
                        created_at: curr.created_at,
                        modified_at: curr.modified_at
                    };
                } else {
                    acc[key] = {
                        idBaru: curr.idBaru,
                        nama: curr.nama,
                        alamat: curr.alamat,
                        statusKepemilikan: curr.statusKepemilikan,
                        namaInstansi: curr.namaInstansi,
                        namaRS: curr.namaRS,
                        jenisUTD: curr.jenisUTD,
                        namaKepalaUTD: curr.namaKepalaUTD,
                        noTelp: curr.noTelp,
                        provinsiId: curr.provinsiId,
                        provinsiNama: curr.provinsiNama,
                        kabKotaId: curr.kabKotaId,
                        kabKotaNama: curr.kabKotaNama,
                        kecamatanId: curr.kecamatanId,
                        email: curr.email,
                        latitude: curr.latitude,
                        longitude: curr.longitude,
                        statusRME: curr.statusRME,
                        jenisPengembangSIM: curr.jenisPengembangSIM,
                        idPengembangSIM: curr.idPengembangSIM,
                        namaPengembangSIM: curr.namaPengembangSIM,
                        akreditasiUTD: curr.akreditasiUTD,
                        idPersetujuanKetentuanAPISatSet: curr.idPersetujuanKetentuanAPISatSet,
                        statusAktivasi: curr.statusAktivasi,
                        created_at: curr.created_at
                    };
                }
            }
            // console.log('dataaaa ', acc)
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

export const showUTD = (req, res) => {
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