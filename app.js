import dotenv from 'dotenv';
import express from 'express';
import appAlquiler from './routers/alquiler.js';

dotenv.config();

let app=express();

app.use(express.json());
app.use("/alquiler", appAlquiler)
let config = JSON.parse(process.env.MY_SERVER);

app.listen(config, ()=>{
    console.log(`http://${config.hostname}:${config.port}`);
});