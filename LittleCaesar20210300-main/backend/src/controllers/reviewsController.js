const reviewsController = {}

import reviewsModel from "../models/reviews.js"

reviewsController.getReviews = async(req, res) => {
    try {
        const reviews = await reviewsModel.find()
        res.json(reviews)

    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server error"})
    }
}

reviewsController.insertReview = async (req, res) => {
    try {
        let {
            idEmployee,
            idPizza,
            rating,
            comment
        } = req.body

        if(!idEmployee || !idPizza || !rating){
            return res.status(400).json({message: "Field required"})
        }

        if(comment.length < 3 || comment.length > 500){
            return res.status(400).json({message: "Short or long comment"})
        }

        const newReview = new reviewsModel({
            idEmployee,
            idPizza,
            rating,
            comment
        })

        await newReview.save()
        return res.status(201).json({message: "reseña ingresada correctamente"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server error"})
    }
}

reviewsController.updatedReview = async(req, res) => {
    try {
        let {
            idEmployee,
            idPizza,
            rating,
            comment
        } = req.body

        if(!idEmployee || !idPizza || !rating){
            return res.status(400).json({message: "Field required"})
        }

        if(comment.length > 3 || comment.length < 500){
            return res.status(400).json({message: "Short or long comment"})
        }

        const updatedReview = await reviewsModel.findByIdAndUpdate(req.params.id, {
            idEmployee,
            idPizza,
            rating,
            comment
        }, {new: true}
    )

    if(!updatedReview){
        return res.status(404).json({message: "Review not found"})
    }
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server error"})
    }
}

reviewsController.deleteReview = async(req, res) => {
    try {
        const deleteReview = await reviewsModel.findByIdAndDelete(req.params.id)

        if(!deleteReview){
            return res.status(404).json({message: "Review not found"})
        }
    } catch (error) {
        console.log("error" + erro)
        return res.status(500).json({message: "Internal Server error"})
    }
}

export default reviewsController