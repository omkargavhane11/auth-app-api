const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoute = require("./Routes/userRoute");
const shortUrl = require("./Models/ShortUrl")

// defining app type
const app = express();

// getting access to files in ".env" folder
dotenv.config();

const PORT = process.env.PORT;

// connecting to mongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log("mongodb connected ✅"));

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// root route
app.get("/", (req, res) => {
    res.send("password-reset app")
})

// user route
app.use("/user", userRoute)

// generate new shortURL 
app.post("/shortUrl", async (req, res) => {
    const newUrlData = await shortUrl.create({ fullUrl: req.body.fullUrl });
    res.send(newUrlData)
})

// get shrinked URL's
app.get("/shortUrl", async (req, res) => {
    const getAllUrls = await shortUrl.find();
    res.send(getAllUrls)
})

// visit specific URL 
app.get("/shortUrl/:shortid", async (req, res) => {
    const getUrl = await shortUrl.findOne({ shortUrl: req.params.shortid });
    getUrl.clicks++;
    getUrl.save();
    res.send({ data: getUrl.fullUrl });
})

app.listen(PORT, () => console.log(`password-reset server started at ${PORT}`));
