import * as fs from 'fs'
const AddFun = {}
AddFun.getExtensionFileName = (filename) => {
    let array = filename.split('.')
    return array[array.length-1]
}
AddFun.changeExtensionFileName = (filename, extensionFile) => {
    let array = filename.split('.')
    array[array.length-1] = extensionFile
    let strFilename = array.join('.')
    return strFilename
}
AddFun.deleteFolder = (path) => {
    let files = []
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path)
        files.forEach(function(file,index){
            let curPath = path + "/" + file
            fs.unlinkSync(curPath)
        });
    }
}
AddFun.isZipFile = (filename) => {
    if (AddFun.getExtensionFileName(filename) === 'zip' || AddFun.getExtensionFileName(filename) === 'ZIP') {
        return true
    }
    return false
}
export default AddFun