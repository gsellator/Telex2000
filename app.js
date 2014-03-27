var express = require('express'),
    request = require('request');

// App Setup
var app = express(),
    fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

//Read Little Printer direct API code in '/.printer'
var printer = __dirname + '/.printer';
fs.readFile(printer, 'utf8', function (err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
    data = JSON.parse(data);
    var printerApiCode = data.code;
});

// Routes
app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.post('/', function(req, res) {
    console.log(req.body.name);
    console.log(req.body.telex);

    if (req.body.telex == "") {
        console.log('Empty Message');
        res.redirect('/');
    } else {
        var post_data = "";

        if (req.body.name == "") {
            console.log('Anonymous message');
            post_data = 'html=<html><head><meta charset="utf-8"></head><body><h1>Telex 2000 Anonyme :</h1><p>' + req.body.telex + '</p></body></html>';
        }
        else {
            console.log('Signed message');
            post_data = 'html=<html><head><meta charset="utf-8"></head><body><h1>Telex 2000 de ' + req.body.name + ' :</h1><p>' + req.body.telex + '</p></body></html>';
        }

        var options = {
            url: 'http://remote.bergcloud.com/playground/direct_print/' + printerApiCode.toString(),
            method: 'POST',
            body: post_data
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                res.redirect('/');
            }
            else{
                console.log('KO');
                res.redirect('/');
            }
        }
        request(options, callback);
    }
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(3030);