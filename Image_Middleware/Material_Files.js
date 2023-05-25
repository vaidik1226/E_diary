const multer = require('multer');

const imgconfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./Materil")
    },
    filename: (req, file, callback) => {
        callback(null, `material-${Date.now()}. ${file.originalname}`)
    }
})


const materialAttach = multer({
    storage: imgconfig
});

module.exports = materialAttach