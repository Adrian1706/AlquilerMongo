import {conexion} from "../db/atlas.js";
import {limitGrt} from "../limit/config.js";
import {Router} from 'express';
import {ObjectId} from 'mongodb';

const appAlquiler = Router();

let db = await conexion();

let Alquiler = db.collection("Alquiler");

appAlquiler.get("/", limitGrt(), async (req, res)=>{
    if(!req.rateLimit) return; 
     console.log(req.rateLimit);
     let db = await conexion();
     let Alquiler = db.collection("Alquiler");
     let result = await Alquiler.find({}).toArray();
     res.send(result); 
});

export default appAlquiler;