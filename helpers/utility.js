var fieldModel = require('../models/tImgFieldModel');
var imgModel = require('../models/templateImageModel');
var fs      = require('fs');
var request = require('request');




var utility = {


    extractPythonToken: function(data,cb) {


        return new Promise(function(resolve, reject) {
         request({
          url: 'http://192.168.1.15:8004/create_new_token/',
          method: 'POST',
          json: {
           "grant_type": "password",
           "client_id": "7HnRkQUXsw3fPbjw0zVcZixMIJu5eo6KWlEQis99",
           "client_secret": "xwWgQgQQFVMrqZumTPkLE6QNqtmRXUcobt2faqUVWAoCr0s789NynrkS0HBzeFDYTocOcXjJG0ztvvAPsmUm9Yku99Ia1WGkE02EDnfcqkVDqsW6qvYBT7oc6Xq20gyb",
           "username": "demo",
           "password": "pass1234"
         }
       }, function(error, response, body){

        if(error){
          console.log(error);
          return res.status(500).send('Unexpected error from Python Service');
        }
        
        if(!body.token){
          return res.json('Python is Down');
        }
        console.log('token',body);
        python_token=body.token;
        resolve(python_token);

        });
       });

    },

    getOcrData: function(data,cb) {

      
    },

    verifyFile: function(data,cb) {

      
    }
}




module.exports = utility;
