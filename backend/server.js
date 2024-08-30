const express=require('express');
const multer=require('multer');
const converter=require('docx-pdf');
const cors = require("cors");
const path=require('path');
const Discord=require('discord.js');
const client=new Discord.Client();
const dotenv=require('dotenv');
const { convert } = require('./bot');

const app=express();

const PORT=5000;
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname.split('.')[0]);
    }
  })
  
const upload = multer({ storage: storage });

app.post('/convertByLaw', upload.single('file'),(req, res, next)=>{
    try{
        if(!req.file){
           return res.status(400).json({
            message: "Babu file to upload karo"
          });
        }

        let ouputPath=path.join(__dirname,"isme",`${req.file.originalname.split('.')[0]}.pdf`)

        converter(req.file.path,ouputPath,(err,result)=>{

          if(err){
            return res.status(500).json({
              message: "Nhi ho paya babu sorry"
            });
          }

          res.download(ouputPath,()=>{
            console.log('Babu ho gyi download');
          })
        });
    }
    catch(err){
      console.log(err);
    }
})

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname,'isme', filename); 
  console.log(filePath);

  res.download(filePath, (err) => {
      if (err) {
          console.error("Error downloading file:", err);
          res.status(500).send("Error downloading file");
      }
  });
});


dotenv.config({path:'.././.env'});

client.login(process.env.TOKEN);

client.on('ready',()=>{
    console.log('Bot is online');
});

client.on('message',convert);

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});
