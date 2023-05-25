const multer = require('multer');

const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./Notices")
    },
    filename: (req, file, callback) => {
        callback(null, `notice-${Date.now()}. ${file.originalname}`)
    }
})


const noticeAttach = multer({
    storage: imgconfig
});

module.exports = noticeAttach