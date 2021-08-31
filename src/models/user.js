const mongoose=require('mongoose');
const validator=require('validator');
const becryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Task=require('./task');

const userSchema=new mongoose.Schema({
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
        unique:true,
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
 
    },

    tokens:[
        {
            token:{
                type:String,
                require:true,
            }
        }
    ],
    avatar:{
        type:Buffer,
    }
    
},{
    timestamps:true,
});

// relationship between two entities i.e User and Task
//  A virtual property is not stored in the database......

// The localField represents the field you want to connect on the userSchema and 
// the foreignField represents the field on the taskSchema. You can read it as:
// "Find Tasks where localField is equal to foreignField"

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner',

});

//create token for specific user........

userSchema.methods.generateAuthToken=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);
    user.tokens.push({token});
    await user.save();
    return token;
}

//hide private deatils of  a particular user..

userSchema.methods.toJSON=function(){

    const user=this;

    const userObject=user.toObject();

    delete userObject.password;

    delete userObject.tokens;

    delete userObject.avatar;

    return userObject;
}


//verification of user ::::

userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email});
    if(!user)
    {
        throw new Error('Unable to login!');
    }

    const isMatch=await becryptjs.compare(password,user.password);
    if(!isMatch)
    {
        throw new Error('Unable to login!');
    }
    return user;
}




//Middleware:
userSchema.pre('save',async function(next){
    const user=this;
    // console.log('just before saving');

    if(user.isModified('password'))
    {
        user.password=await becryptjs.hash(user.password,8);
    }

    next();
})

//Delete user tasks when user is removed

userSchema.pre('remove',async function(next){
    const user=this;
    await Task.deleteMany({owner:user._id});
    next();

});

const User=mongoose.model('users',userSchema);


 module.exports=User;