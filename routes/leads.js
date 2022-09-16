import express from "express";
import { client } from "../index.js";
// import { auth } from "../middleware/auth.js"

const router = express.Router();

//get all leads
router.get("/",async (request,response)=>{
    const leads = await client.db("b37wd").collection("leads").find().toArray();
    response.send(leads);
})

//to insert lead to db
router.post("/",async(request,response)=>{
    const newlead = request.body;
    const result = await client.db("b37wd").collection("leads").insertOne(newlead)
    response.send(result)
})

//to update a lead
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updatelead = request.body;
    const result = await client.db("b37wd").collection("leads").updateOne({ id: id }, { $set: updatelead })
    response.send(result)

})
//delete a lead
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("b37wd").collection("leads").deleteOne({id: id})
    response.send(result)
})

export const leadsRouter = router;