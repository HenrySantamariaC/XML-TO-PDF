const dragArea = document.querySelector('.drag-area')
const dragText = document.querySelector('#nameFile')
const input = document.querySelector('#formFile')
const boxAlert = document.querySelector('#boxAlert')
const imgAlert = document.querySelector('#imgAlert')
const textAlert = document.querySelector('#textAlert')

dragArea.addEventListener('change',(e) => {
    showAlert(input.files[0])
})
dragArea.addEventListener('dragover',(e) => {
    e.preventDefault()
    dragArea.classList.add('active')
    dragText.textContent = 'Suelta para cargar el archivo'
})
dragArea.addEventListener('dragleave',(e) => {
    e.preventDefault()
    dragArea.classList.remove('active')
    dragText.textContent = 'Arrastra y suelta archivos'
})
dragArea.addEventListener('drop',(e) => {
    e.preventDefault()
    let file = e.dataTransfer.files[0]
    validateExtensionFiles(file)
    dragArea.classList.remove('active')
    dragText.textContent = 'Arrastra y suelta archivos'
})

function validateExtensionFiles(file) {
    let typeFile = file.type
    let supportExtensions = ['text/xml', 'application/x-zip-compressed']
    if (supportExtensions.includes(typeFile)) {
        let list = new DataTransfer()
        list.items.add(file) 
        input.files = list.files
        showAlert(file)
    } else {
        showAlert(file)
        let list = new DataTransfer()
        list.items.clear()        
        input.files = list.files
    }
}

function showAlert(file) {
    boxAlert.className = 'alert alert-light'
    boxAlert.classList.add('hiddenAlertBox')
    if (file != undefined) {
        if (getExtensionFileName(file.name.toLowerCase()) === 'zip') {
            boxAlert.className = 'alert alert-light text-truncate'
            boxAlert.classList.add('zipBox')
            textAlert.textContent = file.name
            imgAlert.src = './assets/img/zip.png'
        } else if (getExtensionFileName(file.name.toLowerCase()) === 'xml') {
            boxAlert.className = 'alert alert-light text-truncate'
            boxAlert.classList.add('xmlBox')
            textAlert.textContent = file.name
            imgAlert.src = './assets/img/xml.png'
        } else {
            boxAlert.className = 'alert alert-light text-truncate'
            boxAlert.classList.add('errorFile')
            textAlert.textContent = 'Archivo no soportado'
            imgAlert.src = './assets/img/error.png'
        }
    }
}

function getExtensionFileName(filename) {
    let array = filename.split('.')
    return array[array.length-1]
}