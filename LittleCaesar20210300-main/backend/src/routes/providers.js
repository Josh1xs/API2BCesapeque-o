import express from "express";
import providerController from "../controllers/providersController.js";
import upload from "../utils/cloudinaryConfig.js";

//Router() nos ayuda a colocar los metodos que tendrá el endpoint

const router = express.Router();

router.route("/")
.get(providerController.getProviders)
.post(upload.single("image"), providerController.insertProvider)

router.route("/:id")
.put(upload.single("image"), providerController.updateProvider)
.delete(providerController.deleteProvider)

export default router;