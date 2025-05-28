import Joi from 'joi'
import joiDate from "@joi/date"
import { getListRsModel, getNakesRSModel, getProfileModel, getTTRSModel } from '../models/DashboardRumahSakitModel.js'

export const getListRs = (req, res) => {
    if(req.user.id != 112){
        res.status(422).send({
            status: false,
            message: "No Access"
        })
        return
    }

    const joi = Joi.extend(joiDate) 

    const schema = joi.object({
        provinsiId: joi.string().allow(''),
        kabKotaId: joi.string().allow('').allow(null),
        nama: joi.string().allow('')
    })
    
    const { error, value } =  schema.validate(req.query)

    if (error) {
        res.status(400).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    getListRsModel(req, (err, results) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }

        const message = results.data.length ? 'data found' : 'data not found'
        // const data = results.data.length ? results.data[0] : null

        res.status(200).send({
            status: true,
            message: message,
            data: results.data
        })
    })
}

export const getProfile = (req, res) => {
    if(req.user.id != 112){
        res.status(422).send({
            status: false,
            message: "No Access"
        })
        return
    }
    getProfileModel(req.params.rsId, (err, results) => {
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

export const getTTRS = (req, res) => {
    if(req.user.id != 112){
        res.status(422).send({
            status: false,
            message: "No Access"
        })
        return
    }
    getTTRSModel(req.params.rsId, (err, results) => {
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
            data: results
        })
    })
}

export const getNakesRS = (req, res) => {
    if(req.user.id != 112){
        res.status(422).send({
            status: false,
            message: "No Access"
        })
        return
    }

    getNakesRSModel(req.params.rsId, (err, results) => {
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
            data: results
        })
    })
}

