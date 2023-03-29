import express from "express";
import{MongoClient} from "mongodb";// npm install mongodb
import * as dotenv from "dotenv";
//const express = require("express");
const app=express();// all GET,POST,PUT,DELETE
dotenv.config();
const PORT = process.env.PORT;
// const MONGO_URL = "mongodb://localhost:27017";// Responsible for mongo Database connection
const MONGO_URL= process.env.MONGO_URL;
console.log(PORT,MONGO_URL);
async function createConnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("MONGO IS CONNECTED");
    return client;
}
const client = await createConnection();
app.use(express.json());
app.get("/",async function(req,response){
    const result = await client.db("B40WE").collection("Rooms").find({}).toArray();
    console.log(result);

    result ?response.send(result) : resp.status(404).send("Empty Rooms Not Find");
});


app.post("/CreateRooms",async function(req,response){
    const data = req.body;
    console.log(data);
    const result = await client.db("B40WE").collection("Rooms").insertMany(data);
    response.send(result);
});


app.get("/AvailableRoomss", async function(req,response){
    const result = await client
    .db("B40WE")
    .collection("Rooms")
    .find({Booked:"False"})
    .toArray();

    result ? response.send(result):response.status(404).send("Empty Rooms Not Find");
});


app.post("/BookRooms", async function(req,response){
    const Data = req.body;
    const date = new date().toString();
    const bookStatus = {Booked:"True"};

    var AvailableRooms = await client
    .db("B40WE")
    .collection("Rooms")
    .findOne({Booked :"False"});

    if(AvailableRooms === null){
        response.send({Message: "No Roomss available !!"});
    }
    const updateData = {RoomsId:AvailableRooms.id,date:date};
    var result = await client
    .db("B40WE")
    .collection("BookedRooms")
    .insertOne(Data);

    result = await client
    .db("B40WE")
    .collection("BookedRooms")
    .updateOne({RoomsId:""},{$set:updateData});

    AvailableRooms = await client
    .db("B40WE")
    .collection("Rooms")
    .updateOne({id:AvailableRooms.id},{$set:bookStatus});

    response.send(result);
});


app.put("/VacantRooms/:id",async function(req,response){
    const{id} = req.params;
    const bookStatus = { Booked:"False"};

    const result = await client
    .db("B40WE")
    .collection("BookedRooms")
    .deleteOne({RoomsId:parseInt(id)});
    if(result.deletedCount >0){
        await client
        .db("B40WE")
        .collection("Rooms")
        .updateOne({id:parseInt(id)},{$set:bookStatus});
    }
    result.deletedCount>0
    ? response.send(result)
    :response.status(404).send("Rooms empty");
});

app.get("/BookedRoomss",async function(req,response){
    const result = await client
    .db("B40WE")
    .collection(BookedRooms)
    .find({})
    .toArray();

    result ? response.send(result):response.status(404).send("Nothing Booked");
});

app.get("/BookedRoomss/:id",async function(req,response){
    const{id}=req.params;
    const result=await client
    .db("B40WE")
    .collection("BookedRooms")
    .find({customerName:id})
    .toArray();

    result?response.send(result):response(404).send("Nothing Booked");
});

app.put("/UpdateAmentities/:id",async function(req,response){
    const{id}=req.params;
    const amentities = req.body;
    console.log(id,amentities);
    const result = await client
    .db("B40WE")
    .collection("Rooms")
    .updateOne({id:parseInt(id)},{$set:amentities});

    response.send(result);
});

app.listen(PORT,()=> console.log(`Server Started in: ${PORT}`));
console.log("Execution Exit");