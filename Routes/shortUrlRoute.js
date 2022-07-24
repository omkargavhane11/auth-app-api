const express = require('express');
const shortUrl = require("../Models/ShortUrl");

const router = express.Router();

// generate new shortURL 
router.post("/", async (req, res) => {
    try {
        const newUrlData = await shortUrl.create({ fullUrl: req.body.fullUrl });
        res.send(newUrlData)
    } catch (err) {
        res.send({ error: err.message });
    }
})

// get shrinked URL's
router.get("/", async (req, res) => {
    try {
        const getAllUrls = await shortUrl.find();
        res.send(getAllUrls)
    } catch (err) {
        res.send({ error: err.message });
    }
})

// visit specific URL 
router.get("/:shortid", async (req, res) => {
    try {
        const getUrl = await shortUrl.findOne({ shortUrl: req.params.shortid });
        // getUrl.clicks++;
        // getUrl.save();
        res.send({ data: getUrl.fullUrl });
        // console.log(getUrl.clicks++);
    } catch (err) {
        res.send({ error: err.message });
    }
})

// delete url 
router.delete("/:shortid", async (req, res) => {
    try {
        const getUrl = await shortUrl.deleteOne({ shortUrl: req.params.shortid });
        res.send("Short URL deleted");
    } catch (err) {
        res.send({ error: err.message });
    }

})

module.exports = router;