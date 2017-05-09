var http = require('http');
var fs = require('fs'),
express = require('express'),
path = require('path');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



var varAuth = 'Basic YWthc2hkZWVwOmxudExOVDJLMTZfMQ==';
var varHost = 'acs.crm.ap2.oraclecloud.com';
var varPath = '/salesApi/resources/latest/Activity';
const https = require('https');


app.post('/inputmsg',function(request,response){
	console.log('Req : '+ request.body.result.parameters.any);
	
	//Importing Data from OSC
	//console.log(" RecordName :" + request.body.RecordName); // recordname?
    var recordNameURL = (request.body.result.parameters.any).trim().replace( / /g, "%20" );
    console.log("recordNameURL :" + recordNameURL)
	var options = {
		host: varHost,
		port: 443,
		path: varPath + "/" + recordNameURL, 
		headers: {
		'Authorization': varAuth,
		'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
		}   
	};
	var responseObject;
	var r = https.get(options, function(res){
	var body = "";

	res.on('data', function(data) {
		body += data;
	});
	res.on('end', function() {
		
		responseObject = JSON.parse(body);
		//response.json(responseObject);
        //console.log(" Object : " + body);
                console.log(" Attribute : " + (request.body.result.parameters.attribute));
	        //console.log(" Value : " + responseObject.items[0]['Id']); //VAR APNAvAR = "Id";   //responseObject.items[0][apnavar]
		
		
		if(request.body.result.parameters.attribute){
			var answer = responseObject.items[0][request.body.result.parameters.attribute];
			console.log(" Value : " + answer);
			if(request.body.result.parameters.attribute=="ActivityNumber")
			{
				var speech = "The activity number of "+recordNameURL+" is "+ answer+".";
			}
			else if(request.body.result.parameters.attribute=="ActivityId")
			{
				var speech = "The Activity Id of "+recordNameURL+" is "+ answer+".";
			}
			else if(request.body.result.parameters.attribute=="ActivityCreatedBy")
			{
				var speech = "The Activity of "+recordNameURL+" is Created By "+ answer+".";
			}
			else if(request.body.result.parameters.attribute=="Id")
			{
				var speech = "The Id of "+recordNameURL+" is "+ answer+".";
			}
			else if(request.body.result.parameters.attribute=="Subject")
			{
				var speech = "The subject of "+recordNameURL+" is "+ answer+".";
			}
			else if(request.body.result.parameters.attribute=="CreationDate")
			{
				var speech = answer+" is Creation Date of "+recordNameURL;
			}
			else
			{
				var speech = "Your answer is "+ answer+".";
			}	
		}
		else{
				var speech = "Couldnt find your answer";
		}			     
		return response.json({
			speech: speech,
			displayText: speech,
			source: 'poc4'
		});
		// console.log(" Value : " + answer);
        //response.json(responseObject.items[0][request.body.attribute]);

		})
	}).on('error', function(e){
	console.error(e);
  });

	request.on('error', function(error) {
		console.log(error);
	});
	
	//request.end();
	
});


function send404(response){
	response.writeHead(404, {'Context-Type' : "text/plain"});
	response.write("Error 404 : Page not Found");
	response.end();
}




app.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
