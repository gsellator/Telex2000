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
var bergapi = "";
var yoapi = "";
fs.readFile(printer, 'utf8', function (err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
    data = JSON.parse(data);
    bergapi = data.bergapi;
    yoapi = data.yoapi;
});

// Routes
app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.post('/', function(req, res) {
    console.log(req.body.name);
    console.log(req.body.telex);

    if (req.body.telex == "") {
        console.log('Tlx : Empty');
        res.redirect('/');
    } else {
        var post_data = "";

        if (req.body.name == "") {
            post_data = 'html=<html><head><meta charset="utf-8"></head><body><h1>Telex 2000 Anonyme :</h1><p>' + req.body.telex + '</p></body></html>';
        }
        else {
            post_data = 'html=<html><head><meta charset="utf-8"></head><body><h1>Telex 2000 de ' + req.body.name + ' :</h1><p>' + req.body.telex + '</p></body></html>';
        }

        var options = {
            url: 'http://remote.bergcloud.com/playground/direct_print/' + bergapi.toString(),
            method: 'POST',
            body: post_data
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('Tlx : ' + body);
                res.redirect('/');
            }
            else{
                console.log('Tlx : KO | ' + body);
                res.redirect('/');
            }
        }
        request(options, callback);
    }
});

app.get('/yoall', function(req, res) {
    var options = {
        url: 'http://www.justyo.co/yoall/',// + printerApiCode.toString(),
        method: 'POST',
        form:    { api_token: "e71d95a3-38c0-7e28-0a38-d28867ec91cd" }
    };
    request(options, function(error, response, body){
        console.log('YoAll : ' + body);
    });

    res.redirect('/');
});

app.get('/yo', function(req, res) {
    console.log(req.query.username);

    if (req.query.username != undefined) {
        request({
            url: 'http://remote.bergcloud.com/playground/direct_print/' + bergapi.toString(),
            method: 'POST',
            body: 'html=<html><head><meta charset="utf-8"></head><body><h1>Yo From ' + req.query.username + '</h1></body></html>'
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('Yo : ' + body);
            }
            else{
                console.log('Yo : KO | ' + body);
            }
        });
    }

    res.redirect('/');
});


app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(3030);