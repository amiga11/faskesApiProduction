import express from 'express'
import { login } from '../controllers/UserController.js'
import { verifyToken } from '../middleware/VerifyToken.js'
import { getRumahSakit, showRumahSakit } from '../controllers/RumahSakitController.js'
import { getPraktekMandiri, getPraktekMandiriAsri, insertAsriVerified, showPraktekMandiri  } from '../controllers/PraktekMandiriController.js'
import { getKlinik, showKlinik  } from '../controllers/KlinikController.js'
import { getLabKes, showLabKes } from '../controllers/LabKesController.js'
import { getUTD,showUTD } from '../controllers/UTDController.js'
import { getPraktekMandiriNakes } from '../controllers/PraktekMandiriNakesController.js'
import { insertPraktekMandiriReview } from '../controllers/PraktekMandiriReviewController.js'
import { getProvinsi } from '../controllers/ProvinsiController.js'
import { getKabKota } from '../controllers/KabKotaController.js'
import { getKlinikPelayanan } from '../controllers/KlinikPelayananController.js'
import { getPraktekMandiriKategori } from '../controllers/PraktekMandiriKategoriController.js'
import { getRumahSakitPelayanan } from '../controllers/RumahSakitPelayananController.js'
import { getKetersediaanTempatTidur } from '../controllers/KetersediaanTempatTidurController.js'
import { insertRumahSakitNakes, updateRumahSakitNakes, deleteRumahSakitNakes, getRumahsakitNakes, getRumahsakitNakesJumlah } from '../controllers/RumahSakitNakesController.js'
import { pengajuanSurvei, survei, surveiDetail, rekomendasi, sertifikasi, sertifikasiTTE, akreditasiRumahSakit } from '../controllers/RumahSakitAkreditasiController.js'
import { insertSatuSehatId } from '../controllers/SatuSehatController.js'
import { akreditasiKlinik, sertifikasiKlinik} from '../controllers/KlinikAkreditasiController.js'
import { akreditasiLabkes, sertifikasiLabkes} from '../controllers/LabkesAkreditasiController.js'
import { sertifikasiUtd} from '../controllers/UtdAkreditasiModel.js'
import { getPuskesmas, showPuskesmas } from '../controllers/PuskesmasController.js'
import { showDataDasar, showDataDokumen, showDataAlkes, getPembiayaan, getPrognas, getHipertensi, getOhis, getReview, getReviewStar  } from '../controllers/PraktekMandiriInmController.js'
import { getRumahSakitRME } from '../controllers/RumahSakitRMEController.js'
import { akreditasiPuskesmas, sertifikasiPuskesmas } from '../controllers/PuskesmasAkreditasiController.js'
import { getListRs, getNakesRS, getProfile, getTTRS } from '../controllers/DashboardRumahSakitController.js'

const router = express.Router()

// Token
router.post('/faskes/login', login)

// Rumah Sakit
router.get('/faskes/rumahsakit', verifyToken, getRumahSakit)
router.get('/faskes/rumahsakit/:id', verifyToken, showRumahSakit)

// Rumah Sakit RME
router.get('/faskes/rumahsakitketersediaanrme', verifyToken, getRumahSakitRME)

// Rumah Sakit Pelayanan
router.get('/faskes/rumahsakitketersediaanpelayanan', verifyToken, getRumahSakitPelayanan)

// Rumah Sakit Ketersediaan Tempat Tidur
router.get('/faskes/rumahsakitketersediaantempattidur', verifyToken, getKetersediaanTempatTidur)

// Ketersediaan Nakes
router.post('/faskes/ketersediaannakes', verifyToken, insertRumahSakitNakes)
router.patch('/faskes/ketersediaannakes/:id', verifyToken, updateRumahSakitNakes)
router.delete('/faskes/ketersediaannakes/:id', verifyToken, deleteRumahSakitNakes)
router.get('/faskes/ketersediaanjumlahnakes', verifyToken, getRumahsakitNakesJumlah)

//router.get('/faskes/rumahsakitketersediaannakes', verifyToken, getRumahsakitNakes)

// Puskesmas
router.get('/faskes/puskesmas', verifyToken, getPuskesmas)
router.get('/faskes/puskesmas/:id', verifyToken, showPuskesmas)

// Praktek Mandiri
router.get('/faskes/praktekmandiri', verifyToken, getPraktekMandiri)
router.get('/faskes/praktekmandiri/:id', verifyToken, showPraktekMandiri)
router.get('/faskes/praktekmandirinakes', verifyToken, getPraktekMandiriNakes)
router.get('/faskes/tpmdpenggunaasri', verifyToken, getPraktekMandiriAsri)
router.post('/faskes/tpmdasriverified', verifyToken, insertAsriVerified)

