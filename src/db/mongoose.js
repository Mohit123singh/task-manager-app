const mongoose=require('mongoose');
const validator=require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{

    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true ,

});

const User=mongoose.model('users',{
   name:{
       type:String,
       required:true,
       trim:true,
   },

   age:{
       type:Number,

       default:0,
     
       validate(value){
           if(value<0)
           {
               throw new Error('Age must be Postive number');
           }
       }
   },
   email:{
       type:String,
       trim:true,
       lowercase:true,
       required:true,
       validate(value)
       {
           if(!validator.isEmail(value))
           {
               throw new Error('Invalid Email!');
           }
       },
   },

   password:{
       type:String,
       required:true,
       trim:true,
       minlength:6,

       validate(value)
       {
           if(value.toLowerCase().includes('password'))
           {
            throw new Error('Password cannot contain "password"');
           }
       }

   }
});

// const me=new User({
//    name:'    ROHIT   ',
//    email:'  Rohit.SINGH600@GMAIL.COM    ',
//    password:'          mohit Singh PASSWORD     ',

// });

// me.save().then(()=>{
//     console.log(me);

// }).catch((error)=>{

//     console.log('Error!',error);

// })


const Task=mongoose.model('Task',{
   
    description:{
        type:String,
        required:true,
        trim:true,
    },

    completed:{
        default:false,
        type:Boolean,
    }
});

const addNewtask=new Task({
    description:'          learning Nodejs   !',
});

addNewtask.save().then(()=>{
    console.log(addNewtask);
}).catch((error)=>{
    console.log(error);
});