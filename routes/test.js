const express= require('express');
const router= express.Router();
const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

let emailSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    }
  })

  let EmailModel =mongoose.model('Email', emailSchema)





router.post('/add',(req,res)=>{
    const {email}= req.body;
    let msg = new EmailModel({email})
      
      msg.save()
         .then(doc => {
            res.json(doc);
         })
         .catch(err => {
             res.json({msg:'failed'});
           console.error(err)
         })
})


router.get('/:email',(req,res)=>{
    const {email}= req.params;
    EmailModel
        .findOne({email})
        .then(doc => {
           if (doc) res.json({msg:'exists'});
           console.log(doc==true)
         })
         .catch(err => {
            res.json({msg:'failed'});
          console.error(err)
        })
})

module.exports= router;