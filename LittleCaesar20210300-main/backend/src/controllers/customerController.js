const customerController = {}

import customerModel from "../models/customers.js"

customerController.getCustomers = async(req, res) => {
    try {
        const customers = await customerModel.find()
        return res.status(200).json(customers)
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

customerController.putCustomers = async(req, res) => {
    try {
        //Solicitar los datos nuevos
        let {
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified
        } = req.body
        //Validaciones
        //Sanitizar
        name = name?.trim()
        email = email?.trim()

        //Validaciones
        if(!name || !email || !password){
            return res.status(400).json({message: "Fields required"})
        }

        if(name.length < 3 || name.length > 15){
            return res.status(400).json({message: "Please insert a valid name"})
        }

        //Actuzalizamos en la base de datos
        const putCustomers = await customerModel.findByIdAndUpdate(req.params.id,
            {
                name,
                lastName,
                birthdate,
                email,
                password,
                isVerified,
            },{new: true},
        )

        if(!putCustomers){
            return res.status(404).json({message: "Customer not found"})
        }

        return res.status(200).json({message: "Customer updated"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//Eliminar

customerController.deleteCustomer = async(req, res) => {
    try {
        const deleteCustomer = customerModel.findByIdAndDelete(req.params.id)

        if(!deleteCustomer){
            return res.status(404).json({message: "Customer not found"})
        }

        return res.status(200).json({message: "Customer deleted"})

    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default customerController