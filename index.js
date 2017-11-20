var express = require('express');
const app = express();
var path = require('path');
var swig = require('swig');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
swig.setDefaults({
    cache : false
});
global.MODEL = require("./assets/js/models")();
global.server = __dirname;
var langList = require("./config/langList.json");
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));

app.engine('tpl', swig.renderFile);

app.set('view engine', 'tpl');

app.get("/",function (req,res) {
    req._pageData = req._pageData || {};
    req.pageData = function(vo){
        req._pageData = req._pageData || {};
        for(var key in vo){
            req._pageData[key] = vo[key];
        }
    };
    req.pageData({
        MODEL: MODEL
    });
    res.render('index.tpl',langList);
});

app.use("/stt",require("./server"));

app.listen(8085);