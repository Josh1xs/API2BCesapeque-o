import express from "express"
import recoveryPassswordController from "../controllers/recoveryPasswordController.js"

const router = express.Router();

router.route("/requestCode").post(recoveryPassswordController.requestCode)
router.route("/verifyCode").post(recoveryPassswordController.verifyCode)
router.route("/newPassword").post(recoveryPassswordController.newPassword)

export default router