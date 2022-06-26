const mongoose=require('mongoose')
const validator=require('validator')
const jwt = require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const Product=require('../model/product')

const userSchema= new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
    },
    tokens: [{
        token : {
            type: String,
            required:true
        }
    }]
}, {timestamp:true})


userSchema.virtual('products', {
    ref:'Product',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id:user._id.toString()},'thisismycourse')

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


userSchema.statics.findByCredentials = async (username,password) => {
    const user = await User.findOne({username})
    if(!user){
        throw new Error("Unable to log in")
    }   
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error("Unable to log in")
    }
    return user
}

//hashing the plain text password before saving 
userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next() // this will terminate the function
})


const User = mongoose.model('User',userSchema)

module.exports = User