// Praktek Mandiri Review
router.post('/faskes/praktekmandirireview', verifyToken, insertPraktekMandiriReview)

// Prakek Mandiri Kategori
router.get('/faskes/praktekmandirikategori', verifyToken, getPraktekMandiriKategori)

// Klinik
router.get('/faskes/klinik', verifyToken, getKlinik)
router.get('/faskes/klinik/:id', verifyToken, showKlinik)

// Klinik Pelayanan
router.get('/faskes/klinikpelayanan', verifyToken, getKlinikPelayanan)

// LabKes
router.get('/faskes/labkes', verifyToken, getLabKes)
router.get('/faskes/labkes/:id', verifyToken, showLabKes)

// UTD
router.get('/faskes/utd', verifyToken, getUTD)
router.get('/faskes/utd/:id', verifyToken, showUTD)

// Provinsi
router.get('/faskes/provinsi', verifyToken, getProvinsi)

// KabKota
router.get('/faskes/kabkota', verifyToken, getKabKota)

// Praktek Mandiri Nakes
// router.get('/faskes/praktekmandirinakes', verifyToken, getPraktekMandiriNakes)

// Akreditasi rumah sakit
router.get('/faskes/rumahsakitpengajuansurveiakreditasi', verifyToken, pengajuanSurvei)
router.get('/faskes/rumahsakitsurveiakreditasi', verifyToken, survei)
router.get('/faskes/rumahsakitsurveidetailakreditasi', verifyToken, surveiDetail)
router.get('/faskes/rumahsakitrekomendasiakreditasi', verifyToken, rekomendasi)
router.get('/faskes/rumahsakitsertifikasiakreditasimanual', verifyToken, sertifikasi)
router.get('/faskes/rumahsakitsertifikasiakreditasielektronik', verifyToken, sertifikasiTTE)

// Satu Sehat ID
router.post('/faskes/satusehatid', verifyToken, insertSatuSehatId)

// Akreditasi Klinik
router.get('/faskes/kliniksertifikasiakreditasi', verifyToken, sertifikasiKlinik)

// Akreditasi Labkes
router.get('/faskes/labkessertifikasiakreditasi', verifyToken, sertifikasiLabkes)

// Akreditasi UTD
router.get('/faskes/utdsertifikasiakreditasi', verifyToken, sertifikasiUtd)

// Akreditasi Puskesmas
router.get('/faskes/puskesmassertifikasiakreditasi', verifyToken, sertifikasiPuskesmas)

// Praktek Mandiri INM
router.get('/faskes/praktekmandiridatadasar/:id', verifyToken, showDataDasar)
router.get('/faskes/praktekmandiridatadokumen/', verifyToken, showDataDokumen)
router.get('/faskes/praktekmandiridataalkes/', verifyToken, showDataAlkes)
router.get('/faskes/praktekmandiridatapembiayaan', verifyToken, getPembiayaan)
router.get('/faskes/praktekmandiridataprognas', verifyToken, getPrognas)
router.get('/faskes/praktekmandiridatahipertensi', verifyToken, getHipertensi)
router.get('/faskes/praktekmandiridataohis', verifyToken, getOhis)
router.get('/faskes/praktekmandiridatareview', verifyToken, getReview)
router.get('/faskes/praktekmandiridatareviewstar', verifyToken, getReviewStar)


// Akreditasi Rumah Sakit
router.get('/faskes/rumahsakitakreditasi', verifyToken, akreditasiRumahSakit)

// Akreditasi Klinik
router.get('/faskes/klinikakreditasi', verifyToken, akreditasiKlinik)

// Akreditasi Labkes
router.get('/faskes/labkesakreditasi', verifyToken, akreditasiLabkes)

// Akreditasi Puskesmas
router.get('/faskes/puskesmasakreditasi', verifyToken, akreditasiPuskesmas)

// // Akreditasi UTD
// router.get('/faskes/utdakreditasi', verifyToken, Utd)


//DashboardRS
router.get('/faskes/dashboard/rs', verifyToken, getListRs)
router.get('/faskes/dashboard/rs/:rsId', verifyToken, getProfile)
router.get('/faskes/dashboard/ketersediantempattidurrs/:rsId', verifyToken, getTTRS)
router.get('/faskes/dashboard/ketersediannakesrs/:rsId', verifyToken, getNakesRS)

export default router
