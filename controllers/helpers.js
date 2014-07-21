var fs = require('fs');

module.exports = {
    load: function(app){
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
        var printer = __dirname.replace('controllers', '') + '/.apis';
        fs.readFile(printer, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            data = JSON.parse(data);
            app.locals.bergapi = data.bergapi;
            app.locals.yoapi = data.yoapi;
        });
    },


};