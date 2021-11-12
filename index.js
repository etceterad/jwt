const express = require('express');
const mongoose = require('mongoose');
const authRouter = require("./authRouter");
require('dotenv').config();

const app = express()

app.use(express.json())
app.use("/auth", authRouter)

app.get("/", (req, res) => {
    res.json({message: "success"})
})

async function start() {
    try {
        await mongoose.connect(`mongodb+srv://etceterad:${process.env.DB_PASS}@jwttest.rkhtr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        app.listen(process.env.PORT, () => console.log(`server is listening on ${process.env.PORT}`))
    } catch (e) {
        console.error(e);
    }
}

start()