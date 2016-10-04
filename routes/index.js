var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/check', function(req, result, next) {
  var email = req.body.email;

  result.send('OK');

  console.log(email);
});

module.exports = router;
