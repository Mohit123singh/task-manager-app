const User=require('../../src/models/user');

const Task=require('../../src/models/task');

const jwt=require('jsonwebtoken');

const mongoose=require('mongoose');

const userOneId=new mongoose.Types.ObjectId();


const userOne={
    _id:userOneId,
    name:'Mike',
    email:'mike2908@gmail.com',
    password:'234What!!',
    tokens:[
        {
            token:jwt.sign({_id: userOneId},process.env.JWT_SECRET),
        }
    ]
}

const userTwoId=new mongoose.Types.ObjectId();


const userTwo={
    _id:userTwoId,
    name:'Mohit',
    email:'monuhunk.singh99@gmail.com',
    password:'WWWWhat!!',
    tokens:[
        {
            token:jwt.sign({_id: userTwoId},process.env.JWT_SECRET),
        }
    ]
}

const taskOne={
    _id:new mongoose.Types.ObjectId(),
    description:'First Task',
    completed:false,
    owner:userOne._id,
}

const taskTwo={
    _id:new mongoose.Types.ObjectId(),
    description:'Second Task',
    completed:true,
    owner:userOne._id,
}

const taskThree={
    _id:new mongoose.Types.ObjectId(),
    description:'Third Task',
    completed:true,
    owner:userTwo._id,
}


const setUpDatabase=async ()=>{
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();

}

module.exports={
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setUpDatabase,

}