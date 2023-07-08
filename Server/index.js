import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import Users from "./models/users.js";


const app = express();
dotenv.config();

app.use(morgan("dev"));
app.use(express.json());

//get data
app.get("/",(req,res)=>{
    res.send("connection established")
})

//create data
app.post("/register",async (req,res)=>{
   try{
    const {userName, Email, Number, Password} = req.body;

    if(!userName) return res.send("Username is required")
    if(!Email) return res.send("Username is required")
    if(!Number) return res.send("Username is required")
    if(!Password) return res.send("Username is required")

    const anotherUser = new Users({
        name:userName,
        email:Email,
        number:Number,
        password:Password
    })

    await anotherUser.save()

    return res.send("Registration Done")
   }
   catch(error){
    res.send(error)
   }
})

//updtate user
app.put('/update/:id', async(req,res)=>{
   try{
    const {id} = req.params;

    if(!id) return res.send("Id is required");

    const{Name,Number} = req.body
    if(!Name && !Number) return res.send("Data is required")

    //search user from mongoDB
    const response = await Users.find({id}).exec();
    if(!response.length) return res.send("User not found.");

    await Users.findByIdAndUpdate({id}, {name:Name, number:Number});
    return res.send("User updated");
    

   }catch(error){
    res.send(error)
   }

})

//delect
app.delete("/delect/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        if(!id) return res.send("Id is required");
        await Users.findByIdAndDelete(id);
        return res.send("User is Removed");
    }catch(error){
        return res.send(error)
    }
})

//create MongoDB conncection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(`Database Error ${error}`));

//create Port
app.listen(process.env.PORT, () => {
  console.log(`Working on Port ${process.env.PORT}`);
});
