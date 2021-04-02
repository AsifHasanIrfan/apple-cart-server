const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iq5lz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(express.json());
app.use(cors());
const port = 5000 || process.env.PORT;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const productsCollection = client.db("appleCart").collection("products");
  const ordersCollection = client.db("appleCart").collection("orders");

    app.post('/addProducts', (req, res) => {
        const product = req.body;
        productsCollection.insertOne(product)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/products', (req, res) => {
      productsCollection.find()
      .toArray( (err, items) => {
        res.send(items)
      })
    })

    app.get('/product/:id', (req, res) => {
      productsCollection.find({_id: ObjectId(req.params.id)})
      .toArray( (err, item) => {
        res.send(item);
      })
    })

    app.delete('/deleteProduct/:id', (req, res) => {
      const id = ObjectId(req.params.id)
      productsCollection.findOneAndDelete({_id: id})
      .then(document => res.send(!!document.value))
    })

    app.post('/addOrders', (req, res) => {
      const orders = req.body;
      ordersCollection.insertOne(orders)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/orders', (req, res) => {
    ordersCollection.find({email: req.query.email})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)