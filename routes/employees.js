import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "../index.js";
import NodeMailer from 'nodemailer'; 
import { ObjectId } from "mongodb";

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

//forgot-password send-email
router.post("/send-email", async(request,response)=>{
    const { username } = request.body;

    //Make sure user exists in database
    const employeeFromDB = await client.db("b37wd").collection("employees").findOne({ username : username})
   
    if(!employeeFromDB){
        response.status(400).send( { message : "Enter a valid and registered email Id"})
        return;
    }
    //User exist and now create a one time link valid for 15 minutes
    const secret = process.env.SECRET_KEY + employeeFromDB.password;
    const payload = {
        email : employeeFromDB.username,
        id : employeeFromDB._id
    }

    const token = jwt.sign(payload, secret, {expiresIn: '15m'})
    const link = `http://localhost:3000/employees/reset-password/${employeeFromDB._id}/${token}`;

    var transporter = NodeMailer.createTransport({
        service : 'gmail',
        auth:{
            user:'panmonikmm@gmail.com',
            pass:'lxkugchepioxgtmr'
        }
    });

    var mailOptions = {
        from : 'panmonikmm@gmail.com',
        to : `${employeeFromDB.username}`,
        subject:'CRM Application Password reset link',
        html:`We have received your request for reset password. Click this link to reset your password.<br>
              <a href = ${link}>Click Here</a><br>
              <p>This link is valid for 15 minutes from your request initiation for password recovery.</p>`
    };

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }
        else{
            console.log('Email sent:'+ info.response);
        }
    })

    response.send('Success Password reset link has been sent to your mail');
})

router.post("/reset-password/:id/:token",async(request,response)=>{
   const { id, token } = request.params;
   console.log(id)

   //check if this id exist in database
   const employeeFromDB = await client.db("b37wd").collection("employees").findOne({ _id: ObjectId(id) })
   console.log(employeeFromDB)
   
   if(!employeeFromDB){
    response.status(400).send( { message : "Enter a valid and registered email Id"})
    return;
    }

    response.send("success")
})

export const employeesRouter = router;