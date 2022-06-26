const express = require('express')
const router = new express.Router()
const Product = require('../model/product')
const auth=require('../middleware/auth')

//upload a new peoduct
router.post('/product',auth,async (req,res) => {
    const prod = new Product({...req.body})

    try{
        await prod.save()
        res.status(201).send(prod)
    }
    catch(e){
        res.status(400).send(e)
    }
})

//get list of all the products
router.get('/productlist',auth,async(req,res) =>{
    try{
        const products = await Product.find({},{_id:0})
        res.status(201).send(products);
    }
    catch(e){
        res.status(404).send(e)
    }
})

module.exports=router;