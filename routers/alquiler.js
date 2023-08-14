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

appAlquiler.get("/aCliente", limitGrt(), async (req, res) => { 
    if (!req.rateLimit) return;
    console.log(req.rateLimit);
  
    try {
      let db = await conexion();
      let Alquiler = db.collection("Alquiler");
  
      let result = await Alquiler.aggregate([
        { $match: { Estado: "Activo" } },
        {
          
          $lookup: {
            from: "Cliente",
            localField: "ID_Cliente",
            foreignField: "ID_Cliente",
            as: "cliente_data",
          },
        },
        { $unwind: "$cliente_data" }, 
        
        
        {
          $group: {
            _id: "$ID_Alquiler",
            ID_Alquiler: { $first: "$ID_Alquiler" },
            ID_Cliente: { $first: "$ID_Cliente" },
            ID_Automovil: { $first: "$ID_Automovil" },
            Fecha_Inicio: { $first: "$Fecha_Inicio" },
            Fecha_Fin: { $first: "$Fecha_Fin" },
            Costo_Total: { $first: "$Costo_Total" },
            Estado: { $first: "$Estado" },
            Cliente: {
              $mergeObjects: {
                Nombre: "$cliente_data.Nombre",
                Apellido: "$cliente_data.Apellido",
                DNI: "$cliente_data.DNI",
                Direccion: "$cliente_data.Direccion",
                Telefono: "$cliente_data.Telefono",
                Email: "$cliente_data.Email",
              },
            },
          },
        },
      ]).toArray();
  
      res.send(result);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      res.status(500).send("Error al obtener los datos");
    }
  });

export default appAlquiler;