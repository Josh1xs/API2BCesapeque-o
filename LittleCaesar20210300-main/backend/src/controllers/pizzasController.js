//Aqui en el controlador vamos a definiar las funciones que ejecutaran los metodos de los endpoints

//Importamos el modelo de pizza para poder usarlo en las funciones
//Paso 1: Creo un array de metodos

const pizzasController = {};

import pizzas from "../models/pizzas.js";
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


pizzasController.getPizzasById = async (req,res) => {
   try {

    const pizza = await pizzasModel.findById(req.params.id)

    if(!pizza){
        return res.status(404).json({message: "Pizza no encontrada"})
    }

    return res.status(200).json(pizza);
   } catch (error) {
    console.log("error" + error )
    res.status(500).json({message: "Internal Server Error"})            
   }
}

//Obtener  pizzas con stock  bajo

pizzasController.getLowStock = async (req,res) => {
    try {
        
        const pizzas  = await pizzasModel.find({stock: {$lt: 5}})

        if(!pizzas){
            return res.status(404).json({message: "No hay pizzas con stock bajo"})

        }

                    return res.status(200).json(pizzas)


    } catch (error) {
            console.log("error" + error )
             res.status(500).json({message: "Internal Server Error"})         
    }
}


pizzasController.getPizzaByPriceRange = async (req,res) =>{
    try {
            //1 Solicito los datos 

            const {min, max} = req.body

            const pizzas = await pizzasModel.find({
                price: { $gte: min, $lte: max }
            })

           if(!pizzas) {
            return res.status(404).json({message: "Not pizzas with this price range"})
           }

           return res.status(200).json(pizzas)


    } catch (error) {
         console.log("error" + error )
             res.status(500).json({message: "Internal Server Error"})       
    }
}

//Contar cuentos elementos hay en la coleccion
pizzasController.countPizzas = async (req,res) => {
    try {
        
        const count = await pizzasModel.countDocuments();

        return res.status(200).json({count})



    } catch (error) {
         console.log("error" + error )
             res.status(500).json({message: "Internal Server Error"})       
    }

}

pizzasController.getPizzasByName = async (req,res) => {

    try {
        const {name} = req.body
        const pizzas = await pizzasModel.find({name: {$regex: name, $options: "i"}})            

        if(!pizzas) {          

            return res.status(404).json({message: "No pizzas found with this name"})
        }

        return res.status(200).json(pizzas)
        
    } catch (error) {
         console.log("error" + error )
             res.status(500).json({message: "Internal Server Error"})       
    }

}

export default pizzasController