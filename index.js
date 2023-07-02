const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID=require('mongodb').ObjectID;
const app = express()
const cors=require('cors')
const bodyParser=require('body-parser')
require('dotenv').config()

const port =process.env.PORT|| 4055

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vixpe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db("freshValley").collection("products");
   app.get('/events',(req,res)=>{
     eventCollection.find()
     .toArray((err,items)=>{
       res.send(items)
     })
   })

   
  
  
  
  app.post('/addEvent',(req,res)=>{
    const newEvent=req.body
    console.log('adding new event',newEvent)
    eventCollection.insertOne(newEvent)
    .then(result=>{
      console.log('response',result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })
  app.get('/order/:id',(req,res)=>{
    eventCollection.find({_id:ObjectID(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0]);
  })
  
  
  });



  app.delete('deleteEvent/:id',(req,res)=>{
    const id=ObjectID(req.params.id);
    eventCollection.findOneAndDelete({_id:id})
    .then(documents=>res.send(!!documents.value))
  })
 
});





// app.post('/productByKeys',(req,res)=>{
//   const productKeys=req.body
//   collection.find({key:{$in:productKeys}})
//   .toArray((err,documents)=>{
//     res.send(documents);
// })


// });


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})