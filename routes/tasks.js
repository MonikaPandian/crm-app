import express from "express";
import { client } from "../index.js";
// import { auth } from "../middleware/auth.js"

const router = express.Router();

//get all tasks
router.get("/",async (request,response)=>{
    const result = await client.db("b37wd").collection("tasks").find().toArray();
    response.send(result);
})

//to insert a task to db
router.post("/",async(request,response)=>{
    const newtask = request.body;
    const result = await client.db("b37wd").collection("tasks").insertOne(newtask)
    response.send(result)
})

//to update a task
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updatetask = request.body;
    const result = await client.db("b37wd").collection("tasks").updateOne({ id: id }, { $set: updatetask })
    response.send(result)

})
//delete a task
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("b37wd").collection("tasks").deleteOne({id: id})
    response.send(result)
})

export const tasksRouter = router;
