var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.get('/locationChart', function(req, res, next) {
  res.render('locationCharts', { title: 'Express' });
});
router.get('/dateChart', function(req, res, next) {
  res.render('dateCharts', { title: 'Express' });
});
router.get('/productChart', function(req, res, next) {
  res.render('productCharts', { title: 'Express' });
});
router.post('/dashboard', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/dashboard', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/check', function(req, result, next) {
  var email = req.body.email;

  result.send('OK');

  console.log(email);
});

module.exports = router;
