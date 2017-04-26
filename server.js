const http = require('http');
const fs = require('fs'),
const express = require('express');
path = require('path');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', onRequest);
app.use(express.static(path.join(__dirname, 'public')));

// function onRequest(request, response){
  // express.static(path.join(__dirname, 'public'));
  // response.sendFile(path.join(__dirname, 'public/index.html'));
// }


var varAuth = 'Basic YWthc2hkZWVwOmxudExOVDJLMTZfMQ==';
var varHost = 'acs.crm.ap2.oraclecloud.com';
var varPath = '/salesApi/resources/latest/Task_SA_c';
const https = require('https');




//Start CHat bot
//var apiai = require('apiai');
 
//var appAI = apiai("f87977b15fba4fc9b49437df62c05b1e");

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
	var r = https.get(options, function(response){
	var body = "";

	response.on('data', function(data) {
		body += data;
	});
	response.on('end', function() {
		
		responseObject = JSON.parse(body);
		//response.json(responseObject);
        //console.log(" Object : " + body);
        console.log(" Attribute : " + (request.body.result.parameters.attribute);
		console.log(" Value : " + responseObject.items[0]['Id']); //VAR APNAvAR = "Id";   //responseObject.items[0][apnavar]
		var answer = responseObject.items[0][(request.body.result.parameters.attribute];
		if(answer){
				var speech = "Your answer is "+ answer+".";
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
	
	// var request = appAI.textRequest( res.result.resolvedQuery, {
		// sessionId: '1234567890'
	// });
	
	// request.on('response', function(res) {
		// console.log("Res : "+res.result.parameters);
		// response.send(  res.result.parameters );
	// });

	request.on('error', function(error) {
		console.log(error);
	});
	
	request.end();
	
});

// app.post('/inputmsg',function(request,response){

	
// });


//End of chatbot

// app.post('/getObject',function(request,response){
	// console.log(" RecordName :" + request.body.RecordName);
    // var recordNameURL = (request.body.any).trim().replace( / /g, "%20" );
    // console.log("recordNameURL :" + recordNameURL)
	// var options = {
		// host: varHost,
		// port: 443,
		// path: varPath + "/?q=RecordName=" + recordNameURL, 
		// headers: {
		// 'Authorization': varAuth,
		// 'Content-Type': 'application/vnd.oracle.adf.resourceitem+json'
		// }   
	// };
	// var responseObject;
	// var r = https.get(options, function(res){
	// var body = "";

	// res.on('data', function(data) {
		// body += data;
	// });
	// res.on('end', function() {
		
		// responseObject = JSON.parse(body);
		// response.json(responseObject);
        // console.log(" Object : " + body);
        // console.log(" Attribute : " + request.body.attribute);
		// console.log(" Value : " + responseObject.items[0]['Id']);
		// console.log(" Value : " + responseObject.items[0][request.body.attribute]);
        // response.json(responseObject.items[0][request.body.attribute]);

		// })
	// }).on('error', function(e){
	// console.error(e);
  // });
// });

function send404(response){
	response.writeHead(404, {'Context-Type' : "text/plain"});
	response.write("Error 404 : Page not Found");
	response.end();
}




app.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
