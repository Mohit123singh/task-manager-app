const express=require('express');
const multer=require('multer');
const router=new express.Router();
const User=require('../models/user');
const auth=require('../middleware/auth');
const sharp=require('sharp');
const {sendWelcomeEmail}=require('../emails/account');
const {sendCancelEmail}=require('../emails/account');

//Users:::

 //Create:

 router.post('/users',async(req,res)=>{
    // console.log(req.body);
    // res.send('testing');
    // const user=new User(req.body);
    // user.save().then(()=>{
    //     res.status(201).send(user);
    // }).catch((error)=>{
    //     res.status(400).send(error);
    // })
    

     try {

        const user=new User(req.body);

         await user.save();

         sendWelcomeEmail(user.email,user.name);

        const token=await user.generateAuthToken();

        res.status(201).send({user,token});


     } catch (e) {
        res.status(400).send(e);
     }



});

//login Page::::

router.post('/users/login',async(req,res)=>{

    try {
        const user=await User.findByCredentials(req.body.email,req.body.password);
        const token=await user.generateAuthToken();
    
        res.status(200).send({
            user,
            token,
        });

    } catch (error) {
        res.status(404).send();
    }
   
});

// logout individiual user:

router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token;
        });
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }

});

// logout all users:

router.post('/users/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens=[];
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});




//Read:

router.get('/users/me',auth,async(req,res)=>{
    // User.find({}).then((users)=>{

    //     res.send(users);

    // }).catch((e)=>{
    //     res.status(500).send();
    // })

    // try {
    //    const users= await User.find({});
    //     res.status(200).send(users);
    // } catch (e) {
    //     res.status(500).send(e);
        
    // }
    res.send(req.user);

});

// router.get('/users/:id',async(req,res)=>{
//     const _id=req.params.id;
//     // User.findById(_id).then((user)=>{

//     //     if(!user)
//     //     {
//     //         return res.status(404).send();
//     //     }
//     //     res.send(user);

//     // }).catch((e)=>{
//     //     res.status(500).send();
//     // })

//     try {
//         const user=await User.findById(_id);
//         if(!user)
//         {
//             return res.status(404).send();
//         }
//         res.status(200).send(user);
//     } catch (e) {
//         res.status(500).send(e);s
//     }
 
// });

//Update:

router.patch('/users/me',auth,async(req,res)=>{
    const allowedUpdates=['name','email','password','age'];
    const updates=Object.keys(req.body);
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation)
    {
        res.status(404).send({error:'Invalid Updates'});
    }
    try {
        // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

        // const user=await User.findById(user.id);


        updates.forEach((update)=>req.user[update]=req.body[update]);

        await req.user.save();
        
        res.status(200).send(req.user);
    } catch (e) {
        res.status(500).send(e);
        
    }
});

//Delete:::::

router.delete('/users/me',auth,async(req,res)=>{

    try {
    //     const user=await User.findByIdAndDelete(req.user._id);
    //    if(!user)
    //    {
    //        return res.status(404).send();
    //    }
    //     res.status(301).send(user);
       await  req.user.remove();
       sendCancelEmail(req.user.email,req.user.name);
       res.send(req.user);

        
    } catch (e) {
        res.status(500).send();
    }

});

const upload=multer({

    limits:{
        fileSize:1000000,
    },

    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/))
        {
           cb(new Error('Please upload an image')); 
        }
        cb(undefined,true);
        
    },
});


router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    // req.user.avatar=req.file.buffer;
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar=buffer;
    await req.user.save();
    res.status(200).send();
},(error,req,res,next)=>{
    res.status(404).send({Error:error.message});
});



router.delete('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    if(!req.user.avatar)
    {
        return res.status(400).send('Not a user exist!');
    }
    try {
         req.user.avatar=undefined;
        await req.user.save();
        res.status(200).send();
        
    } catch (e) {
    res.status(500).send();        
    }
   
});

router.get('/users/:id/avatar',async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(!user || !user.avatar)
        {
            throw new Error();
        }
        res.set('Content-Type','image/png');
        res.send(user.avatar);

    } catch (e) {
        res.status(404).send();
    }
});



module.exports=router;