const dotenv  = require('dotenv');
dotenv.config();

const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const Chat=require("./models/chat.js");

const dns = require('dns');
// Force Node to use known public DNS servers for SRV lookups (fixes c-ares ECONNREFUSED on some networks)
dns.setServers(['8.8.8.8', '1.1.1.1']);



console.log(process.env.MONGO_URI);

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/whatsapp";

const methodOverride=require("method-override");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main()
.then(()=>{
    console.log("connection success");
})
.catch((err)=>console.log(err));

async function main() {
    await mongoose.connect(MONGO_URI);
}


//index route
app.get("/",async(req,res)=>{
    try {
        let chats=await Chat.find();
        console.log(chats);
        res.render("index.ejs",{chats});
    } catch(err) {
        console.log(err);
        res.redirect("/");
    }
});

// alias route for redirects
app.get("/chats",async(req,res)=>{
    try {
        let chats=await Chat.find();
        res.render("index.ejs",{chats});
    } catch(err) {
        console.log(err);
        res.redirect("/");
    }
});

//new route
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
});

//created route
app.post("/chats",async(req,res)=>{
    let {from,to,msg}=req.body;
    let newchat=new Chat({
        from:from,
        to:to,
        msg:msg,
        created_at:new Date(),
    });
    try {
        await newchat.save();
        console.log("chat was saved");
        res.redirect("/chats");
    } catch(err){
        console.log(err);
        res.redirect("/chats");
    }
});

//edit route
app.get("/chats/:id/edit",async(req,res)=>{
    try {
        let {id}=req.params;
        let mychat=await Chat.findById(id);
        res.render("edit.ejs",{chat:mychat});
    } catch(err) {
        console.log(err);
        res.redirect("/chats");
    }
});

//updated route
app.put("/chats/:id",async(req,res)=>{
    try {
        let {id}=req.params;
        let {msg:newmsg}=req.body;
        console.log(newmsg);
        let updatedchat=await Chat.findByIdAndUpdate(id,{msg:newmsg},
            {runValidators:true,new:true}
        );
        console.log(updatedchat);
        res.redirect("/chats");
    } catch(err) {
        console.log(err);
        res.redirect("/chats");
    }
});

//delete route
app.delete("/chats/:id",async(req,res)=>{
    try {
        let {id}=req.params;
        let deletechat=await Chat.findByIdAndDelete(id);
        console.log(deletechat);
        res.redirect("/chats");
    } catch(err) {
        console.log(err);
        res.redirect("/chats");
    }
});

app.listen(PORT,()=>{
    console.log("app is listenning to port 8080");
});