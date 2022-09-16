import express from "express";
import { client } from "../index.js";
// import { auth } from "../middleware/auth.js"

const router = express.Router();

//get all service-requests
router.get("/",async (request,response)=>{
    const result = await client.db("b37wd").collection("service-requests").find().toArray();
    response.send(result);
})

//to insert a service-request to db
router.post("/",async(request,response)=>{
    const newServiceRequest = request.body;
    const result = await client.db("b37wd").collection("service-requests").insertOne(newServiceRequest)
    response.send(result)
})

//to update a service-request
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateServiceRequest = request.body;
    const result = await client.db("b37wd").collection("service-requests").updateOne({ id: id }, { $set: updateServiceRequest })
    response.send(result)

})
//delete a service-request
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("b37wd").collection("service-requests").deleteOne({id: id})
    response.send(result)
})

export const serviceRequestsRouter = router;