require('./src/db/mongoose1');

const Task=require('./src/models/task');

// Task.findByIdAndDelete('610bc78f58b0ef57b519fcdc').then((task)=>{
//     console.log(task);
//     return Task.countDocuments({completed:'false'});
// }).then((data)=>{
//     console.log(data); 
// }).catch((e)=>{
//     console.log(e);  
// });

const count_completed_task=async(id)=>{
    const getDeletedData=await Task.findByIdAndDelete(id);
    const count_data=await Task.countDocuments({completed:'false'});

    return{
        getDeletedData,
        count_data,      
    };
}

count_completed_task('610bee843a541f0faa7337c9').then((data)=>{
    console.log(data);
}).catch((e)=>{
    console.log(e);
})

