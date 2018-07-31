var error = require('./error');
var proCtlr = require('../api/controllers/proWrapperController');

var multer = require('multer');
var fs = require("fs");

path = require('path');
var mkdirp = require('mkdirp');






module.exports = function (app) {

app.get('/test',function(req, res, next) {
    res.render('chat.html');
});
       
//**************** WRAPPER API
//app.get('/qlik/extract/data',proCtlr.proExtract);

app.post('/qlik/data/collector',proCtlr.createCSV);
    
    
}

