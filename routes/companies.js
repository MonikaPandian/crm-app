import express from "express";
import { client } from "../index.js";
// import { auth } from "../middleware/auth.js"

const router = express.Router();

//get all companies
router.get("/",async (request,response)=>{
    const companies = await client.db("b37wd").collection("companies").find().toArray();
    response.send(companies);
})

//to insert company to db
router.post("/",async(request,response)=>{
    const newCompany = request.body;
    const result = await client.db("b37wd").collection("companies").insertOne(newCompany)
    response.send(result)
})

//to update a company
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateCompany = request.body;
    const result = await client.db("b37wd").collection("companies").updateOne({ id: id }, { $set: updateCompany })
    response.send(result)

})
//delete a company
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("b37wd").collection("companies").deleteOne({id: id})
    response.send(result)
})

export const companiesRouter = router;