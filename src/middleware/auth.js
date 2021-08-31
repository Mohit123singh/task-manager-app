const jwt=require('jsonwebtoken');
const User=require('../models/user');
const auth=async(req,res,next)=>{
//   console.log('authorization');

try {
     const token=req.header('Authorization').replace('Bearer ','');
    //  console.log(token);
      const decoded=await jwt.verify(token,process.env.JWT_SECRET);
    //   console.log(decoded);
      const user=await User.findOne({_id:decoded._id,'tokens.token':token});
    //   console.log(user);
     if(!user)
     {
         throw new Error();
     }

      req.token=token;
      req.user=user;

     next();

} catch (e) {
    res.status(401).send({error:'Please Authenticate .'});
}

}

module.exports=auth;