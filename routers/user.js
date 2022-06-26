const express = require('express')
const router = new express.Router()
const User = require('../model/user')
const auth = require('../middleware/auth')

//signup
router.post('/user',async(req,res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken(); 
        res.status(201).send({user, token})
    }
    catch (e){
        res.status(400).send(e)
    }
})


router.get('/usersdetail',auth,async(req,res) =>{
    try{
        const user = await User.find({},{firstname:1,_id:0,lastname:1})
        res.status(201).send({user})
    }
    catch(e){
        res.status(404).send(e);
    }
})

router.get('/userlist',auth,async(req,res) => {
    try{
        const user = await User.find({},{firstname:1,_id:0})
        res.status(201).send({user})
    }
    catch(e){
        res.status(404).send(e);
    }
})

router.post('/user/login',async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.username,req.body.password)
        const token  = await user.generateAuthToken()
        res.send({user:user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})
router.post('/user/logout', auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router;