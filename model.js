var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    model = module.exports;

var apiUri = 'http://127.0.0.1:3000/';


// Schemas definitions
var TelexSchema = new Schema({
    date: { type: Date },
    name: { type: String },
    telex: { type: String }
});

var YoSchema = new Schema({
    date: { type: Date },
    username: { type: String }
});

var YoallSchema = new Schema({
    date: { type: Date }
});

mongoose.model('Telex', TelexSchema);
mongoose.model('Yo', YoSchema);
mongoose.model('Yoall', YoallSchema);

var TelexModel = mongoose.model('Telex'),
    YoModel = mongoose.model('Yo'),
    YoallModel = mongoose.model('Yoall');

// CRUD Telex
model.getTelexs = function (callback) {
    TelexModel.find()
    .sort({_id:-1})
    .limit(5)
    .exec(function (err, result) {
        if (err) { throw err; }
        callback(result);
    });
};

model.getTelexFromId = function (id, callback) {
    TelexModel.findOne({"_id": id}, function (err, result) {
        if (err) { throw err; }
        callback(result);
    });
};

model.createTelex = function (date, name, telex, callback) {
    var newTelex = new TelexModel({
        date: date,
        name: name,
        telex: telex
    });
    newTelex.save(function (err, result) {
        if (err) { throw err; }
        callback(result);
    });
};

model.deleteTelex = function (id, callback) {
    TelexModel.remove({"_id": id}, function (err, result) {
        if (err) { throw err; }
        callback(result);
    });
};


// CRUD Yo
model.getYos = function (callback) {
    YoModel.find()
    .sort({_id:-1})
    .limit(5)
    .exec(function (err, result) {
        if (err) { throw err; }
        callback(result);
    });
};

model.createYo = function (date, username, callback) {
    var newYo = new YoModel({
        date: date,
        username: username
    });
    newYo.save(function (err, result) {
        if (err) { throw err; }
        callback(result);
    });
};

model.deleteYo = function (id, callback) {
    YoModel.remove({"_id": id}, function (err, result) {
        if (err) { throw err; }
        callback(result);
    });
};


// CRUD Yoall
model.getYoalls = function (callback) {
    YoallModel.find({}, function (err, result) {
        if (err) { throw err; }
        callback(result);
    });
};

model.createYoall = function (date, callback) {
    var newYoall = new YoallModel({
        date: date
    });
    newYoall.save(function (err, result) {
        if (err) { throw err; }
        callback(result);
    });
};

model.deleteYoall = function (id, callback) {
    YoallModel.remove({"_id": id}, function (err, result) {
        if (err) { throw err; }
        callback(result);
    });
};
