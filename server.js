var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var SERVER_PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

console.log("process.env.MONGO_URL=="+process.env.MONGO_URL)

var url = process.env.MONGO_URL||'mongodb://localhost:27017';
var DB_NAME = process.env.DB_NAME || "tradingDB";
var path = require('path');

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.route('/').get((req, res)=> {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.route('/accounts').get(function(req, res){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(DB_NAME);
            var query = { };
            dbo.collection("accounts").find(query).toArray(function(err, result) {
              if (err) throw err;              
              res.send(result);
              db.close();
            });
        });
});

app.route('/createAccount').post((req, resp)=>{
    //req.body.AccountNumber
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db(DB_NAME);
            dbo.collection("accounts").insertOne(req.body, function(err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();

            var query = { };            
            resp.send("Account created successfully: "+JSON.stringify(req.body));
            
          })
    });
});

app.route('/createAccounts').post((req, resp)=>{
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db(DB_NAME);
            dbo.collection("accounts").insertOne(req.body, function(err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            var query = { }; 

            dbo.collection("accounts").find(query).toArray(function(err, result) {
              if (err) throw err;
              console.log(result.length);
              resp.send("Accounts created in bulk!, current account count: "+result.length);
              db.close();
            });

          });
    });
});

app.route('/deleteAccounts').post((req, resp)=>{
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db(DB_NAME);
            dbo.collection("accounts").drop(function(err, delOK) {
                console.log("Collection trades deleted");
                resp.send("All trades deleted");
                db.close();
              });

    });
});

app.route('/searchAccounts').post((req, res)=>{
    res.send("Hey, searched account as requested!");
});

var server = app.listen(SERVER_PORT, function() {});

console.log("Ramesh, server started at "+SERVER_PORT);