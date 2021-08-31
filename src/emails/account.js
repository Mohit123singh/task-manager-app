const sgMail=require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sgMail.send({

//     to:'mohiit.singh600@gmail.com',
//     from:'mohiit.singh600@gmail.com',
//     subject:'This is my first Creation',
//     text:'How are You ?',

// });


const sendWelcomeEmail=(email,name)=>{

    sgMail.send({
        to:email,
        from:'mohiit.singh600@gmail.com',
        subject:'Thanks for joining in !',
        text:`Welcome to the app, ${name}. Let me know how you get along with the app.`
    })

};

const sendCancelEmail=(email,name)=>{
   sgMail.send({
    to:email,
    from:'mohiit.singh600@gmail.com',
    subject:'Sorry to see you go!',
    text:`Goodbye!, ${name}. I hope to see you back sometime soon.`
   });
};

module.exports={
    sendWelcomeEmail,
    sendCancelEmail,
};

