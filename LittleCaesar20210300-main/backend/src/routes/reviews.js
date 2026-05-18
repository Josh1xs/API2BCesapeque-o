import express from "express"
import reviewController from "../controllers/reviewsController.js"

const router = express.Router()

router.route("/")
.get(reviewController.getReviews)
.post(reviewController.insertReview)

router.route("/:id")
.put(reviewController.updatedReview)
.delete(reviewController.deleteReview)

export default router