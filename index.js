const express=require('express')
require('./mongoose')
const productRouter = require('./routers/product')
const userRouter=require('./routers/user')




const app = express()
const port = process.env.PORT

app.use(express.json())

app.use(productRouter)
app.use(userRouter)



app.listen(port,()=>{
    console.log("app is running on port "+port);
})