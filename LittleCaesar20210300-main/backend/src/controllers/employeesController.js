//Pirmero creamos el array de funciones
const employeeController = {}

//Importamos el Schema a utilizar
import employeesModel from "../models/employees.js"

//metodo Select
employeeController.getEmployees = async(req, res) => {
    //Usamos try para la o las validaciones, en este caso siendo una en caso de no aparecer los datos insertados previamente en la base
    try {
        const employee = await employeesModel.find()
        res.json(employee)
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
}

//Update
employeeController.updateEmployee = async(req, res) => {
    try {
        let {name, lastName, DUI, birthDate, email, password, isVerified, status, idBranches} = req.body
        
        //VALIDADCIONES
        //Sanitizar
        name = name?.trim()
        email = email?.trim()
        passord = password?.trim()

        //campos requiridos
        if(!name || !email || !password){
            return res.status(400).json({message: "Field required"})
        }

        //Longuitud de caracteres
        if(name.length < 3 || name.length > 20){
            return res.status(400).json({message: "name lust be real"})
        }

        //Validacion de fecha
        if(birthDate > new Date || birthDate < new Date("1910-01-01")){
            return res.status(400).json({message: "Invalid date"})
        }

        //DUI
        if(DUI.length > 10 || DUI.length < 9){
            return res.status(400).json({message: "Invalid DUI"})
        }

        const employeeUpdated = await employeesModel.findByIdAndUpdate(req.params.id,
            {
                name,
                lastName,
                DUI,
                birthDate,
                email,
                password,
                isVerified,
                status,
                idBranches,
            }, {new: true}
        )

        if(!employeeUpdated){
            return res.status(404).json({message: "Employee not found"})
        }

        return res.status(404).json({message: "Employee updated"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server error"})
    }
}

//Delete
employeeController.deleteEmployee = async(req, res) => {
    try {
        const deleteEmployee = await employeesModel.findByIdAndDelete(req.params.id)

        //Validacion: si no se elimina
        if(!deleteEmployee){
            return res.status(404).json({messgae: "Employe e not found"})
        }
        
        return res.status(200).json({message: "Employee delete"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default employeeController;