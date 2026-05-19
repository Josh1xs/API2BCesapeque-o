//Aqui en el controlador vamos a definiar las funciones que ejecutaran los metodos de los endpoints

//Importamos el modelo de pizza para poder usarlo en las funciones
//Paso 1: Creo un array de metodos

const providersController = {};

//Importo el Schema a utilizar
import providersModel from "../models/providers.js";
import {v2 as cloudinary} from "cloudinary";
        
//SELECT
providersController.getProviders = async (req, res) => {
    try {
        const providers = await providersModel.find();
        return res.status(200).json(providers);
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"});
    }
};

//INSERT
providersController.insertProvider = async (req, res) => {
    try {
        //Paso 1: Solicitar los datos que se guardaran
        const {name, phone} = req.body;
        //Paso 2: Guardo en el model
        const newProvider = new providersModel({
            name,
            phone,
            image: req.file.path,
            public_id: req.file.filename
        });
        //Paso 3: Guardar todo en la base de datos
        await newProvider.save();
        return res.status(200).json({message: "Proveedor insertado correctamente"});
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"});
    }
};

//UPDATE
providersController.updateProvider = async (req, res) => {
    try {
        //Paso 1: pido los nuevos valores
        const {name, phone} = req.body;
        const providerFound = await providersModel.findById(req.params.id);

        const updatedData= {
            name,
            phone
        }

        //Si viene alaguna imagen
        if(req.file){
            //Eliminar la imagen anterior de Cloudinary
            await cloudinary.uploader.destroy(providerFound.public_id);
            
            updatedData.image = req.file.path;
            updatedData.public_id = req.file.filename;
        }

        //Actualizamos los valores en la base de datos

        await providersModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {new: true}
        );

        return res.status(200).json({message: "Proveedor actualizado correctamente"});
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

//DELETE
providersController.deleteProvider = async (req, res) => {
    try {
        const providerFound = await providersModel.findById(req.params.id);

        await cloudinary.uploader

        await providersModel.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Proveedor eliminado correctamente"});
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export default providersController