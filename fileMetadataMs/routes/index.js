var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();

/**
 * Home page.
 */
router.get('/', function(req, res, next) {
  res.render('index');
});

/**
 * Outputs the file size in JSON format.
 */
router.post('/get-file-size', upload.single('file'), function(req, res, next) {
  if (req.file) {
    res.json({
      'size': req.file.size + ' bytes'
    });
  }
  else {
    res.json({
      'error': 'No file uploaded'
    });
  }
});

module.exports = router;
