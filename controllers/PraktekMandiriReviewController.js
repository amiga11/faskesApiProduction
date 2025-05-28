import { insert } from '../models/PraktekMandiriReviewModel.js'
import Joi from 'joi'

export const insertPraktekMandiriReview = async (req, res) => {
    const schema = Joi.object({
        doctor: Joi.object().keys({
            fasyankes_code: Joi.string().required(),
            nik: Joi.string().required(),
            str_code: Joi.string().allow('').allow(null),
            health_worker_name: Joi.string().required(),
            specialization: Joi.string().required(),
        }),
        info: Joi.object().keys({
            ['checkin-time']: Joi.string().required(),
            ['review-time']: Joi.string().required(),
            ['visit-date']: Joi.string().required()
        }),
        resultRating: Joi.object().keys({
            pointReview: Joi.number().required(),
            pointMax: Joi.number().required()
        }),
        userId: Joi.string().required(),
        resultReviews: Joi.array()
            .items(Joi.object().keys({
                code: Joi.string().required(),
                type: Joi.string().required(),
                questionDescription: Joi.string().required(),
                answer: Joi.string().required(),
                answerPoint: Joi.number().required(),
                answerTime: Joi.string().required(),
                subQuestion: Joi.array().items(Joi.object().keys({
                    code: Joi.string().required(),
                    type: Joi.string().required(),
                    questionDescription: Joi.string().required(),
                    answer: Joi.string().required(),
                    answerPoint: Joi.number().required(),
                    answerTime: Joi.string().allow(''),
                })
                )
            })
            )
            .required(),
    });

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
                res.status(400).send({
                    success: false,
                    message: 'cekk'
                })
            }
            return
        }

        res.status(200).send({
            success: true,
            message: 'data berhasil disimpan',
            data: {
                id: results[0]
            }
        })
    })
}

// export const insertPraktekMandiriReview = async (req, res) => {
//     const schema = Joi.object({
//         doctor: Joi.object().keys({
//             fasyankes_code: Joi.string().required(),
//             nik: Joi.string().required(),
//             str_code: Joi.string().required(),
//             health_worker_name: Joi.string().required(),
//             specialization: Joi.string().required(),
//         }),
//         info: Joi.object().keys({
//             ['checkin-time']: Joi.string().required(),
//             ['review-time']: Joi.string().required(),
//             ['visit-date']: Joi.string().required()
//         }),
//         result: Joi.object().keys({
//             resultPoint: Joi.number().required()
//         }),
//         userId: Joi.string().required(),
//         reviews: Joi.array()
//             .items(Joi.object().keys({
//                 code: Joi.string().required(),
//                 questionDescription: Joi.string().required(),
//                 answer: Joi.string().required(),
//                 answerPoint: Joi.number().required(),
//                 answerDescription: Joi.string().allow('')
//             })
//             )
//             .required(),
//     });

//     const { error, value } = schema.validate(req.body);
//     if (error) {
//         res.status(400).send({
//             error: true,
//             message: error.details[0].message,
//         });
//         return;
//     }

//     insert(req, (err, results) => {

//         if (err) {
//             if (err.name == "SequelizeUniqueConstraintError") {
//                 res.status(409).send({
//                     success: false,
//                     message: 'duplicate entry'
//                 })
//             } else {
//                 res.status(400).send({
//                     success: false,
//                     message: err
//                 })
//             }
//             return
//         }

//         res.status(200).send({
//             success: true,
//             message: 'data berhasil disimpan',
//             data: {
//                 id: results[0]
//             }
//         })
//     })
// }