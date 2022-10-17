import express from "express"
import * as url from 'url'
import multer from "multer"
import XmlParser from './scripts/XmlParser.js'
import AddFun from './scripts/AdditionalFunctions.js'
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
  XmlParser.deletefiles()
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
  try {
    XmlParser.xmlToPfd(req.file.filename).then((data)=>{
      const fileName = '/pdf/'+ AddFun.changeExtensionFileName(AddFun.verifyDuplicatedFilename(req.file.filename),'pdf')
      res.render("archive", {pdfPath: fileName})
    })
  } catch (error) {
    throw new SyntaxError(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
