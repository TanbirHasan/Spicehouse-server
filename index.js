
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const jwt = require("jsonwebtoken");

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


function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
 
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  console.log(token)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({message :"Forbidden Access"});
    }

    req.decoded = decoded;
    next();
  });

}


app.get("/", (req,res) => {
    res.send("Server is running succesfully. Now connect mongodb to your server")
})



async function run(){
    try{
      await client.connect();
      const productcollection = client.db("spice-store").collection("products");

      // getting user with access token jwt

      app.post("/login", async (req, res) => {
        const user = req.body;
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1d",
        });
        res.send({ accessToken });
      });

      app.get("/products", async (req, res) => {
        const query = {};
        const cursor = productcollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
      });

      // for single data

      app.get("/inventory/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const product = await productcollection.findOne(query);
        res.send(product);
      });

      // post a data
      app.post("/newproduct", async (req, res) => {
        const newproduct = req.body;
        const result = await productcollection.insertOne(newproduct);
        res.send(result);
      });

      // getting my list item by email

      app.get("/myitem", verifyJWT, async (req, res) => {
      
        // const email = req.query.email;
        // const query = {email : email};
        // const cursor = productcollection.find(query);
        // const orders = await cursor.toArray();
        // res.send(orders);
         const decodedemail = req.decoded.email;
         console.log(decodedemail);
         

        const email = req.query.email;
        console.log(email)
        const query = { email: email };
        if (email === decodedemail) {
          const cursor = productcollection.find(query);
          const orders = await cursor.toArray();
          res.send(orders);
        } else {
          res.status(403).send({ message: "Forbidden" });
        }
      });

      // reduce a single value

      app.put("/reduce/:id", async (req, res) => {
        const id = req.params.id;
        const updatedquantity = req.body;
        const newquantity = Number(updatedquantity.quantity);
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            quantity: newquantity,
          },
        };
        const result = await productcollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        console.log(result);
        res.send(result);
      });

      // incresing quantity by one

      app.put("/increase/:id", async (req, res) => {
        const id = req.params.id;
        const increasedquantity = req.body;
        const newquantity = increasedquantity.quantity;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
          $set: {
            quantity: newquantity,
          },
        };
        const result = await productcollection.updateOne(
          filter,
          updatedDoc,
          options
        );
        console.log(result);
        res.send(result);
      });

      // delete a data

      app.delete("/product/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = productcollection.deleteOne(query);
        res.send(result);
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