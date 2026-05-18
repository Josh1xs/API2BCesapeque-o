import express from "express";
import pizzasController from "../controllers/pizzasController.js";

//Router() nos ayuda a colocar los metodos que tendrá el endpoint

const router = express.Router();

router.route("/")
.get(pizzasController.getPizzas)
.post(pizzasController.insertPizza)

router.route("/:id")
.put(pizzasController.updatePizza)
.delete(pizzasController.deletePizza)

export default router;