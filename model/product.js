const mongoose=require('mongoose')
const validator=require('validator')
const User = require('./user')
const bcrypt=require('bcrypt')

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    description:{
        type:String,
        trim:false
    },

    quantity:{
        type:Number,
        default:1,
        validate(value){
            if(value<0){
                throw new Error('quantity must be a positive number')
            }
        }
    },
    price:{
        type:Number,
        validate(value){
            if(value<0){
                throw new Error('price must be a positive number')
            }
        }
    }
}, {timestamp:true})

const Product = mongoose.model('Product',productSchema)

module.exports = Product