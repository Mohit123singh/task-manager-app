const express=require('express');
const mongoose=require('./db/mongoose1');
const userRouter=require('./routers/user');
const taskRouter=require('./routers/task');
const auth=require('./middleware/auth')
const app=express();
const multer=require('multer');

const port=process.env.PORT;

//Express Middleware::::

// Without middleware : new request -> run router handler

// With middleware : new request -> do something -> run router handler

// app.use((req,res,next)=>{

//     // console.log(req.method,req.path);
    
//     if(req.method==='GET')
//     {
//         res.send('GET requests are disabled!');
//     }
//     else
//     {
//         next();
//     }
// });

// app.use((req,res,next)=>{
//     res.status(503).send('Site is currently down. Check back soon!');
// })








//It automatically parse the income json into object.
 app.use(express.json());

//  const router=new express.Router();

//  router.get('/test',(req,res)=>{
//      res.send('This is from my other router');
//  })

//  app.use(router);

 app.use(userRouter);

 app.use(taskRouter);
 


app.listen(port,()=>{
    console.log(`Server is up on port  ${port}`);
});



// Bcrypt:

// const bcrypt=require('bcryptjs');

// const myFunction=async()=>{

//     //plain-text-password
//     const password='Red12345!';
    
//     const hashedPassword=await bcrypt.hash(password,8);
//     // console.log(password);
//     // console.log(hashedPassword);

//     //check a given password matches with the password stored in the database:

//     const isMatch=await bcrypt.compare('red12345',hashedPassword);
    
//     //console.log(isMatch);

// }
//myFunction();

//JWT tokens::
const jwt=require('jsonwebtoken');

const myFunction=async()=>
{
    // const token=await jwt.sign({_id:'123abc@'},'thisismynewcourse',{expiresIn:'7 days'});
    // console.log(token);

    // const data=await jwt.verify(token,'thisismynewcourse');
    // console.log(data);
}
//myFunction();

//toJSON

// The toJSON method is a special property on objects. 
// It is called when you call JSON.stringify() on that object. 
// Whatever the toJSON method returns is what will be returned from calling JSON.stringify() 
// on that object.

// const pet={
//     name:"Bablu",
// }
// //  console.log(JSON.stringify(pet));

// pet.toJSON=function(){
//     //console.log(this);
//     return this;
// }



// console.log(JSON.stringify(pet));


const Task=require('./models/task');
const User=require('./models/user');

//In MongoDB, Population is the process of replacing the specified path in the document of 
//one collection with the actual document from the other collection.

//Need of Population: Whenever in the schema of one collection we provide a reference 
//(in any field) to a document from any other collection, we need a populate() method 
//to fill the field with that document.

// //populate() function in mongoose is used for populating the data inside the reference. 

const main=async ()=>{

    // const task=await Task.findById('611e7a18f6b9c82f7fc85363');
    // await task.populate('owner').execPopulate();
    // // console.log(task.owner);

    // const user=await User.findById('611e77528d18ad2a1289bd74');
    // await user.populate('tasks').execPopulate();
    // console.log(user.tasks);

}

// main();

//Upload a file :

// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000,
//     },
//     fileFilter(req,file,cb){

//         cb(new Error('File must be a PDF'));
//         cb(undefined,true);
//         cb(undefined,false);

//         if(!file.originalname.endsWith('.pdf'))
//         {
//             return cb(new Error('File must be a PDF'));
//         }

//         if(!file.originalname.match(/\.(doc|docx)$/))
//         {
//             return cb(new Error('File must be a word document'));
//         }

//         cb(undefined,true);

//     }
    
// });

// const errorMiddleware=(req,res,next)=>{
//     throw new Error('From error midlleware');
// };

// app.post('/upload',errorMiddleware,(req,res)=>{

//     res.status(200).send();

// },(error,req,res,next)=>{
//     res.status(404).send(error.message);
// });

// app.post('/upload',upload.single('upload'),(req,res)=>{

//     res.status(200).send();

// },(error,req,res,next)=>{
//     res.status(404).send({Error:error.message});
// })


