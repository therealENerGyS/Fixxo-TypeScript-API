const express = require('express')
const controller = express.Router()
let products = require('../data/database')
const productSchema = require('../schemas/productSchema')

const ProductSchema = require('../schemas/productSchema')

controller.param("articleNumber", (req, res, next, articleNumber) => {
    req.product = products.find(product => product.articleNumber == articleNumber)
    next()
})
controller.param("tag", (req, res, next, tag) => {
    req.products = products.filter(x => x.tag == tag)
    next()
})

// POST - CREATE - SKAPA EN ANVÄNDARE - http://localhost:5000/api/products

controller.route('/')
    .post((req, res) => {
        let product = {
            articleNumber: (products[products.length - 1])?.articleNumber > 0 ? (products[products.length - 1])?.articleNumber + 1 : 1,
            category: req.body.category,
            imageName: req.body.imageName,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        }
        products.push(product)
        res.status(201).json(product)
    })
    .get(async (req, res) => {
        const products = []
        const list = await ProductSchema.find()
        if (list) {
            for(let product of list) {
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

controller.route("/:tag").get(async (req, res) => {
    const list = await ProductSchema.find({ tag: req.params.tag })
    if (list) {
        for(let product of list) {
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

// http://localhost:5000/api/products/featured/2
controller.route("/:tag/:take").get(async (req, res) => {
    const products = []
    const list = await ProductSchema.find({ tag: req.params.tag }).limit(req.params.take)
    if (list) {
        for(let product of list) {
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

// http://localhost:5000/api/products/1
controller.route('/product/details/:articleNumber')
    .get(async (req, res) => {
        const product = await ProductSchema.findById(req.params.articleNumber)
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
     .put((req, res) => {
        if (req.product != undefined) {
            products.forEach(product => {
                if (product.articleNumber == req.product.id) {
                    product.name = req.body.name ? req.body.name : product.name
                    product.imageUrl = req.body.imageUrl ? req.body.imageUrl : product.imageUrl
                    product.description = req.body.description ? req.body.description : product.description
                    product.category = req.body.category ? req.body.category : product.category
                    product.price = req.body.price ? req.body.price : product.price
                }
            })
            res.status(200).json(req.product)
        }
        else
            res.status(404).json()
    })
    .delete((req, res) => {
        if (req.product != undefined) {
            products = products.filter(product => product.id !== req.product.id)
            res.status(204).json()
        }
        else
            res.status(404).json()
    })


controller.route('/').post(async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body

    if (!name || !price) 
        res.status(400).json({text: 'Name and Price is required.'})
    
    const product_exists = await ProductSchema.findOne({name})

    if (product_exists)
        res.status(409).json({text: 'A Product with that name already exists'})
    else {
        const product = await ProductSchema.create({
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })
        if (product)
            res.status(201).json({text: `Product with article number ${product._id} creation was successful.`})
        else
            res.status(400).json({text: 'Something went wrong when trying to create the product'})
    }
})
//Update data
controller.route('/:articleNumber').put(async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body
    const product_exists = await ProductSchema.findOne({name})

    if (!name || !price) 
        res.status(400).json({text: 'Name and Price is required.'})
    
    if (product_exists) {
            const product = await ProductSchema.updateOne({
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })
        if (product)
            res.status(201).json({text: `Product with article number ${product._id} was successfully update`})
        else
            res.status(400).json({text: 'Something went wrong when trying to update the product'})
    } else
        res.status(404).json({text: `Product with article number ${product._id} was not found`})
})

controller.route('/:articleNumber').delete(async (req, res) => {
    if(!req.params.articleNumber)
        res.status(400).json('No article number was specified')
    else {
        const product = await ProductSchema.findById(req-params.articleNumber)
        if (product) {
            await ProductSchema.remove(product)
            res.status(200).json({text: `Product with article nubmer ${req.params.articleNumber} was successfully deleted`})
        } else
            res.status(404).json({text: `Product with article number ${req.params.articleNumber} was not found`})
    }
})

module.exports = controller