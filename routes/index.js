var express = require('express');
var router = express.Router();

var fs = require('fs');
var Client = require('node-rest-client').Client;
var client = new Client();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Palacio Segundo Cabo', subtitle: 'Subtítulo' });

  client.get("http://localhost:3001/posts/", function (data, response) {
      console.log(response.statusCode);
      if (response.statusCode == 200) {
          res.render('index', { title: 'Lista de Contenidos ', posts: data });
      }
      else {
          res.render('message', { title: 'Error', message: 'Cantidad de Contenidos: ' + response.statusMessage });
      }
  });
});

module.exports = router;
