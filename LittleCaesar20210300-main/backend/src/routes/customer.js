import express, { Router } from "express"
import customerController  from "../controllers/customerController.js"

const router = express.Router()

router.route("/")
.get(customerController.getCustomers)

router.route("/:id")
.put(customerController.putCustomers)
.delete(customerController.deleteCustomer)

export default router;