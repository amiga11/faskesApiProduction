import { insert } from '../models/SatuSehatModel.js'
import Joi from 'joi'

export const insertSatuSehatId = async (req, res) => {
    const schema = Joi.object().keys({
            kodeBaru: Joi.string().required(),
            secretKey: Joi.string().required(),
            clientId: Joi.string().required(),
            organizationId: Joi.string().required(),
            simPengembangId: Joi.number().required(),
            simPengembangNama: Joi.string().required()
        })

    const { error, value } = schema.validate(req.body);
    if (error) {
        res.status(400).send({
            error: true,
            message: error.details[0].message,
        });
        return;
    }

    insert(req, (err, results) => {

        if (err) {
            if (err.name == "SequelizeUniqueConstraintError") {
                res.status(409).send({
                    success: false,
                    message: 'duplicate entry'
                })
            } else {
                console.log(err)
                res.status(403).send({
                    success: false,
                    message: "Gagal Simpan"
                })
            }
            return
        }

        res.status(200).send({
            success: true,
            message: 'data berhasil disimpan'
            // data: {
            //     id: results[0]
            // }
        })
    })
}

