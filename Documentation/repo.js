var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var username= require('../user.json');




var requestRepo = {
    url: "https://api.github.com/users/" + username + "/repos",
    method: 'GET',
    headers: {
        'User-Agent': username
    }
};

request(requestRepo, function (error, response, body) {
    fs.writeFileSync(username+"Repos.json", body);

});

var repoData = require('./'+username+'Repos.json');

/* GET profile page. */
router.get('/', function(req, res, next) {
    res.render('templates/repo', { title: repoData,
        user: username
    });
});
module.exports = router;
