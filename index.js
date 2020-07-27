const express = require('express')
const app = express();
const path = require('path');
//Connect MongoDB
// const mongo = require('mongodb').MongoClient;
// const url = 'mongodb://localhost:27017';
const bodyParser= require('body-parser');
const { info } = require('console');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const PORT = process.env.PORT || 4000;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbMap:01886557050khoa@map.rgzu3.mongodb.net/map?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,
                                      useUnifiedTopology: true });
client.connect(err => {
  if (err) {
    console.error(err)
    return;
  }
  db = client.db('map');
  app.listen(PORT, () => {
    console.log('App listening on port ' + PORT)
  })
  //const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  //client.close();
});

//First Initializing: Connect mongoDB, open port
// mongo.connect(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }, (err, client) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     db = client.db('map');
//     app.listen(4000, () => {
//       console.log('App listening on port 4000')
//    })
// })
app.use(express.static(path.join(__dirname)));
app.get('/preload', (req, res, next)=>{
  db.collection('dataPath').find({}).toArray((err, dataPath)=>{
    if(err) throw err;
    if(!dataPath[0]) throw new Error("Empty");
    result = {
      path: dataPath[0].path,
      vertexs: dataPath[0].vertexs,
      width: dataPath[0].width,
      height: dataPath[0].height,
      information: dataPath[0].information
    }
    console.log(result);
    res.json(result);
  })
})
app.post('/inc-qty-care', function(req,res,next){ 
  let vertex = req.body.vertex;
  db.collection('dataPath').updateOne(
    {
      "information.vertex" : Number(vertex)
    },
    { $inc: { 
              "information.$.qty_care" : 1
            } 
    },
    function(err, collection){ 
      if (err) throw err; 
      console.log("Record inserted Successfully"); 
  }); 
  return res.redirect('/')
}) 
