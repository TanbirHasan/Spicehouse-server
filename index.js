
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

require("dotenv").config();


app.use(cors());
app.use(express.json());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u9lhh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


app.get("/", (req,res) => {
    res.send("Server is running succesfully. Now connect mongodb to your server")
})



async function run(){
    try{
      await client.connect();
      const productcollection = client.db("spice-store").collection("products");

      app.get("/products", async (req, res) => {
        const query = {};
        const cursor = productcollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
      });

      // for single data

      app.get("/inventory/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const product = await productcollection.findOne(query);
        res.send(product);
      });
    }
    finally{

    }
}

run().catch(console.dir);




//const dbpass = "KClKK8zwv8Z9dweL";


app.listen(port, () => {
    console.log("server is running");
})