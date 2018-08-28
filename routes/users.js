var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/cool', function(req, res, next) {
  res.render('message', { title: 'Hey', message: 'you\'re so cool'});
  //res.send('You\'re so cool');
});

module.exports = router;
