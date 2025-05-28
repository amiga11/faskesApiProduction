import { insert, update, softDelete, get, getTotalNakes } from '../models/RumahSakitNakesModel.js'
import paginationDB from '../config/PaginationDB.js'
import Joi from 'joi'
import joiDate from "@joi/date"

export const insertRumahSakitNakes = async (req, res) => {
    const schema = Joi.object({
        pekerjaan_id: Joi.number().required(),
        biodata_id: Joi.number().required(),
        kode_rs: Joi.string().required(),
        nama: Joi.string().required(),
        nik: Joi.string().required(),
        no_str: Joi.string().required().allow('').allow(null),
        no_sip: Joi.string().required().allow('').allow(null),
        jenis_nakes_id: Joi.number().required(),
        jenis_nakes_nama: Joi.string().required(),
        sub_kategori_nakes_id: Joi.number().required().allow(null),
        sub_kategori_nakes_nama: Joi.string().required().allow(null)
    });

    const { error, value } =  schema.validate(req.body)
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }
    
    insert(req, (err, results) => {

        if (err) {
            if (err.name == "SequelizeUniqueConstraintError") {
                res.status(409).send({
                    success: false,
                    message: 'duplicate entry'
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: err
                })
            }
            return
        }

        res.status(200).send({
            success: true,
            message: 'data berhasil disimpan'
        })
    })
}

export const updateRumahSakitNakes = async (req, res) => {
    const schema = Joi.object({
        biodata_id: Joi.number().required(),
        nama: Joi.string().required(),
        nik: Joi.string().required(),
        no_str: Joi.string().required().allow('').allow(null),
        no_sip: Joi.string().required().allow('').allow(null),
        jenis_nakes_id: Joi.number().required(),
        jenis_nakes_nama: Joi.string().required(),
        sub_kategori_nakes_id: Joi.number().required().allow(null),
        sub_kategori_nakes_nama: Joi.string().required().allow(null),
        is_active: Joi.number().required()
    });

    const { error, value } =  schema.validate(req.body)
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    update(req, req.params.id, (err, result) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }
        if (result == 'row not matched') {
            res.status(404).send({
                status: false,
                message: 'data not found'
            })
            return
        }
        res.status(200).send({
            status: true,
            message: "data updated successfully"
        })
    })
}

export const deleteRumahSakitNakes = async (req, res) => {
    softDelete(req.params.id, (err, result) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }
        if (result == 'row not matched') {
            res.status(404).send({
                status: false,
                message: 'data not found'
            })
            return
        }
        res.status(200).send({
            status: true,
            message: "data deleted successfully",
            data: result
        })
    })
}


export const getRumahsakitNakes = (req, res) => {
    const joi = Joi.extend(joiDate)

    const schema = joi.object({
        // provinsiId: joi.string().required(),
        // kabKotaId: joi.string(),
        rsId: joi.string(),
        createAt: joi.date().format("YYYY-MM-DD"),
        updateAt: joi.date().format('YYYY-MM-DD'),
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

        const paginationDBObject = new paginationDB(results.totalRowCount, results.page, results.limit, results.data)
        const remarkPagination = paginationDBObject.getRemarkPagination()
        const message = results.data.length ? 'data found' : 'data not found'

        res.status(200).send({
            status: true,
            message: message,
            pagination: remarkPagination,
            data: results.data
        })
    })
}

export const getRumahsakitNakesJumlah = (req, res) => {
    const joi = Joi.extend(joiDate)

    const schema = joi.object({
        rsId: joi.string(),
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
    
    getTotalNakes(req, (err, results) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }

        const group = results.data.reduce((acc, curr) => {

            const key = `${curr.rsId }-${curr.namaRs}`;
                if (!acc[key]) {
                    acc[key] = {
                        rsId : curr.rsId,
                        nama: curr.namaRs,
                        daftarNakes: [],
                    };
                }
                acc[key].daftarNakes.push({
                    jenisNakes : curr.jenisNakes,
                    jumlah : curr.jumlahNakes
                });
                return acc
            }, {})

        const paginationDBObject = new paginationDB(results.totalRowCount, results.page, results.limit, results.data)
        const remarkPagination = paginationDBObject.getRemarkPagination()
        const message = results.data.length ? 'data found' : 'data not found'

        res.status(200).send({
            status: true,
            message: message,
            pagination: remarkPagination,
            data: Object.values(group)
        })
    })
}