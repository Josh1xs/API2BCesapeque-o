//Aqui en el controlador vamos a definiar las funciones que ejecutaran los metodos de los endpoints

//Importamos el modelo de pizza para poder usarlo en las funciones
//Paso 1: Creo un array de metodos

const pizzasController = {};

//Importo el Schema a utilizar

import pizzasModel from "../models/pizzas.js";

//SELECT
pizzasController.getPizzas = async (req, res) => {
    const pizzas = await pizzasModel.find();
    res.json(pizzas);
};

//INSERT
pizzasController.insertPizza = async (req, res) => {
    //Paso 1: Solicitar los datos que se guardaran
    const {name, description, price, stock} = req.body;
    //Paso 2: Guardo en el model
    const newPizza = new pizzasModel({
        name,
        description,
        price,
        stock
    });
    //Paso 3: Guardar todo en la base de datos
    await newPizza.save();
    res.json({message: "Pizza insertada correctamente"});
};

//UPDATE
pizzasController.updatePizza = async (req, res) => {
    //Paso 1: pido los nuevos valores
    const {name, description, price, stock} = req.body;
    await pizzasModel.findByIdAndUpdate(req.params.id, { 
        name, 
        description, 
        price, 
        stock }, {new: true});

    res.json({message: "Pizza actualizada correctamente"});
};

//DELETE
pizzasController.deletePizza = async (req, res) => {
    await pizzasModel.findByIdAndDelete(req.params.id);
    res.json({message: "Pizza eliminada correctamente"});
}

export default pizzasController