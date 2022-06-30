const mongoose = require ('mongoose')

const FolderSchema = new mongoose.Schema({
    name:{
        type:String
    }
})

module.exports = mongoose.model('Folder',FolderSchema)

