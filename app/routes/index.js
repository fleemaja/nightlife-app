'use strict';

var path = process.cwd();
var yelpnode = require('yelp');
var UserController = require(path + '/app/controllers/userController.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
		
    app.route('/')
        .get(function(req, res) {
        	var user = null;
        	if (req.user) {
        		user = req.user;
        	}
        	return res.render(path + '/public/index.ejs', {
        		user: user
        	});
        })
        
    app.route('/api/:location')
        .get(function(req, res) {
        	var yelp = new yelpnode({
		        consumer_key: process.env.YELP_CONSUMER_KEY,
		        consumer_secret: process.env.YELP_CONSUMER_SECRET,
		        token: process.env.YELP_TOKEN,
		        token_secret: process.env.YELP_TOKEN_SECRET
	        });
	        if (req.user) {
	        	UserController.update(req, res);
	        }
	        var location = decodeURI(req.params.location);
	        yelp.search({category_filter: "bars", location: location}, function(error, data) {
	          //console.log(error);
	          if(error) { return handleError(res, error); }
	          var extBars = data.businesses.map(function(item){
	            return {
	                    name: item.name,
	                    url:item.url,
	                    image_url:item.image_url,
	                    snippet: item.snippet_text,
	                    attending: []
	                  };
	          });
	          return res.status(200).json(extBars);
	    	});
        })

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
};

function handleError(res, err) {
  return res.status(500).send(err);
}
