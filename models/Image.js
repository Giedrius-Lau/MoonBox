'use strict';
const mongoose = require('mongoose');

const schema = {
    path: String
};

module.exports = mongoose.model('Image', schema);
