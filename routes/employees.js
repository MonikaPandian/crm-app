import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "../index.js";
import NodeMailer from 'nodemailer'; 

const router = express.Router();

//signup - to insert data to db
router.post("/signup",async (request, response) =>{
    const { username, firstName, lastName, password } = request.body;

    const isUserExist = await client.db("b37wd").collection("employees").findOne({ username : username})

    if(isUserExist){
        response.status(400).send({ message: "Username already taken"})
        return;
    }

    if(!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#%$]).{8,}$/g.test(password)){
        response.status(400).send({ message: "Password pattern does not match"})
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
    const result = await client.db("b37wd").collection("employees").insertOne({ username: username, firstName : firstName, lastName: lastName, password: hashedPassword});
    response.send(result)
})

//login 
router.post("/login", async(request,response)=>{
    const {username, firstName, lastName , password } = request.body;

    const employeeFromDB = await client.db("b37wd").collection("employees").findOne({ username : username})
    if(!employeeFromDB){
        response.status(400).send( { message : "Invalid credentials"})
        return;
    }

    const storedPassword = employeeFromDB.password;

    const isPasswordMatch = await bcrypt.compare(password, storedPassword)
    if(!isPasswordMatch){
        response.status(400).send( { message: "Invalid credentials"});
        return;
    }
    //issue token
    const token = jwt.sign({ id :employeeFromDB._id}, process.env.SECRET_KEY);
    response.send({ message : "Successful login", token : token});
})

router.post("/send-email", async(request,response)=>{
    const { username } = request.body;

    const employeeFromDB = await client.db("b37wd").collection("employees").findOne({ username : username})
    if(!employeeFromDB){
        response.status(400).send( { message : "Enter a valid and registered email Id"})
        return;
    }

    const otpCode = Math.floor((Math.random()*100000))
    //const otpData = {username:username, code:otpCode, expireIn: new Date().getTime() + 300*1000}

    var transporter = NodeMailer.createTransport({
        service : 'gmail',
        auth:{
            user:'panmonikmm@gmail.com',
            pass:'lxkugchepioxgtmr'
        }
    });

    var mailOptions = {
        from : 'panmonikmm@gmail.com',
        to : 'monikapandian97@gmail.com',
        subject:'You have requested for password reset',
        text:`Enter the otp below to reset the password ${otpCode}`
    };

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }
        else{
            console.log('Email sent:'+ info.response);
        }
    })

    response.send({ message : "success",otp : otpCode });
})


export const employeesRouter = router;