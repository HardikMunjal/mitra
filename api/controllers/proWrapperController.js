var fs      = require('fs');
var request = require('request');
var xml = require('xml');
var jsonexport = require('jsonexport');

var csv = require("csvtojson");




var wrapper = {


   createCSV: function(req, res, next) {
    
    var user= req.body.user;

    for(var i=0;i<user.length;i++){
      console.log(user[i]);
      if(!user[i].sso_id || !user[i].kiosk_id || !user[i].district || !user[i].date){
        var message = "Mandatory Parameter are missing";
        return res.status(400).send(message);
      }
    }



    // Convert a csv file with csvtojson
    csv()
      .fromFile('./users.csv')
      .then(function(jsonArrayObj){ //when parse finished, result will be emitted here.
         
         for(var i=0;i<user.length;i++){
           jsonArrayObj.push(user[i]);
         }
         
        jsonexport(jsonArrayObj,function(err, csv){
            if(err) return console.log(err);

            fs.writeFile('./users.csv', csv, function(err) {
              if (err) throw err;
              console.log(csv);
               res.send("done");
            });
            console.log(csv);
        });

       })

        

      },


  proTemplateId: function(req, res, next) {
    
    var username='Truecover';
    if(!req.body.insurer_name && !req.body.policy_type){
      var message = "insurer_name/policy_type is missing";
      return res.status(400).send(message);
    }

    var template_name= req.body.insurer_name + req.body.policy_type + username;
    var myJSONObject = {};
    myJSONObject.name=template_name;
    request({
        url: "http://192.168.1.54:8008/hyp/fetch/templateId?temp_token=123456789",
        method: "POST",
        json: true,
        body: myJSONObject
    }, function (error, response, body){
        console.log('body',body);
        if(error  || body.length == 0){
          var message = "Template Not Found";
          return res.status(400).send(message);
        }else{
          req.body.template_id=body[0]._id;
          next();
        }a
    });

  },



  proWrapper: function(req, res, next) {

    

    console.log('***************template_id',req.body,req.files);

    var options = { 
      method: 'POST',
      url: 'http://192.168.1.54:8008/hyp/process/template',
      qs: { temp_token: '123456789' },
      headers: 
       { 'postman-token': 'e3c595de-d960-e1d8-9904-dc28b3a9a2cb',
         'cache-control': 'no-cache',
         'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
      formData: 
       { template_id: req.body.template_id,
         imgUploader1: fs.createReadStream(req.files[0].path || __dirname + '/uploads/1531916887739-Apollo Health.pdf') } };


    

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      var body2=JSON.parse(body);
      console.log(body2.fileid)
      
      var myJSONObject = {};
      myJSONObject.file_id= body2.fileid;
      request({
          url: "http://192.168.1.54:8008/hyp/process/getsingledata?temp_token=123456789",
          method: "POST",
          json: true,   // <--Very important!!!
          body: myJSONObject
      }, function (error, response, body){
          console.log(body2);
          
          //res.set('Content-Type', 'text/xml');
          //es.send(xml(body2));

          var o2x = require('object-to-xml');
          //res.json(body);
          var presentCount=0;
          var totalCount=0;
          for(var i=0;i<body[0].data.length;i++){
            for(var j=0;j<body[0].data[i].file_data.length;j++){
                if(body[0].data[i].file_data[j].predicted_value){
                  presentCount= presentCount+1;
                }
                  totalCount=totalCount+1;
            }
          }

          console.log(presentCount,totalCount);
          body[0].recall_score= (presentCount/totalCount)*100;


          res.set('Content-Type', 'text/xml');
          res.send(o2x({
              '?xml version="1.0" encoding="utf-8"?' : null,
              prodata: {
                  data: body
              }
          }));
      });


    });
  }
}




module.exports = wrapper;