#!/usr/bin/env node
var http = require('http');
var url = require('url');
var request = require('request');
var domain = require('domain');
var port = process.env.PORT || 8080;

var server = http.createServer(function (req, res) {
	var d = domain.create();
	d.on('error', function (e){
		console.log('ERROR', e.stack);

		res.statusCode = 500;
		res.end('Error: ' + ((e instanceof TypeError) ? "make sure your URL is correct" : String(e)));
	});

	d.add(req);
	d.add(res);

	d.run(function() {
		handler(req, res);
	});

}).listen(port);

function handler(req, res) {
	var url_parts = url.parse(req.url, true);
	var auth = url_parts.query.auth;
	var uuu = url_parts.query.url;
	try {
		res.setTimeout(25000);
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Credentials', false);
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString()); // one day in the future
		var r = request(uuu, {followRedirect: false, encoding: null, rejectUnauthorized: false, headers: {
'Authorization': 'bearer ' + auth 
}}, function(error, response, body) {
	console.log(response.headers)
	res.end(response.headers.location)
});
	} catch (e) {
		res.end('Error: ' +  ((e instanceof TypeError) ? "make sure your URL is correct" : String(e)));
	}
}
