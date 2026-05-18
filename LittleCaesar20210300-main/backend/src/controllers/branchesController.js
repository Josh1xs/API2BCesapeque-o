const branchesController = {};
import branchesModel from "../models/branches.js";


branchesController.getBranches = async (req, res) => {
    const branches = await branchesModel.find();
    res.json(branches);
};

branchesController.insertBranch = async (req, res) => {
    //Paso 1: Solicitar los datos que se guardaran
    const {name, address, schedule, isActive} = req.body;
    //Paso 2: Guardo en el model
    const newBranch = new branchesModel({
        name,
        address,
        schedule,
        isActive
    });
    //Paso 3: Guardar todo en la base de datos
    await newBranch.save();
    res.json({message: "Sucursal insertada correctamente"});
};

branchesController.updateBranch = async (req, res) => {
    //Paso 1: pido los nuevos valores
    const {name, address, schedule, isActive} = req.body;
    await branchesModel.findByIdAndUpdate(req.params.id, { 
        name, 
        address, 
        schedule, 
        isActive }, {new: true});
    res.json({message: "Sucursal actualizada correctamente"});
};

branchesController.deleteBranch = async (req, res) => {
    await branchesModel.findByIdAndDelete(req.params.id);
    res.json({message: "Sucursal eliminada correctamente"});
}

export default branchesController