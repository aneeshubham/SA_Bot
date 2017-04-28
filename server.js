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
var varPath = '/salesApi/resources/latest/Task_SA_c';
const https = require('https');


app.post('/inputmsg',function(request,response){
	console.log('Req : '+ request.body.result.parameters.any);
	
	//Importing Data from OSC
	//console.log(" RecordName :" + request.body.RecordName);
    var recordNameURL = (request.body.result.parameters.any).trim().replace( / /g, "%20" );
    console.log("recordNameURL :" + recordNameURL)
	var options = {
		host: varHost,
		port: 443,
		path: varPath + "/?q=RecordName=" + recordNameURL, 
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
			if(request.body.result.parameters.attribute=="AssignedTo_SA2_c")
			{
				var speech = "The task "+recordNameURL+" is assigned to "+ answer+".";
			}
			else if(request.body.result.parameters.attribute=="Status_SA_c")
			{
				var speech = "The status of "+recordNameURL+" is "+ answer+".";
			}
			else if(request.body.result.parameters.attribute=="Type_c")
			{
				var speech = "The type of "+recordNameURL+" is "+ answer+".";
			}
			else if(request.body.result.parameters.attribute=="Id")
			{
				var speech = "The Id of "+recordNameURL+" is "+ answer+".";
			}
			else if(request.body.result.parameters.attribute=="CreatedBy")
			{
				var speech = "This "+recordNameURL+" is  created by "+ answer+".";
			}
			else if(request.body.result.parameters.attribute=="EmailAddress_c")
			{
				var speech = answer+" is associated to "+recordNameURL;
			}
			else if(request.body.result.parameters.attribute=="CreationDate")
			{
				var speech = recordNameURL+" was created on "+answer;
			}
			else if(request.body.result.parameters.attribute=="LastUpdateDate")
			{
				var speech = recordNameURL+" was last updated on "+answer;
			}
			else if(request.body.result.parameters.attribute=="LastUpdatedBy")
			{
				var speech = recordNameURL+" was recently updated by "+answer;
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
