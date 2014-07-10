var express = require('express'),
    request = require('request'),
    mongoose = require('mongoose'),
    model = require('./model'),
    fs = require('fs'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic;

var uristring = 'mongodb://localhost/telex';

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
    if (err) { 
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});

// App Setup
var app = express(),
    fs = require('fs'),
    domainName = 'http://telex.radio97.fr/';

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

// EJS Helpers
var padStr = function(i) {
    return (i < 10) ? "0" + i : "" + i;
}

app.locals.dateToDDMMYYYY = function(dte) {
    if (dte == null)
        return "-";
    return padStr(dte.getDate()) + '/' + padStr(1 + dte.getMonth()) + '/' + padStr(dte.getFullYear());
}

app.locals.dateToDDMMYYYYHHMM = function(dte) {
    if (dte == null)
        return "-";
    return padStr(dte.getDate()) + '/' + padStr(1 + dte.getMonth()) + '/' + padStr(dte.getFullYear()) + ' ' + 
        padStr(dte.getHours()) + ':' + padStr(dte.getMinutes());
}

app.locals.dateToFilename = function(dte) {
    if (dte == null)
        return "-";
    return padStr(dte.getDate()) + padStr(1 + dte.getMonth()) + padStr(dte.getFullYear()) +
        padStr(dte.getHours()) + padStr(dte.getMinutes()) + padStr(dte.getSeconds());
}



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
    model.getTelexs(function(telexs){
        model.getYos(function(yos){
            model.getYoRanking(function(topYo){
                res.render('index.ejs', {telexs: telexs, yos: yos, domainName: domainName, topYo: topYo});
            });
        });
    });
});

app.post('/', function(req, res) {
    if (req.body.telex == "") {
        console.log('Tlx : Empty');
        res.redirect('/');
        return;
    }

    var now = new Date(),
        head = '<head><meta charset="utf-8"><link rel="stylesheet" href="' + domainName + 'css/telex.css"></head>',
        title = '',
        telexDate = '<div class="date">' + app.locals.dateToDDMMYYYYHHMM(now) + ' UTC</div>',
        img = '',
        telexCtnt = '<div class="txt">' + req.body.telex + '</div>',
        fileName = '',
        isPrivate = (req.body.private == 'true'),
        post_data = '';

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

    if (req.body.name == "") {
        title = '<div class="title">TO : PREF. DE LA COLOC<br>FM : unknown sender</div>';
    } else {
        title = '<div class="title">TO : PREF. DE LA COLOC<br>FM : ' + req.body.name + '</div>';
    }

    if (req.files.photo.name != ''){
        var magic = new Magic(mmm.MAGIC_MIME_TYPE);
        magic.detectFile(req.files.photo.path, function(err, mime) {
            if (err) throw err;
            mime = mime.split("/");
            console.log(mime);

            if (mime[0].indexOf("image") == -1){
                console.log('Tlx : aborted | invalid image file');
                res.redirect('/');
                return;
            }
            if (req.files.photo.size > 12500000){
                console.log('Tlx : aborted | image is too big');
                res.redirect('/');
                return;
            }
            fileName = app.locals.dateToFilename(now)+ '-' + req.files.photo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.' + mime[1];
            fs.createReadStream(req.files.photo.path).pipe(fs.createWriteStream('public/files/' + fileName));
            img = '<div class="img"><img class="dither" src="' + domainName + 'files/' + fileName + '"></div>';

            var post_data = 'html=<html>' + head + '<body><img class="imghead" src="' + domainName + 'img/pub-1.png"><div class="container">' + 
                telexDate + title + img + telexCtnt + '</div></body></html>';

            console.log(post_data);

            model.createTelex(now, req.body.name, req.body.telex, fileName, isPrivate, function(result){
                request({
                    url: 'http://remote.bergcloud.com/playground/direct_print/' + bergapi.toString(),
                    method: 'POST',
                    body: post_data
                }, callback);
            });
        });
    } else {
        var post_data = 'html=<html>' + head + '<body><img class="imghead" src="' + domainName + 'img/pub-1.png"><div class="container">' + 
            telexDate + title + telexCtnt + '</div></body></html>';

        console.log(post_data);

        model.createTelex(now, req.body.name, req.body.telex, fileName, isPrivate, function(result){
            request({
                url: 'http://remote.bergcloud.com/playground/direct_print/' + bergapi.toString(),
                method: 'POST',
                body: post_data
            }, callback);
        });
    }
});

app.get('/yoall', function(req, res) {
    var now = new Date();

    model.createYoall(now, function(result){
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

});

app.get('/yo', function(req, res) {
    if (req.query.username != undefined){
        var now = new Date();
        model.getLastYo('GSELLATOR', function(lastYo){
            model.createYo(now, req.query.username, function(result){
                // If time since last yo is smaller than 60 minutes, I don't print it
                if (lastYo.length>0){
                    var now = new Date();
                    var timeDiff = Math.abs(now - lastYo[0].date)/60000; //diff en minutes
                    if (timeDiff < 60){
                        console.log('Yo overflow for ' + req.query.username);
                        return;
                    }
                }

                var now = new Date(),
                    head = '<head><meta charset="utf-8"><link rel="stylesheet" href="' + domainName + 'css/telex.css"></head>',
                    title = '<div class="title">TO : PREF. DE LA COLOC<br>FM : ' + req.query.username + '</div>',
                    telexDate = '<div class="date">' + app.locals.dateToDDMMYYYYHHMM(now) + ' UTC</div>',
                    img = '<div class="img yo"><img src="' + domainName + 'img/yo.png"></div>';

                var post_data = 'html=<html>' + head + '<body><img class="imghead" src="' + domainName + 'img/pub-1.png"><div class="container">' + 
                    telexDate + title + img + '</div></body></html>';

                request({
                    url: 'http://remote.bergcloud.com/playground/direct_print/' + bergapi.toString(),
                    method: 'POST',
                    body: post_data
                }, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log('Yo : ' + body);
                    }
                    else{
                        console.log('Yo : KO | ' + body);
                    }
                });
            });
        });
    }
    res.redirect('/');
});

app.get('/test', function(req, res) {
    res.render('test.ejs');
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

app.listen(3030);