const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const NoticeBord = require("../Models/Notice_bord")
const Admin = require("../Models/Admin_Model")
var jwt = require('jsonwebtoken');
require('dotenv').config()
const fetchadmin = require('../Middleware/Admin_Middleware')
const noticeAttach = require('../../Image_Middleware/notice_attachments')
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require("fs")



// Router 1:- Send Notice  http://localhost:5050/api/noticeBord/send_notice
router.post('/send_notice', fetchadmin, noticeAttach.array("notice_attach"), [
    body('Notice_title', 'Title should be atlest 6 char').isLength({ min: 6 }),
    body('Notice_description', 'Decription should be atlest 10 char').isLength({ min: 10 }),
    body('Group', 'Please Chooes the group').isLength({ min: 2 }),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { Notice_title, Notice_description, Group } = req.body;

    const fetchAdmin = await Admin.findById(req.admin.id);
    if (!fetchAdmin) {
        success = false
        return res.status(400).json({ success, error: "Sorry U should ligin first" })
    }

    try {
        const files = req.files;
        let Notice_attechments
        for (let i = 0; i < files.length; i++) {
            const { path } = files[i];
            Notice_attechments = path
        }

        let noticeBord = new NoticeBord({
            Admin_id: req.admin.id, Notice_title, Notice_description, Notice_attechments, Group
        })

        noticeBord = await noticeBord.save();
        const data = {
            noticeBord: {
                id: noticeBord.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})


// Router 2:- Fetch all notices http://localhost:5050/api/noticeBord/get_all_notice
router.post('/get_all_notice', fetchadmin, async (req, res) => {
    try {
        const fetchAdmin = await Admin.findById(req.admin.id);
        if (!fetchAdmin) {
            success = false
            return res.status(400).json({ success, error: "Sorry U should ligin first" })
        }

        const allnotice = await NoticeBord.find({ Admin_id: req.admin.id });
        res.json(allnotice);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})


// Router 3:- Edit Notice  http://localhost:5050/api/noticeBord/edit_Notice/{id}
router.patch('/edit_notice/:id', fetchadmin, noticeAttach.array("notice_attach"), [
    body('Notice_title', 'Title should be atlest 6 char').isLength({ min: 6 }),
    body('Notice_description', 'Decription should be atlest 10 char').isLength({ min: 10 }),
    body('Group', 'Please Chooes the group').isLength({ min: 2 }),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { Notice_title, Notice_description, Group } = req.body;
    try {
        const fetchAdmin = await Admin.findById(req.admin.id);
        if (!fetchAdmin) {
            success = false
            return res.status(400).json({ success, error: "Sorry U should ligin first" })
        }

        let notice = await NoticeBord.findById(req.params.id);
        if (!notice) {
            success = false;
            return res.status(404).json({ success, error: "not found" })
        }

        const nameOfFile = notice.Notice_attechments;

        const files = req.files;
        let filename
        for (let i = 0; i < files.length; i++) {
            const { path } = files[i];
            filename = path
        }

        const newNotice = {};
        if (Notice_title) { newNotice.Notice_title = Notice_title };
        if (Notice_description) { newNotice.Notice_description = Notice_description };
        if (filename) { newNotice.Notice_attechments = filename };
        if (Group) { newNotice.Group = Group };

        const dirPath = __dirname;   //C:\Users\admin\Desktop\E_diary\Admin\Routers
        const dirname = dirPath.slice(0, -13);
        const filePath = dirname + nameOfFile;    //C:\Users\admin\Desktop\E_diary
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                success = false;
                res.status(404).json({ success, error: 'Error deleting file' });
                return;
            }
        });

        noticeBord = await NoticeBord.findByIdAndUpdate(req.params.id, { $set: newNotice })

        const data = {
            noticeBord: {
                id: noticeBord.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }

})


// Router 4:- Delete Notice  http://localhost:5050/api/noticeBord/delete_notice/{id}
router.delete('/delete_notice/:id', fetchadmin, async (req, res) => {
    const { id } = req.params;
    let success = false;
    try {
        const fetchAdmin = await Admin.findById(req.admin.id);
        if (!fetchAdmin) {
            success = false
            return res.status(400).json({ success, error: "Sorry U should ligin first" })
        }

        let notice = await NoticeBord.findById(id);
        if (!notice) {
            success = false;
            return res.status(404).json({ success, error: "not found" })
        }

        const nameOfFile = notice.Notice_attechments;

        const dirPath = __dirname;   //C:\Users\admin\Desktop\E_diary\Admin\Routers
        const dirname = dirPath.slice(0, -13);
        const filePath = dirname + nameOfFile;    //C:\Users\admin\Desktop\E_diary
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                success = false;
                res.status(404).json({ success, error: 'Error deleting file' });
                return;
            }
        });

        noticeBord = await NoticeBord.findByIdAndDelete(id)

        const data = {
            noticeBord: {
                id: noticeBord.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})


module.exports = router