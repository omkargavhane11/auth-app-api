const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoute = require("./Routes/userRoute");

// defining app type
const app = express();

// getting access to files in ".env" folder
dotenv.config();

// connecting to mongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log("mongodb connected ✅"));

// middlewares
app.use(express.json());
app.use(cors());

// root route
app.get("/", (req, res) => {
    res.send("password-reset app")
})

// user route
app.use("/user", userRoute)

app.listen(process.env.PORT, () => console.log(`password-reset server started at ${process.env.PORT}`));
