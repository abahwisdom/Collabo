const express= require('express');
const router= express.Router();


const Project = require('../models/Projects');
const User = require('../models/Users');
const mongoose = require('mongoose');

const auth= require('../middleware/auth');


ObjectId= mongoose.Types.ObjectId;

//Create Projects
//POST
router.post('/', (req, res)=>{
    const newproject= new Project({
        title: req.body.title,
        description: req.body.description,
        creator_UID: req.body.creator_UID,
        creator_name: req.body.creator_name,
        tasks:[],
        closed: false
    });

    newproject.save()
    .then((project)=>{res.json(project)})
    .catch((err)=>{res.status(400).json({"error": err})});
});

//Display Projects
//GET
router.get('/', (req, res)=>{
    Project.find()
    .then((project)=>{res.json(project)})
    .catch((err)=>{res.status(400).json({"error": err})});
});

//Display OPEN Projects for User
//GET
router.get('/:uid', (req, res)=>{
    Project.find({creator_UID:req.params.uid, closed:false}).sort({date:-1})
    .then((project)=>{
        // console.log('call made');
        res.json(project)})
    .catch((err)=>{res.status(400).json({"error": err})});
});

//Display CLOSED Projects for User
//GET
router.get('/:uid/closed', (req, res)=>{
    Project.find({creator_UID:req.params.uid, closed:true}).sort({date:-1})
    .then((project)=>{res.json(project)})
    .catch((err)=>{res.status(400).json({"error": err})});
});

//Display OPEN Projects User is part of 
//GET
router.get('/:uid/other', (req, res)=>{
    Project.find().sort({date:-1})
    .then((projects)=>{
       const list=[];
            // if (!projects) return;
            projects.map(project=>{
            const found= project.members.find((member)=>{return member.member_id==req.params.uid});
            if (found) list.push(project);
            // console.log(list);
            });
            res.json(list)
//     .catch((err)=>{res.status(400).json({"error": err})});
})})

//Display specific project
//GET
router.get('/:id/specific', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{res.json(project)})
    .catch((err)=>{res.status(400).json("No project with id")});
})
    

//Edit Project Name
//PUT
router.put('/:id/edit', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        project.title= req.body.title||project.title;
        project.description= req.body.description||project.description;
        project.save()
        .then((project)=>{res.json(project)}).catch((err)=>{res.status(400).json(err.message)});
    })
    .catch((err)=>{res.status(400).json("No project with id")});
});

//Close Project
//PUT
router.put('/:id/close', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        project.closed= true;
        project.save()
        .then((project)=>{res.json(project)}).catch((err)=>{res.status(400).json(err.message)});
    })
    .catch((err)=>{res.status(400).json("No project with id")});
});

//Close Project
//PUT
router.put('/:id/open', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        project.closed= false;
        project.save()
        .then((project)=>{res.json(project)}).catch((err)=>{res.status(400).json(err.message)});
    })
    .catch((err)=>{res.status(400).json("No project with id")});
});

//Delete Project from trash
//DELETE
router.delete('/:id', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        project.remove()
        .then((project)=>{res.json('project deleted')}).catch((err)=>{res.status(400).json(err.message)});
    })
    .catch((err)=>{res.status(400).json("No project with id")});

    
});


//Tasks Routes
 
//Create new task
//POST
router.post('/:id/new', (req, res)=>{
    Project.findById(req.params.id)
    .then(project=>{
        const newTask= {
            task_id:new ObjectId,
            title: req.body.title,
            project_id: req.params.id,
            lead: req.body.lead,
            description: req.body.description,
            done: req.body.done,
            date: new Date().toGMTString()
        };
        project.tasks= project.tasks.concat(newTask);
        project.save()
        .then((project)=>{res.json(project)}).catch((err)=>{res.status(400).json(err.message)});
    })
    .catch((err)=>{res.status(400).json("No project with id")});
});

//Display tasks
//GET
router.get('/:id/tasks', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        res.json(project.tasks)
    })
    .catch((err)=>{res.status(400).json("No project with id")});
});

//Display specific task
//GET
router.get('/:id/:tid', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        const tasks= project.tasks;
        const thisTask= tasks.find((task)=>task.task_id==req.params.tid);
        return thisTask;
        
    })
    .then((task)=>res.json(task))
    .catch((err)=>{res.status(400).json("No project or Task with id")});
});


