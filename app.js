import * as fs from 'fs'
// import util from 'util'

import xml2js from "xml2js"
import htmlPdf from "html-pdf"

const XmlParser = {}
let style = `<style>
    .comprobante {
        font-family: 'Bahnschrift';
        font-size: 11px
    }
    .text-center {
        text-align: center
    }
    .fw-bold {
        font-weight: bold
    }
    .fs-11{
        font-size: 11px
    }
    .fs-12{
        font-size: 12px
    }
    .fs-13{
        font-size: 13px
    }
    .fs-14{
        font-size: 14px
    }
    </style>
    `
let content = ''
let options = {
    width: "88mm",
    height: "297mm",
    border:  {
        "top": "0",           
        "right": "3mm",
        "bottom": "0",
        "left": "3mm"
        }
}

XmlParser.fileTypeXmlToPdf = (str) => {
    return str.replace(/.xml/i, '.pdf')
}

function parseXmlToJson(data) {
    let json = ''
    const parser = new xml2js.Parser({ignoreAttrs:true, explicitArray:false})
    parser.parseString(data, (err, result) => {
        let temp = JSON.stringify(result)
        temp = temp.replace(/ext:/g,'')
        temp = temp.replace(/sac:/g,'')
        temp = temp.replace(/ds:/g,'')
        temp = temp.replace(/cbc:/g,'')
        temp = temp.replace(/cac:/g,'')
        json = JSON.parse(temp)
    })
    return json
}
function createHtmlWithJson(json) {
    let content = ''
    content += `
    <div class="comprobante">
    <p class="fw-bold fs-13 text-center">${json.Invoice.AccountingSupplierParty.Party.PartyLegalEntity.RegistrationName}</p>
    <p class="fw-bold fs-13 text-center">RUC ${json.Invoice.AccountingSupplierParty.Party.PartyIdentification.ID}</p>
    <p>${json.Invoice.AccountingSupplierParty.Party.PartyLegalEntity.RegistrationAddress.AddressLine.Line}
    <span> - ${json.Invoice.AccountingSupplierParty.Party.PartyLegalEntity.RegistrationAddress.CityName}</span>
    <span> - ${json.Invoice.AccountingSupplierParty.Party.PartyLegalEntity.RegistrationAddress.CountrySubentity}</span>
    </p>
    <p class="fw-bold fs-13 text-center">${(json.Invoice.InvoiceTypeCode==1 ? 'FACTURA ELECTRÓNICA' : json.Invoice.InvoiceTypeCode==3 ? 'BOLETA ELECTRÓNICA' : '' )}</p>
    <p class="fw-bold fs-14 text-center">${json.Invoice.ID}</p>
    <span class="fw-bold">CLIENTE: </span><span>${json.Invoice.AccountingCustomerParty.Party.PartyLegalEntity.RegistrationName}</span><br/>
    <span class="fw-bold">DOC. IDENTIDAD: </span><span>${json.Invoice.AccountingCustomerParty.Party.PartyIdentification.ID}</span><br/>
    <span class="fw-bold">EMISION: </span><span>${json.Invoice.IssueDate}</span>
    <hr/>
    <table class="table fs-11">
    <thead>
        <tr>
        <th scope="col">CANT.</th>
        <th scope="col">DESCRIPCIÓN</th>
        <th scope="col">P.U</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>${json.Invoice.InvoiceLine.InvoicedQuantity}</td>
        <td>${json.Invoice.InvoiceLine.Item.Description}</td>
        <td>${json.Invoice.LegalMonetaryTotal.LineExtensionAmount}</td>
        </tr>
    </tbody>
    </table>
    <hr/>
    <table class="table fs-12">
    <tbody>
        <tr>
        <td><span class="fw-bold fs-12">OP.GRAVADA: </span></td>
        <td><span class="fs-12">S/${json.Invoice.LegalMonetaryTotal.LineExtensionAmount}</span></td>
        </tr><tr>
        <td><span class="fw-bold fs-12">IGV: </span></td>
        <td><span class="fs-12">S/${json.Invoice.TaxTotal.TaxAmount}</span></td>
        </tr><tr>
        <td><span class="fw-bold fs-12">TOTAL: </span></td>
        <td><span class="fs-12">S/${json.Invoice.LegalMonetaryTotal.PayableAmount}</span></td>
        </tr>
    </tbody>
    </table>
    <p class="fw-bold fs-12 text-center">${json.Invoice.Note}</p>
    </div>
    `;
    return content
}
function deleteFolder(path) {
    let files = []
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path)
        files.forEach(function(file,index){
            let curPath = path + "/" + file
            fs.unlinkSync(curPath)
        });
    }
  }

XmlParser.xmlToPfd = (filename) => {
    return new Promise((resolve, reject)=>{
        let data = fs.readFileSync('./uploads/'+filename,{encoding:'utf8', flag:'r'})
        let json = parseXmlToJson(data)
        // console.log(JSON.stringify(json));
        content = style + createHtmlWithJson(json)
        htmlPdf.create(content, options).toFile('./public/pdf/'+ XmlParser.fileTypeXmlToPdf(filename), function(err, res) {
            if (err){ console.log(err) } else { resolve(res) }
        });
    })
}
XmlParser.deletefiles = () => {
    deleteFolder("./uploads")
    deleteFolder("./public/pdf")
}

export default XmlParser