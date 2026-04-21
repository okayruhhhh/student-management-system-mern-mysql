require("dotenv").config();

const express=require("express");
const cors=require("cors");
const mysql=require("mysql2");
const fs=require("fs");
const multer=require("multer");
const path=require("path");


const app=express();
app.use(cors());
app.use(express.json());

const con=mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
	});

//setting up multer for file up
	const storage=multer.diskStorage({
		destination:(req,file,cb)=>{
			cb(null,"uploads/");//Dest folders for uploads
		},
		filename:(req,file,cb)=>{
			cb(null,Date.now()+path.extname(file.originalname));//unique filename
		},
		});

	const upload=multer({storage});

	app.use("/uploads",express.static("uploads"));
	
	app.post("/ss",upload.single("file"),(req,res)=>{
		let sql="insert into student values(?,?,?,?)";
		let data=[req.body.rno,req.body.name,req.body.marks,req.file.filename];
		con.query(sql,data,(error,response)=>{
			if(error)	res.send(error);
			else 	res.send(response);
		});
	});

	app.get("/gs",(req,res)=>{
		let sql="select rno,name,marks,file from student";
		con.query(sql,(error,response)=>{
			if(error)	res.send(error);
			else 	res.send(response);
		});
	});
	app.delete("/ds",(req,res)=>{
		let sql="delete from student where rno=?";
		let data=[req.body.r];
		fs.unlink("./uploads/"+req.body.f,(err)=>{
			if(err)	console.log(err);
	});
		con.query(sql,data,(error,response)=>{
			if(error)	res.send(error);
			else 	res.send(response);
		});
	});
	
app.listen(9000,()=>{console.log("ready @ 9000"); });