'use strict';

var path = process.cwd();
// var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var yelpnode = require('yelp');

module.exports = function (app, passport) {

	// function isLoggedIn (req, res, next) {
	// 	if (req.isAuthenticated()) {
	// 		return next();
	// 	} else {
	// 		res.redirect('/login');
	// 	}
	// }

	// var clickHandler = new ClickHandler();

	// app.route('/')
	// 	.get(isLoggedIn, function (req, res) {
	// 		res.sendFile(path + '/public/index.html');
	// 	});
		
    app.route('/')
        .get(function(req, res) {
        	return res.render(path + '/public/index.ejs');
        })
        
    app.route('/api/:location')
        .get(function(req, res) {
        	var yelp = new yelpnode({
		        consumer_key: process.env.YELP_CONSUMER_KEY,
		        consumer_secret: process.env.YELP_CONSUMER_SECRET,
		        token: process.env.YELP_TOKEN,
		        token_secret: process.env.YELP_TOKEN_SECRET
	        });
	        var location = decodeURI(req.params.location);
	        yelp.search({category_filter: "bars", location: location}, function(error, data) {
	          //console.log(error);
	          //if(error) { return handleError(res, error); }
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

	// app.route('/login')
	// 	.get(function (req, res) {
	// 		res.sendFile(path + '/public/login.html');
	// 	});

	// app.route('/logout')
	// 	.get(function (req, res) {
	// 		req.logout();
	// 		res.redirect('/login');
	// 	});

	// app.route('/profile')
	// 	.get(isLoggedIn, function (req, res) {
	// 		res.sendFile(path + '/public/profile.html');
	// 	});

	// app.route('/api/:id')
	// 	.get(isLoggedIn, function (req, res) {
	// 		res.json(req.user.github);
	// 	});

	// app.route('/auth/github')
	// 	.get(passport.authenticate('github'));

	// app.route('/auth/github/callback')
	// 	.get(passport.authenticate('github', {
	// 		successRedirect: '/',
	// 		failureRedirect: '/login'
	// 	}));

	// app.route('/api/:id/clicks')
	// 	.get(isLoggedIn, clickHandler.getClicks)
	// 	.post(isLoggedIn, clickHandler.addClick)
	// 	.delete(isLoggedIn, clickHandler.resetClicks);
};
