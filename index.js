const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2v17pzr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


// Collection
     const ProductCollection = client.db("inventoryManagement").collection("shopData");
     const UserCollection = client.db("inventoryManagement").collection("userData");

// Shop data
app.put("/shop/:email",async (req,res) => {
  const email = req.params.email
  const data = req.body;
  const query = {email : email}
  const filter = {
    $set: {
         ShopName: data.shopName,
         ShopLogo: data.shopLogo,
         ShopLocation: data.shopLocation,
         ShopInformation: data.shopInformation,
         OwnerName: data.ownerName,
         OwnerEmail: data.ownerEmail,
    }
  }
  const result = await UserCollection.updateOne(query,filter)
  res.send(result);
})

// User data
app.post("/user",async (req,res) => {
  const data = req.body;
  const query = {email : data.email}
  const exitingUser = await UserCollection.findOne(query);
  if(exitingUser){
   return res.send({message : "User allready exit", insertedId : null})
  }
  const result = await UserCollection.insertOne(data);
  res.send(result);
})

app.get("/userdata", async(req,res) => {
  const data = UserCollection.find();
  const result = await data.toArray()
  res.send(result)
})

app.delete("/delete/:id",async (req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await UserCollection.deleteOne(query)
  res.send(result)
})

app.patch("/makeadmin/:id", async (req,res)=>{
  const id = req.params.id
  const query = { _id: new ObjectId(id) }
  const updateAdmin = {
    $set: {
      Role : "admin"
    }
  }
  const result = await UserCollection.updateOne(query,updateAdmin)
  res.send(result)
})

// app.get("/id",async (req,res) => {
// const value = ShopCollection.find();
// const result = await value.toArray();
// res.send(result);
// })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res) => {
    res.send('side is running')
});

app.listen(port,()=> {
    console.log(`side is running on port:${port}`)
});
