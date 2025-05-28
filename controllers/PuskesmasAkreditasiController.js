
import paginationDB from '../config/PaginationDB.js'
import { getPuskesmasAkreditasi, getSertifikasiPuskesmas } from '../models/PuskesmasAkreditasiModel.js'
import Joi from 'joi'

export const sertifikasiPuskesmas = (req, res) => { 
    getSertifikasiPuskesmas(req, (err, results) => {
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

export const akreditasiPuskesmas = (req, res) => { 

    const schema = Joi.object({
        provinsiId: Joi.string().allow(''),
        kabKotaId: Joi.string().allow('').allow(null),
        namaFaskes: Joi.string().allow(''),
        page: Joi.number(),
        limit: Joi.number()
    })

    const { error, value } =  schema.validate(req.query)

    if (error) {
        res.status(400).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    getPuskesmasAkreditasi(req, (err, results) => {
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