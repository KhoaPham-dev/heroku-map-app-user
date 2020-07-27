const express = require('express')
const app = express();
const path = require('path');
const bodyParser= require('body-parser');
var db = require('../Admin/db.json');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//First Initializing: Connect mongoDB, open port
app.use(express.static(path.join(__dirname)));

var fs = require('fs');

function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if(err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch(exception) {
      callback(exception);
    }
  });
}
app.get('/preload', (req, res, next)=>{
  readJSONFile('../Admin/db.json', function (err, json) {
    if(err) { throw err; }
    res.json(json);
  });
})
app.post('/inc-qty-care', function(req,res,next){ 
  let vertex = req.body.vertex;
  db.information.forEach((e)=>{if(e.vertex == vertex)e.qty_care++});
  fs.writeFile('../Admin/db.json', JSON.stringify(db), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(db));
  });
	return res.redirect('/');
}) 
app.listen(4000, () => {
  console.log('App listening on port 4000')
})
