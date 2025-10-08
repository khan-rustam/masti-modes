import { Router } from 'express'
import { getPublicSoftware, getSoftwareById, getLatestSoftware, getMostDownloadedSoftware, getRecentlyUpdatedSoftware } from '../controllers/softwareController.js'

const router = Router()

router.get('/', getPublicSoftware)
router.get('/latest', getLatestSoftware)
router.get('/most-downloaded', getMostDownloadedSoftware)
router.get('/recently-updated', getRecentlyUpdatedSoftware)
router.get('/:id', getSoftwareById)

export default router
