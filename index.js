const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoute = require("./Routes/userRoute");
const shortUrlRoute = require("./Routes/shortUrlRoute");
// const shortUrl = require("./Models/ShortUrl")

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

// shortUrl route
app.use("/shortUrl", shortUrlRoute)



app.listen(PORT, () => console.log(`password-reset server started at ${PORT}`));


