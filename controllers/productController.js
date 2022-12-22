const express = require('express')
const controller = express.Router()
const productSchema = require('../schemas/productSchema')

// http://localhost:5000/api/products/
controller.route('/').get(async (req, res) => {
    const products = []
    const list = await productSchema.find()
    if (list) {
        for (let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})
.post(async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body
    const product_exists = await productSchema.findOne({ name })

    if (!name || !price)
        if (!name)
            res.status(400).json({ text: 'Name is required.' })
        else if (!price)
            res.status(400).json({ text: 'Price is required.' })

    if (product_exists)
        res.status(409).json({ text: 'A Product with that name already exists' })
    else {
        const product = await productSchema.create({
            tag,
            name,
            category,
            description,
            price,
            imageName,
            rating
        })
        if (product)
            res.status(201).json({ text: `Product (Article number: ${product._id}) was successfully created.` })
        else
            res.status(400).json({ text: 'Something went wrong when trying to create the product' })
    }
})

// http://localhost:5000/api/products/{tag}
controller.route("/:tag").get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag })
    if (list) {
        for (let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})

// http://localhost:5000/api/products/{tag}/{take}
controller.route("/:tag/:take").get(async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag }).limit(req.params.take)
    if (list) {
        for (let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})

// http://localhost:5000/api/products/{articleNumber}
controller.route('/product/details/:articleNumber').get(async (req, res) => {
    const product = await productSchema.findById(req.params.articleNumber)
    if (product) {
        res.status(200).json({
            articleNumber: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            tag: product.tag,
            imageName: product.imageName,
            rating: product.rating
        })
    } else
        res.status(404).json()
})

//Update data
controller.route('/:articleNumber').put(async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body

    if (req.params.articleNumber) {
        const product = await productSchema.findByIdAndUpdate(req.params.articleNumber, {
            name: req.body.name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })
        if (product)
            res.status(201).json({ text: `Product (Article number: ${product._id}) was successfully updated` })
        else
            res.status(400).json({ text: 'Something went wrong when trying to update the product' })
    } else
        res.status(404).json({ text: `Product (Article number: ${product._id}) was not found` })
})
.delete(async (req, res) => {
    if (!req.params.articleNumber)
        res.status(400).json('No article number was specified')
    else {
        const product = await productSchema.findById(req.params.articleNumber)
        if (product) {
            await productSchema.remove(product)
            res.status(200).json({ text: `Product (Article number: ${product._id}) was successfully deleted` })
        } else
            res.status(404).json({ text: `Product (Article number: ${product._id}) was not found` })
    }
})

module.exports = controller