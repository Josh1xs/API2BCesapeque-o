import express from "express";
import branchesController from "../controllers/branchesController.js";

//Router() nos ayuda a colocar los metodos que tendrá el endpoint

const router = express.Router();

router.route("/")
.get(branchesController.getBranches)
.post(branchesController.insertBranch)

router.route("/:id")
.put(branchesController.updateBranch)
.delete(branchesController.deleteBranch)

export default router;