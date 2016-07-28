var User = require('../models/users.js');
var path = process.cwd();

exports.update = function(req, res) {
    User.findById(req.user.id, function (err, user) {
        if(err) { return handleError(res, err); }
        if(!user) { return res.status(404).send('Not Found'); }
        
        var newQuery = req.params.location;
        user['lastQuery'] = newQuery;
        user.save(function(err) {
            if (err) { return handleError(res, err); }
        });
    });
}

function handleError(res, err) {
  return res.status(500).send(err);
}