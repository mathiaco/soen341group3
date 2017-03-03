var express = require('express');
var router = express.Router();

//Imports
var request = require('request');
var testAuth = require('../json/test.json');
//Github
var githubAPI = require('github');
//Firebase
var firebase = require('firebase-admin');

var CLIENT_ID = testAuth['client_id'];
var CLIENT_SECRET = testAuth['client_secret'];
var REDIRECT_URL = testAuth['redirect_uri'];
var STATE = testAuth['state'];
var ACCESS_TOKEN;


//Firebase
var db = firebase.database();

//Github
var github = new githubAPI();

//Handles POST requests sent to signup
router.post('/auth/callback',function(req,res){
    res.send('post to callback');
});

//Gets the Code Parameter sent from github and sends a post request to get an access_token.
router.get('/auth/callback', function(req, res) {
    //checks if state matches
    if(req.query.state == testAuth['state']) {
        var session_code = req.query.code;
        //options for the post request
        var options = {
            url: "https://github.com/login/oauth/access_token",
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            form: {
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "redirect_uri": REDIRECT_URL,
                "code": session_code,
                "state": STATE
            }
        };
        //response is named res1 so that it doesn't interfere
        request(options, function postResponse(error, res1, body) {

            //This will be called when a user logs in successfully
            if (!error && res1.statusCode == 200) {
                ACCESS_TOKEN = JSON.parse(body).access_token;

                //GET GIT ACCOUNT INFO (ID, username)
                github.authenticate({
                    type:"oauth",
                    token: ACCESS_TOKEN
                });
                github.users.get({},function(req2,res2){
                    //console.log(JSON.stringify(res2));
                    console.log(res2.login);
                    console.log(res2.id);

                    //Store user info in DB
                    var userID = res2.id;
                    db.ref('users/' + userID).set({
                        login: res2.login,
                        access_token: ACCESS_TOKEN
                    });
                });

                console.log('access_token: ' + ACCESS_TOKEN);
                console.log("Logged in");
                //Redirects the user to the dashboard page after a successful login
                res.redirect('/dashboard');
            } else {
                console.error(error);
                res.redirect('/login');
            }
        });

    }
    else {
        res.send('No state provided');
    }
});



module.exports = router;