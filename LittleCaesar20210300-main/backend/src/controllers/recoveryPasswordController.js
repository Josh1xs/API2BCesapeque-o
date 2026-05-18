import nodemailer from "nodemailer" //Enviar correos
import crypto from "crypto" //Generar codigos aleatorios
import jsonwebtoken from "jsonwebtoken" //Token
import bcryptjs from "bcryptjs" //Encriptar contraseña
import HTMLRecoveryEmail from "../utils/sendMailRecovery.js"

import {config} from "../../config.js"

import customerModel from "../models/customers.js"


//array de funciones (siempre)
const recoveryPassswordController = {}

recoveryPassswordController.requestCode = async (req, res) => {
    try {
        //1. Solicitamos el correo
        const {email} = req.body

        //Validar que el correo si exsita en la db
        const userFound = await customerModel.findOne({email})

        if(!userFound){
            return res.status(404).json({mesage: "User not found"})
        }

        //Generamos un codigo aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex")

        //Guardamos todo en un token
        const token = jsonwebtoken.sign(
            //1. que vamos a guardar
            {email, randomCode, userType: "customer", verified: "false"},
            //2. Secret Key
            config.JWT.secret,
            //3. cuando expira
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", token, {maxAge: 15 * 60 * 1000})

        //Enviar el codigo por correo electronico
        //1. Quien lo envia
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password
            }
        })

        //#2- ¿Quien lo recibe y como lo recibe?
        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Recuperacion de contraseña",
            body: "El codigo vence en 15 minutos",
            html: HTMLRecoveryEmail(randomCode),
        };

        //3. enviar  correo
        transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.log("error"+error)
                return res.status(500).json({message: "Error sending email"})
            }
            return res.status(200).json({message: "email sent"})
        })
    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

recoveryPassswordController.verifyCode = async (req, res) => {
    try {
        //1. Solicitamps los datos
        const { code } = req.body

        //Obtenemos la informaicon que esta dentro del token
        //Accedemos a la cookie
        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token,config.JWT.secret)

        //Ahora vamos a comparar el codigo que el usuario escribio
        //con el que esta guardado en el token
        if(code !== decoded.randomCode){
            return res.status(400).json({message: "Invalid Code"})
        }

        //En cambio, si escribe bien el codigo
        //vamos a colocar en el token que ya esta verificado
        const newToken = jsonwebtoken.sign(
            //1. Que vamos a guardar
            {email: decoded.email, userType: "customer", verified: true},

            //2.Secret key
            config.JWT.secret,
            //3. Cuando expira
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", newToken,{maxAge: 15 * 60 * 1000})

        return res.status(200).json({message: "Code verified seccessfully"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

recoveryPassswordController.newPassword = async (req, res) => {
    try {
        const {newPassword, confirNewPassword} = req.body

        //comparo las 2 contraseñas
        if(newPassword !== confirNewPassword){
            return res.status(400).json({message: "Password doesn't match"})
        }

        //Vamos a comprobar que la contante verified que esta en el token
        //ya sea true
        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
    
        if(!decoded.verified){
            return res.status(400).json({message: "Code not verified"})
        }

        //Encriptar
        const passwordHash = await bcryptjs.hash(newPassword, 10)

        //Actualizar la contraseña en la base de datos
        await customerModel.findOneAndUpdate(
            {email: decoded.email},
            {password: passwordHash},
            {new: true}
        )

        res.clearCookie("recoveryCookie")

        return res.status(200).json({message: "Password updated"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server error"})
    }
}

export default recoveryPassswordController;