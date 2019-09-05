const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const Joi = require('joi');

const db = require("./db");
const collection = "gift";
const app = express();

// used for data validation for our gift document
const schema = Joi.object().keys({
    gift : Joi.string().required()
});

// parses json data sent to us by the user 
app.use(bodyParser.json());

// serve static html file to user
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
});

//create a new gift
app.post('/',(req,res,next)=>{
    // Document to be inserted
    const userInput = req.body;

    // Validate document
    Joi.validate(userInput,schema,(err,result)=>{
        if(err){
            const error = new Error("Invalid Input");
            error.status = 400;
            next(error);
        }
        else{
            db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
                if(err){
                    const error = new Error("Failed to insert Gift Document");
                    error.status = 400;
                    next(error);
                }
                else
                    res.json({result : result, document : result.ops[0],msg : "Successfully inserted Gift!!!",error : null});
            });
        }
    })    
});



//delete a gift
app.delete('/:id',(req,res)=>{
    // Primary Key of Gift Document
    const giftID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(giftID)},(err,result)=>{
        if(err)
            console.log(err);
        else
            res.json(result);
    });
});

// Middleware for handling Error
app.use((err,req,res,next)=>{
    res.status(err.status).json({
        error : {
            message : err.message
        }
    });
})

//Check for errors when connecting to the database
db.connect((err)=>{
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    }
    
    else{
        app.listen(3000,()=>{
            console.log('connected to database, app listening on port 3000');
        });
    }
});