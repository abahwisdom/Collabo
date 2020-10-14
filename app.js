const express= require('express');
const mongoose= require('mongoose');
const config= require('config');

const app= express();
app.use(express.json());

const path= require('path');

const usersRoute= require('./routes/users');
const projectsRoute= require('./routes/projects');
const authRoute= require('./routes/auth');

app.use('/api/users', usersRoute);
app.use('/api/projects', projectsRoute);
app.use('/api/auth', authRoute);

const testRoute= require('./routes/test');
app.use('/api/test', testRoute)

//Database
const db= config.get("mongoURI");

mongoose.connect(db, 
    {   
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(()=>{console.log('Connected to Database...')})
.catch((err)=>{console.log(err)});

if (process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'))
    })
}


const PORT= process.env.port||5000;
app.listen(PORT||5000);

