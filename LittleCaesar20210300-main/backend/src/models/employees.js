import mongoose, {Schema, model} from "mongoose";

const employeeSchema = new Schema({
    name: { 
        type: String
    },

    lastName: { 
        type: String
    },

    DUI: {
        type: String 
    },

    birthDate: {
        type: Date
    },

    email: {
        type: String
    },

    password: {
        type: String
    },

    isVerified: {
        type: Boolean
    },

    status: {
        type: String
    },

    //Referencia al otro Schema para el ID
    idBranches: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: "Braches"
    }
},{
    timestamps: true,
    strict: false
});

export default model("Employees", employeeSchema);