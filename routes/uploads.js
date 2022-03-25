import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

/*
Storage engine - multer.diskStorage(obj with two function - destination, )
Destination -  req, file, callback(null - cause there is no error)
Filename - same and for the cb second argument we need to change the
images names every upload, cause if a client uploads two images with
the same name.
Formatting - field name with a date and extantion by the path library
*/

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

// The second extname is a method that gets the extantion of the file by the path obj
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Images only!')
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

router.post('/', upload.single('picture'), (req, res) => {
    res.send(`/${req.file.path}`)
})

export default router