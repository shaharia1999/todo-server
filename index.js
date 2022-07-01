const express=require('express');
const app=express();
const bodyparser=require('body-parser');
app.use(express.json());
const cors=require('cors')
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());


const uri = "mongodb+srv://admin:5FhZsMTRSNTKilgo@cluster0.7uu1i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const collection = client.db("primary").collection("primaryDta");
        const complete = client.db("complete").collection("completeData");
      
        //  get api
        app.get('/task',async(req,res)=>{
            const query={};
            const cursor=collection.find(query);
            const users=await cursor.toArray();
            res.send(users)
        })
        app.get('/complete',async(req,res)=>{
            const query={};
            const cursor= complete.find(query);
            const users=await cursor.toArray();
            res.send(users)
        })
         // post data
        app.post('/task',async(req,res)=>{
          const data=req.body;
          console.log(data);
          const result=await collection.insertOne(data)
          res.send(result);
        });
        app.post('/complete',async(req,res)=>{
          const data=req.body;
          console.log(data);
          const result=await complete.insertOne(data)
          res.send(result);
        });
          app.delete('/task/:id',async(req,res)=>{
          const id=req.params.id;
          const filter={_id:ObjectId(id)};
          const result = await collection.deleteOne(filter);
          res.send(result);

      });
          app.delete('/delete/:id',async(req,res)=>{
          const id=req.params.id;
          const filter={_id:id};
          const result=await complete.deleteOne(filter)
          res.send(result);

      })

      app.put('/update/:id',async(req,res)=>{
        const id=req.params.id;
        const user=req.body;
        console.log(user);
        const filter =  {_id:ObjectId(id)} ;
        const options = { upsert: true };
        const updateDoc = {
          $set:user }
          const result = await collection.updateOne(filter, updateDoc, options);
          res.send(result);
    })
    }finally{

    }
}
run().catch(console.dir);


app.listen(port,()=>{
    console.log("Task matchin start");
})