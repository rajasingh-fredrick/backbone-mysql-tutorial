var express = require("express");
var mysql = require('mysql');

/*module.exports = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'users'
   });
*/

var pool = mysql.createPool({
				connectionLimit : 100,
				host: 'localhost',
				user: 'root',
				password: '',
				database: 'items', 
				waitForConnections: true,
				queueLimit: 10
		   });

pool.query = function(query, callback) {
	
	pool.getConnection(function(err, connection) {
		if ( err ) {
			console.log('Error occurred while getting DB connection');
			callback(err, null, null);
			return;
		}
		else {

			connection.query(query, function(err, result, fields) {
				if ( err ) {
					callback(err, null, null);
				} 
				else {
					callback(err, result, fields);
				}
			});		
		}	

	});
}

pool.query = function(query, post, callback) {
	
	pool.getConnection(function(err, connection) {
		if ( err ) {
			console.log('Error occurred while getting DB connection');
			callback(err, null, null);
			return;
		}
		else {

			connection.query(query, post, function(err, result) {
				if ( err ) {
					callback(err, null);
				} 
				else {
					callback(err, result);
				}
			});		
		}	

	});
}


pool.insertquery = function(query, fields, callback) {
	
	pool.getConnection(function(err, connection) {
		if ( err ) {
			console.log('Error occurred while getting DB connection');
			callback(err, null, null);
			return;
		}
		else {

			connection.query(query, fields, function(err, result) {
				if ( err ) {
					callback(err, null);
				} 
				else {
					callback(err, result);
				}
			});		
			connection.release();
		}	
	});
}


module.exports = pool;