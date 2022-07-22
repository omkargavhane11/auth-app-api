const express = require('express');
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require('nodemailer');

const router = express.Router();

// get all users or by query
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.send(err.message);
    }
})

// add new user -- SIGN UP
router.post("/signup", async (req, res) => {
    try {
        const findUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
        if (findUser) {
            res.send({ msg: "User exists with this credentials." })
        } else {
            const salt = await bcrypt.genSalt(Number(process.env.NO_OF_ROUNDS));
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newUser = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            res.send({ msg: "success" });
        }
    } catch (err) {
        res.send({ msg: err.message });
    }
})

// LOGIN 
router.post("/login", async (req, res) => {
    try {
        const findUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

        if (findUser) {
            const verifyPassword = await bcrypt.compare(req.body.password, findUser.password);

            if (verifyPassword) {
                const token = jwt.sign({ id: findUser._id }, process.env.SECRET_KEY)
                res.send({ msg: "success", token: token });
            } else {
                res.send({ msg: "invalid credentials" })
            }
        } else {
            res.send({ msg: "invalid credentials" })
        }


    } catch (err) {
        res.send(err);
    }
})

// verifyemail
router.post("/verifyemail/:email", async (req, res) => {
    const randomUrlCode = crypto.randomBytes(20).toString('hex');
    try {
        const user = await User.findOne({
            email: req.params.email,
        });

        if (!user) {
            res.send({ msg: "invalid" })
        } else {
            user.resetToken = randomUrlCode;
            user.tokenValidity = Date.now() + 3600000;
            user.save();

            let mailTransport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "ogomkargavhane@gmail.com",
                    pass: "ejbdxuivywhrndbp"
                }
            })
            let details = {
                from: "noreply@gmail.com",
                subject: "Password reset",
                to: req.params.email,
                html: `
                <div style={{display: flex,text-align:center,justify-content:center,width:100%}}>
                    <h2>Password reset</h2>
                    <h4>Click on the below link to change your password</h4>
                    <a href="http://localhost:3000/password-reset/${randomUrlCode}">password reset link</a>
                </div>
                `
            }

            mailTransport.sendMail(details, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("mail sent to -- " + to.email);
                }
                // if (i === maillist.length - 1) { msg.transport.close() }
            })


            res.send({ msg: "success" })

        }
    } catch (err) {
        res.send(err.message);
    }
})

// delete user
router.delete("/:userId", async (req, res) => {
    try {
        const deleteUser = await User.deleteOne({ _id: req.params.userId });
        res.send({ msg: "user deleted" });
    } catch (err) {
        res.status(400).send({ msg: err.message });
    }
})

// check token
router.post("/checkToken/:passwordResetToken", async (req, res) => {
    try {
        const findUser = await User.findOne({ resetToken: req.params.passwordResetToken });
        if (findUser && findUser.tokenValidity > Date.now()) {
            res.send({ msg: "valid" });
        } else if (findUser && findUser.tokenValidity < Date.now()) {
            res.send({ msg: "expired" });
        } else {
            res.send({ msg: "invalid" });
        }
    } catch (err) {
        res.send(err.message)
    }
})

// password reset
router.put("/password-reset/:passwordResetToken", async (req, res) => {
    try {
        const findUser = await User.findOne({ resetToken: req.params.passwordResetToken });
        if (findUser && findUser.tokenValidity > Date.now()) {

            const salt = await bcrypt.genSalt(Number(process.env.NO_OF_ROUNDS));
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            findUser.password = hashedPassword;
            findUser.resetToken = undefined;
            findUser.tokenValidity = undefined;
            findUser.save();

            res.send({ msg: "password updated successfully" });

        } else if (findUser && findUser.tokenValidity < Date.now()) {
            res.send({ msg: "password reset link expired" });
        } else {
            res.send({ msg: "invalid link" });
        }
    } catch (err) {
        res.send(err.message)
    }
})

module.exports = router;