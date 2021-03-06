// File management Module 
const fs        = require("fs")
const multer    = require("multer") 
const path      = require("path") 
const currentPath       = __dirname 
const directoryName     = path.dirname(currentPath) 


const userStorage = multer.diskStorage({
    destination : function(req , file , cb) {
		cb(null ,  path.join(directoryName, '/public/uploads/'))
	} , 
	filename : function(req , file , cb) {  
		let date = new Date().getDate() 
	    let fileName =   req.session.email + "-" + file.originalname 
		cb(null , fileName) 
	}
})

exports.userUpload  = multer({storage : userStorage})