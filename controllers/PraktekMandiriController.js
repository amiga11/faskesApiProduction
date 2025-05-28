import { get, getAsri, insertAsriVerif, show } from '../models/PraktekMandiriModel.js'
import paginationDB from '../config/PaginationDB.js'
import Joi from 'joi'

export const getPraktekMandiri = (req, res) => {
    const schema = Joi.object({
        provinsiId: Joi.string().allow(''),
        kabKotaId: Joi.string().allow('').allow(null),
        kategoriId: Joi.number().allow('').allow(null),
        nama: Joi.string().allow(''),
        page: Joi.number(),
        limit: Joi.number()
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
                        nama: curr.nama ,
                        kategori: curr.kategori ,
                        noSIP: curr.noSIP,
                        tanggalBerakhirSIP: curr.tanggalBerakhirSIP,
                        kepemilikanTempat: curr.kepemilikanTempat ,
                        noSTR: curr.noSTR,
                        tanggalBerakhirSTR: curr.tanggalBerakhirSTR,
			pelayananKesehatan: curr.pelayananKesehatan,
                        alamat: curr.alamat,
                        noTelp: curr.noTelp,
                        email: curr.email,
                        provinsiId: curr.provinsiId ,
                        provinsiNama: curr.provinsiNama ,
                        kabKotaId: curr.kabKotaId ,
                        kabKotaNama: curr.kabKotaNama ,
                        kecamatanId: curr.kecamatanId ,
                        puskesmasPembina: curr.puskesmasPembina,
                        kerjaSamaBPJSKesehatan: curr.kerjaSamaBPJSKesehatan,
                        berjejaringFKTP: curr.berjejaringFKTP ,
                        jamPraktikSeninPagi: curr.jamPraktikSeninPagi ,
                        jamPraktikSeninSore: curr.jamPraktikSeninSore ,
                        jamPraktikSelasaPagi: curr.jamPraktikSelasaPagi ,
                        jamPraktikSelasaSore: curr.jamPraktikSelasaSore ,
                        jamPraktikRabuPagi: curr.jamPraktikRabuPagi ,
                        jamPraktikRabuSore: curr.jamPraktikRabuSore ,
                        jamPraktikKamisPagi: curr.jamPraktikKamisPagi ,
                        jamPraktikKamisSore: curr.jamPraktikKamisSore ,
                        jamPraktikJumatPagi: curr.jamPraktikJumatPagi ,
                        jamPraktikJumatSore: curr.jamPraktikJumatSore ,
                        jamPraktikSabtuPagi: curr.jamPraktikSabtuPagi ,
                        jamPraktikSabtuSore: curr.jamPraktikSabtuSore ,
                        jamPraktikMingguPagi: curr.jamPraktikMingguPagi ,
                        jamPraktikMingguSore: curr.jamPraktikMingguSore ,
                        latitude: curr.latitude,
                        longitude: curr.longitude,
                        statusRME: curr.statusRME ,
                        jenisPengembangSIM: curr.jenisPengembangSIM ,
                        idPengembangSIM: curr.idPengembangSIM ,
                        namaPengembangSIM: curr.namaPengembangSIM ,
                        idPersetujuanKetentuanAPISatSet: curr.idPersetujuanKetentuanAPISatSet ,
                        statusAktivasi: curr.statusAktivasi ,
                        
                        statusPendaftaran: curr.statusPendaftaran,
                        
                        satuSehat: {
                            namaPic : curr.nama_pic,
                            emailIntegrasi : curr.email_integrasi,
                            telpPic : curr.telp_pic,
                        },
                        penanggungJawabFaskes: { 
                            nama : curr.nama_pj,
                            jabatan : curr.jabatan_pj,
                            email : curr.email_pj,
                            telp : curr.telp_pj,
                            noStr : curr.no_str_pj,
                        },
                        created_at : curr.created_at,
                        modified_at : curr.modified_at
                    };
                } else {
                    acc[key] = {
                        idBaru: curr.idBaru,
                        nama: curr.nama ,
                        kategori: curr.kategori ,
                        noSIP: curr.noSIP,
                        tanggalBerakhirSIP: curr.tanggalBerakhirSIP,
                        kepemilikanTempat: curr.kepemilikanTempat ,
                        noSTR: curr.noSTR,
                        tanggalBerakhirSTR: curr.tanggalBerakhirSTR,
			pelayananKesehatan: curr.pelayananKesehatan,
                        alamat: curr.alamat,
                        noTelp: curr.noTelp,
                        email: curr.email,
                        provinsiId: curr.provinsiId ,
                        provinsiNama: curr.provinsiNama ,
                        kabKotaId: curr.kabKotaId ,
                        kabKotaNama: curr.kabKotaNama ,
                        kecamatanId: curr.kecamatanId ,
                        puskesmasPembina: curr.puskesmasPembina,
                        kerjaSamaBPJSKesehatan: curr.kerjaSamaBPJSKesehatan,
                        berjejaringFKTP: curr.berjejaringFKTP ,
                        jamPraktikSeninPagi: curr.jamPraktikSeninPagi ,
                        jamPraktikSeninSore: curr.jamPraktikSeninSore ,
                        jamPraktikSelasaPagi: curr.jamPraktikSelasaPagi ,
                        jamPraktikSelasaSore: curr.jamPraktikSelasaSore ,
                        jamPraktikRabuPagi: curr.jamPraktikRabuPagi ,
                        jamPraktikRabuSore: curr.jamPraktikRabuSore ,
                        jamPraktikKamisPagi: curr.jamPraktikKamisPagi ,
                        jamPraktikKamisSore: curr.jamPraktikKamisSore ,
                        jamPraktikJumatPagi: curr.jamPraktikJumatPagi ,
                        jamPraktikJumatSore: curr.jamPraktikJumatSore ,
                        jamPraktikSabtuPagi: curr.jamPraktikSabtuPagi ,
                        jamPraktikSabtuSore: curr.jamPraktikSabtuSore ,
                        jamPraktikMingguPagi: curr.jamPraktikMingguPagi ,
                        jamPraktikMingguSore: curr.jamPraktikMingguSore ,
                        latitude: curr.latitude,
                        longitude: curr.longitude,
                        statusRME: curr.statusRME ,
                        jenisPengembangSIM: curr.jenisPengembangSIM ,
                        idPengembangSIM: curr.idPengembangSIM ,
                        namaPengembangSIM: curr.namaPengembangSIM ,
                        idPersetujuanKetentuanAPISatSet: curr.idPersetujuanKetentuanAPISatSet ,
                        statusAktivasi: curr.statusAktivasi ,
statusPendaftaran: curr.statusPendaftaran,
                        created_at : curr.created_at,
                        modified_at : curr.modified_at
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
export const showPraktekMandiri = (req, res) => {
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

export const getPraktekMandiriAsri = (req, res) => {
    const schema = Joi.object({
        kodeFaskes: Joi.string().allow(''),
        page: Joi.number(),
        limit: Joi.number()
    })

    const { error, value } = schema.validate(req.query)

    if (error) {
        res.status(400).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    getAsri(req, (err, results) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }


        const group = results.data.reduce((acc, curr) => {

            const key = `${curr.id}-${curr.nama}-${curr.kategori}`
            if (!acc[key]) {
                if (req.user.level_id == 2) {

                    acc[key] = {
                        id: curr.id,
                        nama: curr.nama,
                        email: curr.email,
                        no_telp: curr.no_telp,
                        secret_key: curr.secret_key,
                        client_id: curr.client_id,
                        organization_id: curr.organization_id,
                        kategori: curr.kategori,
                        satuSehat: {
                            namaPic : curr.nama_pic,
                            emailIntegrasi : curr.email_integrasi,
                            telpPic : curr.telp_pic,
                        },
                        penanggungJawabFaskes: { 
                            nama : curr.nama_pj,
                            jabatan : curr.jabatan_pj,
                            email : curr.email_pj,
                            telp : curr.telp_pj,
                            noStr : curr.no_str_pj,
                        },
                        daftarNakes: [],
                        
                    };
                } else {
                    acc[key] = {
                        id: curr.id,
                        nama: curr.nama,
                        email: curr.email,
                        daftarNakes: []
                    };
                }
            }
            acc[key].daftarNakes.push({
                namaNakes: curr.namaNakes,
              	nikNakes: curr.nikNakes,
                profesiNakes: curr.profesiNakes,
                emailNakes: curr.emailNakes
            }
            );
            return acc
        }, {})

        const message = results.data.length ? 'data found' : 'data not found'

        let newOBj = Object.values(group)

        if (req.user.level_id == 2) {
            for (let i = 0; i < newOBj.length; i++) {
                if (newOBj[i].no_telp.includes('_')) {
                    newOBj[i].no_telp = newOBj[i].no_telp.replace(/_/g, "");
                }
            }
        }

        res.status(200).send({
            status: true,
            message: message,
            // pagination: remarkPagination,
            data: newOBj
        })
    })
}


export const insertAsriVerified = (req, res) => {
    const schema = Joi.object({
        kode_faskes: Joi.string()
            .required(),
    })

    const { error, value } =  schema.validate(req.body)
    
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }
        const data =  req.body.kode_faskes
        
        insertAsriVerif(data, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            res.status(201).send({
                status: true,
                message: "data created",
                data: {
                    id: results[0]
                }
            })
        })
}
