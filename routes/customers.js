import express from "express";
import { client } from "../index.js";
// import { auth } from "../middleware/auth.js"

const router = express.Router();

//get all customers
router.get("/",async (request,response)=>{
    const customers = await client.db("b37wd").collection("customers").find().toArray();
    response.send(customers);
})

//to get a customer
router.get("/:id",async (request,response)=>{
    const { id } = request.params;
    const result = await client.db("b37wd").collection("customers").findOne({ id: +id })
    response.send(result);
})

//to insert customer to db
router.post("/",async(request,response)=>{
    const newCustomer = request.body;
    const result = await client.db("b37wd").collection("customers").insertOne(newCustomer)
    response.send(result)
})

//to update a customer
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateCustomer = request.body;
    const result = await client.db("b37wd").collection("customers").updateOne({ id: +id }, { $set: updateCustomer })
    response.send(result)

})
//delete a customer
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("b37wd").collection("customers").deleteOne({id: id})
    response.send(result)
})

export const customersRouter = router;