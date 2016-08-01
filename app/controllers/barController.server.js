var Bar = require('../models/bars.js');
var path = process.cwd();

// Get list of polls
exports.index = function(req, res) {
  Bar.find(function (err, bars) {
    if(err) { return handleError(res, err); }
    return res.json(bars);
  });
};

// Creates a new bar in the DB.
exports.create = function(req, res) {
    var bar = new Bar();
    bar.name = req.body.name;
    bar.url = req.body.url;
    bar.image_url = req.body.image_url;
    bar.snippet = req.body.snippet;
    bar.attending = [];
    
    bar.save(function(err) {
      if (err) { return handleError(res, err)};
    });
    return res.status(200).json(bar);
};

exports.editAttending = function(req, res) {
  var url = req.body.url;
  var user = req.body.user;
  
  Bar.find({ url: url }, function(err, bar) {
    if(err) { return handleError(res, err); }
    var bar = bar[0];
    var uIndex = bar.attending.indexOf(user);
    if (uIndex > -1) {
      bar.attending.splice(uIndex, 1);
    } else {
      bar.attending.push(user);
    }
    bar.save(function(err) {
      if (err) { return handleError(res, err)};
      return res.status(200).json(bar);
    });
  });
}

exports.findByURL = function(req, res) {
  var url = req.query.url;
  Bar.find({ url: url }, function(err, bar) {
    if(err) { return handleError(res, err); }
    return res.json(200, bar);
  })
};

function handleError(res, err) {
  return res.status(500).send(err);
}