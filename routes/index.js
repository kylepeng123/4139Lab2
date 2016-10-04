var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/check_email_exists', function(req, result, next) {
  var email = req.body.email;
  //Go in to the database
  //var decision = true;
  result.send('OK');

  console.log(email);
});

module.exports = router;
