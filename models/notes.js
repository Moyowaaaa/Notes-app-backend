const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
    },
    tag:{
        type:String
    }
    // type:{
    //     type: String,
    // }
})

module.exports = mongoose.model('Notes', NotesSchema);