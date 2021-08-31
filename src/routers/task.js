const express=require('express');
const router=new express.Router();
const Task=require('../models/task');
const auth=require('../middleware/auth');

//task:

//create:

router.post('/tasks',auth,async(req,res)=>{
    // const task=new Task(req.body);
    const task=new Task({
        ...req.body,
        owner:req.user._id,
    });
    // task.save().then(()=>{
    //     res.status(201).send(task);
    // }).catch((e)=>{
    //     res.status(400).send(e);
    // })
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(500).send(e);
        
    }
});

//read

//filtering::

//GET / tasks?completed=false

//pagination:
//GET / tasks?limit=10&skip=0

//Sorting::
// Ascending::
//GET / tasks?sortBy=createdAt_asc
// Descending
////GET / tasks?sortBy=createdAt_desc

// OR

// GET / tasks?sortBy=createdAt:desc

 // createdAt:-1, // +1 -> ascending, -1 -> descending





router.get('/tasks',auth,async(req,res)=>{
    // Task.find({}).then((task)=>{
    //     res.send(task);
    // }).catch((e)=>{
    //     res.status(500).send();
    // })

    const match={};

    const sort={};

    if(req.query.completed)
    {
        match.completed=(req.query.completed==='true');
    }
    if(req.query.sortBy)
    {
       const parts=req.query.sortBy.split(':');
       sort[parts[0]]=(parts[1]=='desc')?-1:1;
    }



    try {

        // const users=await Task.find({})
       // const users=await Task.find({owner:req.user._id});
         // res.status(200).send(users);
        //Alternative way:

          await req.user.populate({
              path:'tasks',
              match,
              options:{
                   limit:parseInt(req.query.limit),
                   skip:parseInt(req.query.skip),
                   sort,
              }
          }).execPopulate();
          res.status(200).send(req.user.tasks);

       
    } catch (e) {
        res.status(500).send(e);
    }

});

router.get('/tasks/:id',auth,async(req,res)=>{
    
    // Task.findById(_id).then((task)=>{
    //     if(!task)
    //     {
    //         return res.status(404).send();
    //     }
    //     res.send(task);

    // }).catch((e)=>{
    //      res.status(500).send();
    // })

    try {
        const _id=req.params.id;
        // const task=await Task.findById(_id);

        const task=await Task.findOne({_id,owner:req.user._id});

        if(!task)
        {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e);
        
    }

})

//Update:

router.patch('/tasks/:id',auth,async(req,res)=>{
    const allowedUpdates=['description','completed'];
    const updates=Object.keys(req.body);
    const isValidOperation= updates.every((update)=>allowedUpdates.includes(update));

    if(!isValidOperation)
    {
        return res.status(404).send({error:'Invalid Update'});
    }

    try {
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        // const task=await Task.findById(req.params.id);

        const task=await Task.findOne({_id:req.params.id,owner:req.user._id});
        
        if(!task)
        {
            return res.status(404).send();
        }
       
        updates.forEach((todo)=>task[todo]=req.body[todo]);
       
        await task.save();
        
        res.status(200).send(task);
    } catch (e) {
     res.status(500).send(e);   
    }
});

//Delete:

router.delete('/tasks/:id',auth,async(req,res)=>{
   
    try {
        const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        if(!task)
        {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (e) {
        return res.status(500).send();
    }
});

module.exports=router;