//Edit task
//PUT
router.put('/:id/:tid/edit', (req, res)=>{

    Project.findById(req.params.id)
    .then((project)=>{
        const index= project.tasks.findIndex((task)=>task.task_id==req.params.tid);
        return index
    }).then((index)=>{
        Project.update(
        { _id: req.params.id},
        { $set:
           {
            [`tasks.${index}.title`]: req.body.title,
            [`tasks.${index}.lead`]: req.body.lead,
            [`tasks.${index}.description`]: req.body.description
            //  "ratings.0.rating": 2
           }
        }
     )
     .then((project)=>{res.json(project)})
     .catch((err)=>{res.status(400).json(err.message)});
    })


    
    // Project.findById(req.params.id)
    // .then(async (project)=>{
    //     const thisIndex= project.tasks.findIndex((task)=>task.task_id==req.params.tid);
    //     project.tasks[thisIndex].title= req.body.title||project.tasks[thisIndex].title;
    //     project.tasks[thisIndex].lead= req.body.lead||project.tasks[thisIndex].lead;
    //     project.tasks[thisIndex].description= req.body.description||project.tasks[thisIndex].description;
    //     project.tasks[thisIndex].date= new Date();
    //     // project.title= 'Brand New Life'
    //     return await project.save()
        
        
    // })
    // .then((project)=>{res.json(project)})
    // .catch((err)=>{res.json(err)});
});

//Mark task as done
//PUT
router.put('/:id/:tid/done', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        const index= project.tasks.findIndex((task)=>task.task_id==req.params.tid);
        const status=project.tasks[index].done;
        return {index, status}
    }).then(({index, status})=>{
        Project.update(
        { _id: req.params.id},
        { $set:
           {
            [`tasks.${index}.done`]: !status
           }
        }
     )
     .then((project)=>{res.json(project)})
     .catch((err)=>{res.status(400).json(err.message)});
    })
});

//Unmark task/ Undo
//PUT
// router.put('/:id/:tid/done', (req, res)=>{
//     Project.findById(req.params.id)
//     .then((project)=>{
//         const thisIndex= project.tasks.findIndex((task)=>task.task_id==req.params.tid);
//         project.tasks[thisIndex].done= false||project.tasks[thisIndex].title;
//         project.save()
//         .then(()=>{res.json(project.tasks)})
//         .catch((err)=>{res.status(400).json(err.message)});
        
//     })
//     .catch((err)=>{res.status(400).json("No project or Task with id")});
// });



//Delete Task
//DELETE
router.delete('/:id/task/:tid', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        const thisIndex= project.tasks.findIndex((task)=>task.task_id==req.params.tid);
        // console.log(thisIndex);
        project.tasks.splice(thisIndex, 1);
        project.save()
        .then(()=>{res.json(project)})
        .catch((err)=>{res.status(400).json(err.message)});
        
    })
    .catch((err)=>{res.status(400).json("No project or Task with id")});
});


//Members Route

//Join Project
//POST
router.post('/:id/new-member', (req, res)=>{
    Project.findById(req.params.id)
    .then(project=>{
        const newMember= {
            member_id: req.body.member_id,
            member_name:req.body.member_name,
            member_email:req.body.member_email,
            admin:false,
            date: new Date()
        };
        project.members= project.members.concat(newMember);
        project.save()
        .then((project)=>{res.json('New Member Added')}).catch((err)=>{res.status(400).json(err.message)});
    })
    .catch((err)=>{res.status(400).json("No project with id")});

    //Add project to user database
    // WRONG
    // User.find({_id:req.body.member_id})
    // .then(user=>{
    //     user.projects= user.projects.concat(req.params.id);
    //     user.save()
    //     .then(()=>{res.json('Project Added')}).catch((err)=>{res.status(400).json(err.message)});
    // })
});

//Display Members
//GET
router.get('/:id/members', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        res.json(project.members)
    })
    .catch((err)=>{res.status(400).json("No project with id")});
});

//Display specific member
//GET
router.get('/:id/:muid', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        const members= project.members;
        const thisMember= members.find((member)=>member.member_UID==req.params.muid);
        return thisMember;
        
    })
    .then((member)=>res.json(member))
    .catch((err)=>{res.status(400).json("No project or member with id")});
});


//Change member role
//PUT
//WRONG
router.put('/:id/:muid', (req, res)=>{
    Project.findById(req.params.id)
    .then((project)=>{
        const thisIndex= project.members.findIndex((member)=>member.member_id==req.params.muid);
        project.members[thisIndex].admin= req.body.admin||project.members[thisIndex].admin;
        project.save()
        .then(()=>{res.json(req.body.admin)})
        .catch((err)=>{res.status(400).json(err.message)});
        
    })
    .catch((err)=>{res.status(400).json("No project or member with id")});
});


//Leave Project/Delete Member
//DELETE
router.delete('/:id/member/:muid', (req, res)=>{
    // console.log('ga');
    Project.findById(req.params.id)
    .then((project)=>{
        const thisIndex= project.members.findIndex((member)=>member.member_id===req.params.muid);
        // console.log(thisIndex);
        project.members.splice(thisIndex, 1);
        project.save()
        .then(()=>{res.json(project)})
        .catch((err)=>{res.status(400).json(err.message)});
        
    })
    .catch((err)=>{res.status(400).json("No project or Member with id")});
});

//TO-DO
//Handle lead assignment separately

module.exports= router;