var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';



module.exports = (function(app){
  app.get('/', function(req,res){
    res.render('home');
  });
  app.get('/register',function(req,res){
    res.render('register');
  });
  app.get('/login',function(req,res){
    res.render('login');
  });

// Login TO DB==================================================================
  app.post('/login',urlencodedParser,function(req,res){
     MongoClient.connect(url, {useNewUrlParser: true},function(err, client) {
     if (err) throw err;
     var db = client.db('mydb');
     db.collection('userprofile').findOne({ name: req.body.name}, function(err, user) {
               if(user ===null){
                 res.end("User not found.");
              }else if (user.name === req.body.name && user.pass === req.body.pass){
              res.end('You are logined in.');
            } else {
              res.end("You password is incorrect.");
            }
     });
    });
  });

  //register to DB================================================================
  app.post('/regiterToDb',urlencodedParser,function(req,res){
     var obj = JSON.stringify(req.body);
     var jsonObj = JSON.parse(obj);
     MongoClient.connect(url,{useNewUrlParser: true}, function(err, client) {
        if (err) throw err;
        var db = client.db('mydb');
        profileCollection = db.collection('userprofile');
        profileCollection.findOne({ name: req.body.name}, function(err, user) {
          if (user === null) {
            profileCollection.insertOne(jsonObj, function(err, res) {
              if (err) throw err;
              res.end('You have regestered successfully.');
            });
          } else {
            res.end('You have already registered, please go ahead login.');
          }
        });
   });
  });
});
