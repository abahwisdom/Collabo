const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema= new Schema({
    title:{
        type: String,
        required: true,
        trim:true
    },
    description:{
        type: String,
        required: true,
        trim:true
    },
    creator_UID:{
        type: String,
        required: true,
        trim:true
    },
    creator_name:{
        type: String,
        required: true,
        trim:true
    },
    date:{
        type: Date,
        default: Date.now
    },
    tasks:{
        type: Array
    },
    members:{
        type:Array
    },
    closed:{
        type: Boolean
    }
});

const Project= mongoose.model('Project', ProjectSchema);
module.exports= Project;