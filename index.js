import express, { urlencoded } from 'express'
import path from 'path'
import mongoose from 'mongoose'
import  cookieParser from 'cookie-parser'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"backend76"
}).then(()=>{console.log("Database Connected")}).catch((e)=>{console.log(e)})

const userSchema = new mongoose.Schema({
    name:"string",
    password:"string",
    email:"string"
})

const User = mongoose.model("User",userSchema)

const app = express()

// Middlewares
app.use(express.static(path.join(path.resolve(),"public")))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.set("view engine","ejs")

const isAuthenticated = async(req,res,next)=>{

    const {token} = req.cookies

    if(token){
        const decodedData = jwt.verify(token,"hskjgdegbfeufiune")
        req.user = await User.findById(decodedData._id)
        
        next()
    }
    else{
        res.render("login")

    }
}

app.get('/',isAuthenticated,(req,res)=>{
    // console.log(req.cookies.token)

    const{name}=req.user
    res.render("logout",{name})

})

app.get('/register',(req,res)=>{
    res.render("register")
})




app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly:true,
        expires:new Date(Date.now())
    })
    res.redirect("/")

})

app.post("/register",async(req,res)=>{
    const {name,password,email} = req.body

    let user = await User.findOne({email})
    if(user){
       return res.redirect('/login')
    }
    const hasedPassword = await bcrypt.hash(password,10)
    user = await User.create({name,password:hasedPassword,email})

    const token = jwt.sign({_id:user._id},"hskjgdegbfeufiune")
    res.cookie("token",token,{
        httpOnly:true,expires:new Date(Date.now()+ 60*1000)
    })
    res.redirect("/")
})

app.post('/login',async(req,res)=>{
    const {password,email} = req.body

    let user = await User.findOne({email})
   if(!user){
    return res.redirect('/register')
   }

   const isMatch = await bcrypt.compare(password,user.password)
   if(!isMatch){
    return res.render('login',{email,message:"Incorrect Password"})
   }

   const token = jwt.sign({_id:user._id},"hskjgdegbfeufiune")
   res.cookie("token",token,{
       httpOnly:true,expires:new Date(Date.now()+ 60*1000)
   })
   res.redirect("/")
})



// res.render is used to render dynamic files like ejs not Html , css 
// app.use is used to use the middleware and express.static is a middleware 
app.listen(3000,()=>{
    console.log("Server Connected Successfully")
})