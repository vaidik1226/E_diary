const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Admin = require("../../Admin/Models/Admin_Model")
const fetchadmin = require('../../Admin/Middleware/Admin_Middleware');
require('dotenv').config()
const Classes = require("../Models/Class_module")
var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


// Router:1 Create ClassCode http://localhost:5050/api/classcode/create_class_code
router.post('/create_class_code', fetchadmin, [
    body('Standard', 'please enter a standard').isLength({ min: 2, max: 2 }),
    body('Classcode', "Enter a valide classcode").isLength({ min: 3, max: 3 }),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Classcode, Standard } = req.body;
    try {

        const admin = await Admin.findById(req.admin.id)
        if (!admin) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const classes = await Classes.findOne({ Standard: Standard })
        if (!classes) {
            success = false
            return res.status(400).json({ error: "please enter a valide standard" });
        }

        const ClassCode = classes.ClassCode;
        // console.log(cc);
        for (let index = 0; index < ClassCode.length; index++) {
            const element = ClassCode[index];
            if (element == Classcode) {
                success = false
                return res.status(400).json({ error: "Class Code already exist with this standard" });
            }
        }

        // const ClassCode = []

        ClassCode.push(Classcode)

        const newClass = {}
        if (ClassCode) { newClass.ClassCode = ClassCode }



        classCode = await Classes.findByIdAndUpdate(classes.id, { $set: newClass })
        const data = {
            classCode: {
                id: classCode.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });

        // res.send("Hii this is me")


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Router:2 Get ClassCode http://localhost:5050/api/classcode/get_all_classes
router.post('/get_all_classes', fetchadmin, async (req, res) => {
    let success = false;
    try {
        const admin = await Admin.findById(req.admin.id)
        if (!admin) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const classes = await Classes.find()
        if (!classes) {
            success = false
            return res.status(400).json({ error: "This class code is already exist" });
        }

        res.json(classes);


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Router:3 Delete classes http://localhost:5050/api/classcode/delete_class/:{id}
router.delete('/delete_class/:id', fetchadmin, async (req, res) => {
    let success = false;
    const { id } = req.params
    try {
        const admin = await Admin.findById(req.admin.id)
        if (!admin) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const classes = await Classes.findById(id)
        if (!classes) {
            success = false
            return res.status(400).json({ error: "This class code is already exist" });
        }

        const deleteClass = await Classes.findByIdAndDelete(id)

        const data = {
            deleteClass: {
                id: deleteClass.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// Router:4 Get ClassCode of perticuler standard http://localhost:5050/api/classcode/get_all_classes_std_wise
router.post('/get_all_classes_std_wise', fetchadmin, [
    body('Standard', 'please enter a standard').isLength({ min: 2, max: 2 })
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Standard } = req.body;
    try {
        const admin = await Admin.findById(req.admin.id)
        if (!admin) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const classes = await Classes.find({ Standard: Standard })
        if (!classes) {
            success = false
            return res.status(400).json({ error: "This class code is already exist" });
        }

        const allclassCode = []
        for (let index = 0; index < classes.length; index++) {
            const element = classes[index].ClassCode;
            for (let index = 0; index < element.length; index++) {
                const element2 = element[index];
                allclassCode.push(element2)
            }
        }
        res.json(allclassCode);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router