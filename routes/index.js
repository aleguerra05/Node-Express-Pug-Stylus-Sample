var express = require('express');
var router = express.Router();

var fs = require('fs');
var Client = require('node-rest-client').Client;
var client = new Client();
var year = new Date().toISOString().substr(0,4);

client.registerMethod("search", "http://localhost:3001/posts?q=${codeValue}", "GET");

/* GET home page. */
router.get('/', function(req, res, next) {
  
  client.get("http://localhost:3001/posts?_sort=code&_order=des&code_like=CUB", function (dataCub, response) {
    client.get("http://localhost:3001/posts?_sort=code&_order=des&code_like=EUR", function (dataEur, response) {
      console.log(response.statusCode);
      
      if (response.statusCode == 200) {
          res.render('index', { title: 'Lista de Contenidos ', posts:{}, postsCub: dataCub, postsEur: dataEur, year: year });
      }
      else {
          res.render('message', { title: 'Error', message: 'detalles: ' + response.statusMessage });
      }
    });
  });
});

router.post('/',function(req,res,next){
    var args = {
        path: { "codeValue": req.body.codeValue }
    }

    client.methods.search(args, function (data, response) {
        console.log(response.statusCode);
        if (response.statusCode == 200) {
            res.render('index', { title: 'Lista de Contenidos ', posts: data,postsCub: {}, postsEur: {}, year: year });
        }
        else {
            res.render('message', { title: 'Error', message: 'detalles: ' + response.statusMessage });
        }
    });
});

module.exports = router;