const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    contentHeader: {
        type: String,
       
    },
    note: {
        type: String,
    },
    todo: {
        type: String,
    },
})

module.exports = mongoose.model('Content', ContentSchema);