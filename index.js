
const express = require("express");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());

const port = 5000;


app.get("/", (req,res) => {
    res.send("Server is running succesfully. Now connect mongodb to your server")
})


const dbpass = "KClKK8zwv8Z9dweL";


app.listen(port, () => {
    console.log("server is running");
})