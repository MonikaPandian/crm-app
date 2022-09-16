import express from "express";
import { client } from "../index.js";
// import { auth } from "../middleware/auth.js"

const router = express.Router();

//get all contacts
router.get("/",async (request,response)=>{
    const result = await client.db("b37wd").collection("contacts").find().toArray();
    response.send(result);
})

//to insert a contact to db
router.post("/",async(request,response)=>{
    const newContact = request.body;
    const result = await client.db("b37wd").collection("contacts").insertOne(newContact)
    response.send(result)
})

//to update a contact
router.put("/:id", async(request,response) => {
    const { id } = request.params;
    const updateContact = request.body;
    const result = await client.db("b37wd").collection("contacts").updateOne({ id: id }, { $set: updateContact })
    response.send(result)

})
//delete a contact
router.delete("/:id",async(request,response)=>{
    const { id } = request.params;
    const result = await client.db("b37wd").collection("contacts").deleteOne({id: id})
    response.send(result)
})

export const contactsRouter = router;
