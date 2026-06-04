const mongoose=require("mongoose");
const Chat=require("./models/chat.js");
main()
.then(()=>{
    console.log("connection success");
})
.catch((err)=>console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}
let allchats=[
    {
        from:"neha",
        to:"priya",
        msg:"sent me notes from the exam",
        created_at:new Date(),
    },
    {
        from:"aliya",
        to:"riya",
        msg:"sent me 100RS quickly",
        created_at:new Date(),
    },
    {
        from:"jara",
        to:"puja",
        msg:"what is the date of exam",
        created_at:new Date(),
    },
    {
        from:"rohit",
        to:"raju",
        msg:"after exam we will go to a trip",
        created_at:new Date(),
    },
];
Chat.insertMany(allchats);