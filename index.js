import express from "express"
import * as url from 'url'
import multer from "multer"
import XmlParser from './app.js'
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", {pdfPath: "file not exist"});
});

app.get("/deletefiles", (req, res) => {
  XmlParser.deletefiles("./uploads")
  XmlParser.deletefiles("./public/pdf")
  res.redirect('/')
})

// Configuracion Multer
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
let upload = multer({storage})

app.post('/upload', upload.single('xml'), (req, res, next) => {
  XmlParser.xmlToPfd(req.file.filename).then((data)=>{
    const fileName = '/pdf/'+ XmlParser.fileTypeXmlToPdf(req.file.filename)
    res.render("archive", {pdfPath: fileName})
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});