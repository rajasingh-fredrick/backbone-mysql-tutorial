var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.listen(3000, function()
{
    console.log('server started running');
});

app.use(express.static(__dirname + '/public'));

// use middleware -- for body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var connection = require('./dbconnection');

app.get('/itemlist', function(req, res)  {

	connection.query('select * from item', function(err, result, fields) {
			if ( err ) {
				console.log("Error occurred" + err );
			} 
			else {
				console.log('return result set ' + result);
				res.send(result);
			}
		});
});

app.post("/item", function(req, res) {

	console.log(req.body.name);
	var result = insertQuery(req);
	console.log("Result " + result);
	res.send(true);
});

app.put("/item/:id", function(req, res) {

	console.log(req.body.name);
	var result = updateQuery(req);
	console.log("Result " + result);
	res.send(true);
});

app.get("/item/:id", function(req, res) {
	console.log("Id " + req.params.id);
	connection.query('select * from item where id =  ? ' , [ req.params.id ] , function(err, result) {
			if ( err ) {
				console.log("Error occurred" + err );
			} 
			else {
				console.log('return result set ' + result);
				res.send(result);
			}
		});
});

app.delete("/item/:id", function(req, res) {
	console.log("Id " + req.params.id);
	connection.query('delete from item where id =  ? ' , [ req.params.id ] , function(err, result) {
			if ( err ) {
				console.log("Error occurred" + err );
			} 
			else {
				console.log('return result set ' + result.affectedRows);
				res.send(result);
			}
		});
});

function insertQuery(req)
{
	var fields = { 'name'  : req.body.name, 
	               'qty'   : req.body.qty, 
	               'price' : req.body.price };

	connection.insertquery('insert into item set ?', fields,  function(err, result) {
				if ( err ) {
					console.log("Error occurred" + err );
				} 
				else {
					console.log('return result set ' + result);
				}
		});

}

function updateQuery(req) {

	var fields = [
				     req.body.name, 
	                 req.body.qty, 
	                 req.body.price,
	                 req.body.id ];

	connection.insertquery('update item set name = ?, qty = ?, price = ? where id = ?', fields,  function(err, result) {
				if ( err ) {
					console.log("Error occurred" + err );
				} 
				else {
					console.log("Number of affected rows " + result.affectedRows);
					console.log('return result set ' + result);
				}
		});	
}


