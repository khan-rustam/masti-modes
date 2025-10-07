import { Router } from 'express'
import multer from 'multer'
import { attachSession, requireAdmin } from '../middleware/auth.js'
import { uploadImage, listImages, deleteImage } from '../controllers/cloudinaryController.js'

const upload = multer({ dest: 'tmp/' })
const router = Router()

router.get('/', attachSession, requireAdmin, listImages)
router.post('/', attachSession, requireAdmin, upload.single('file'), uploadImage)
router.delete('/:publicId', attachSession, requireAdmin, deleteImage)

export default router


