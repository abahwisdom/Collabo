require('dotenv').config()

module.exports={ 
    "database": {  
        "JWT_SECRET": process.env.JWT_SECRET,
        "MONGODB_URI": process.env.MONGODB_URI,
    }
}