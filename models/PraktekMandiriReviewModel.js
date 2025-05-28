import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'
import dateFormat from 'dateformat'

export const insert = async (req, callback) => {
    const trans = await databaseFKTP.transaction();
    // console.log(req.body)
    try {
        // Ubah Tanggal Waktu ISO UTC ke Zona WIB
        const checkInTime = new Date(req.body.info['checkin-time'])
        const checkInTimeLocaleDateTime = checkInTime.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })

        const reviewTime = new Date(req.body.info['review-time'])
        const reviewTimeLocaleDateTime = reviewTime.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
        // Hitung hasil penilaian
        // const positiveResponse = req.body.reviews.filter((record) => {
        //     return record.answer.substring(0, 1) === '1'
        // })
        // const ratingResult = positiveResponse.length > 3 ? 1 : 0 

        const header = [
            req.body.doctor.fasyankes_code,
            req.body.doctor.nik,
            req.body.doctor.str_code,
            req.body.doctor.health_worker_name,
            req.body.doctor.specialization,
            dateFormat(checkInTimeLocaleDateTime, 'yyyy-mm-dd HH:MM:ss'),
            dateFormat(reviewTimeLocaleDateTime, 'yyyy-mm-dd HH:MM:ss'),
            req.body.info['visit-date'],
            req.body.resultRating.pointReview,
            req.body.resultRating.pointMax,
            req.body.userId
        ]

        const sqlInsertHeader = 'INSERT INTO dbfaskes.review ' +
            '(`fasyankes_code`,`nik`,`str_code`,`health_worker_name`,`specialization`,`checkin_time`,`review_time`,`visit_date`,`result_point_review`,`result_point_max`,`user_id`) ' +
            'VALUES (?)'

        const insertHeader = await databaseFKTP.query(sqlInsertHeader, {
            type: QueryTypes.INSERT,
            replacements: [header],
            transaction: trans
        })

        const details = req.body.resultReviews.map((value, index) => {
            return [
                insertHeader[0],
                value.code,
                value.type,
                value.questionDescription,
                value.answer,
                value.answerPoint,
                value.answerTime
            ]
        })

        for (let i = 0; i < details.length; i++) {
            const sqlInsertDetails = 'INSERT INTO dbfaskes.review_detail ' +
                '(`review_id`,`qustion_id`, `type_question`,`question_description`,`answer`,`answer_point`,`answer_time`) ' +
                'VALUES ?'

            const insertDetail = await databaseFKTP.query(sqlInsertDetails, {
                type: QueryTypes.INSERT,
                replacements: [[details[i]]],
                transaction: trans
            })

            let subDetail

            if (req.body.resultReviews[i].subQuestion.length > 0) {
                subDetail = req.body.resultReviews[i].subQuestion.map((value, index) => {
                    return [
                        insertDetail[0],
                        value.code,
                        value.type,
                        value.questionDescription,
                        value.answer,
                        value.answerPoint,
                        value.answerTime
                    ]
                })

                const sqlInsertSubDetails = 'INSERT INTO dbfaskes.review_detail_sub ' +
                    '(`review_detail_id`,`question_id`, `type_question`,`question_description`,`answer`,`answer_point`,`answer_time`) ' +
                    'VALUES ?'

                const insertSubDetail = await databaseFKTP.query(sqlInsertSubDetails, {
                    type: QueryTypes.INSERT,
                    replacements: [subDetail],
                    transaction: trans
                })
            }

        }

        await trans.commit()
        callback(null, insertHeader)
    } catch (error) {
        await trans.rollback()
        callback(error, null)
    }
}

// export const insert = async (req, callback) => {
//     const trans = await databaseFKTP.transaction();
//     try {
//         // Ubah Tanggal Waktu ISO UTC ke Zona WIB
//         const checkInTime = new Date(req.body.info['checkin-time'])
//         const checkInTimeLocaleDateTime = checkInTime.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })

//         const reviewTime = new Date(req.body.info['review-time'])
//         const reviewTimeLocaleDateTime = reviewTime.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
//         // Hitung hasil penilaian
//         // const positiveResponse = req.body.reviews.filter((record) => {
//         //     return record.answer.substring(0, 1) === '1'
//         // })
//         // const ratingResult = positiveResponse.length > 3 ? 1 : 0 

//         const header = [
//             req.body.doctor.fasyankes_code,
//             req.body.doctor.nik,
//             req.body.doctor.str_code,
//             req.body.doctor.health_worker_name,
//             req.body.doctor.specialization,
//             dateFormat(checkInTimeLocaleDateTime, 'yyyy-mm-dd HH:MM:ss'),
//             dateFormat(reviewTimeLocaleDateTime, 'yyyy-mm-dd HH:MM:ss'),
//             req.body.info['visit-date'],
//             req.body.result.resultPoint,
//             req.body.userId
//         ]

//         const sqlInsertHeader = 'INSERT INTO dbfaskes.review ' +
//             '(`fasyankes_code`,`nik`,`str_code`,`health_worker_name`,`specialization`,`checkin_time`,`review_time`,`visit_date`,`result_point`,`user_id`) ' +
//             'VALUES (?)'

//         const insertHeader = await databaseFKTP.query(sqlInsertHeader, {
//             type: QueryTypes.INSERT,
//             replacements: [header],
//             transaction: trans
//         })

//         const details = req.body.reviews.map((value, index) => {
//             return [
//                 insertHeader[0],
//                 value.code,
//                 value.questionDescription,
//                 value.answer,
//                 value.answerPoint,
//                 value.answerDescription
//             ]
//         })

//         const sqlInsertDetails = 'INSERT INTO dbfaskes.review_detail ' +
//             '(`review_id`,`qustionId`,`question_description`,`answer`,`answer_point`,`answer_description`) ' +
//             'VALUES ?'

//         const insertDetail = await databaseFKTP.query(sqlInsertDetails, {
//             type: QueryTypes.INSERT,
//             replacements: [details],
//             transaction: trans
//         })

//         await trans.commit()
//         callback(null, insertHeader)
//     } catch (error) {
//         await trans.rollback()
//         callback(error, null)
//     }
// }