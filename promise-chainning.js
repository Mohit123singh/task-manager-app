require('./src/db/mongoose1');
const User=require('./src/models/user');


//610bd801f990937551b6996c

// User.findByIdAndUpdate('610bd801f990937551b6996c', {age:1}).then((user)=>{
//     console.log(user);

//     return User.countDocuments({age:1});
// }).then((result)=>{
//  console.log(result);
// }).catch((e)=>{
    
//     console.log(e);
// });

// User.findByIdAndUpdate('610bebee9b52480dad58571f',{age:2}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age:2});
// }).then((data)=>{
//     console.log(data);
// }).catch((e)=>{
//     console.log(e);
// })

const updateAgeCount=async(id,age)=>{
    const user=await User.findByIdAndUpdate(id,{age});
    const count=await User.countDocuments({age});
    // return count;
    return {
        user,
        count,
    }
};

updateAgeCount('610bd801f990937551b6996c',2).then((count)=>{
    console.log(count);
}).catch((e)=>{
    console.log(e);
})