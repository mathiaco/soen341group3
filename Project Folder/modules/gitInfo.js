/*
 Modules that contains functions to make requests to the github API
 Keep in mind that most functions are asynchronous and require a callback function.
 */

/*
 Github API wrapper initialization
 */
var githubAPI = require('github');
var github = new githubAPI({
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    headers: {
        "user-agent": "Soen341Group3" // GitHub is happy with a unique user agent
    },
    Promise: require('bluebird'),
    followRedirects: true, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
    timeout: 5000
});
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

/*
 Exports the following functions
 */
module.exports = {

//For Github URL: https://api.github.com/
    httpGetAsync:    function httpGetAsync(theUrl, callback)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
            if(xmlHttp.status != 200){
                console.log(xmlHttp.getAllResponseHeaders());
                console.log(xmlHttp.responseText);
            }
        };
        xmlHttp.open("GET", "https://api.github.com" + theUrl + "?client_id=1a06aaabc53efddc299a&client_secret=aef34d6795845a262f4d14ce2efd9c2570bc64cf", true); // true for asynchronous
        xmlHttp.send(null);
    },
    //For Github URL: https://api.github.com/
    httpGetAsyncParams:    function httpGetAsyncParams(theUrl, params, callback)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
            if(xmlHttp.status != 200){
                //console.log(xmlHttp.getAllResponseHeaders());
                console.log(xmlHttp.responseText);
            }
        };
        xmlHttp.open("GET", "https://api.github.com" + theUrl + "?client_id=1a06aaabc53efddc299a&client_secret=aef34d6795845a262f4d14ce2efd9c2570bc64cf" + params, true); // true for asynchronous
        console.log("GET https://api.github.com" + theUrl + "?client_id=1a06aaabc53efddc299a&client_secret=aef34d6795845a262f4d14ce2efd9c2570bc64cf" + params);
        xmlHttp.send(null);
    },

    /*
     Returns the user's github profile as JSON to the callback function
     */
    getGitProfileByID: function getGitProfileByID(id, callback) {
        if (id) {
            github.authenticate({
                type: "oauth",
                key: "1a06aaabc53efddc299a",
                secret: "aef34d6795845a262f4d14ce2efd9c2570bc64cf"
            });
            github.users.getById({id: id}).then(function (res) {
                if (typeof callback === "function")
                    callback(res);
            });
        }
    },
    /*
    Function that gets the users git profile
     */
    getGitProfileByUsername: function getGitProfileByUsername(username, callback) {
        module.exports.httpGetAsync('/users/' + username,function (res) {
            var data = JSON.parse(res);
            console.log(data);
            callback(data);
        });
    },
    /*
     To iterate Repo names :
     for(repo in res){
     console.log(res[repo].name);
     }
     */
    /*
     Function that gets Repositories for a user from github using a username
     */
    getGitReposByUsername: function getGitReposByUsername(username, callback) {
        module.exports.httpGetAsyncParams('/users/' + username + '/repos', "&type=all",function (res) {
            var data = JSON.parse(res);
            callback(data);
        });
    },


    /*
     Returns Git Repositories of the user with the provided ID
     */
    getGitReposByID: function getGitReposByID(id, callback) {
        module.exports.getGitUsernameByID(id, function (username) {
            module.exports.getGitReposByUsername(username, callback);
        });
    },

    /*
     Returns the username of the user with the provided ID
     */
    getGitUsernameByID: function getGitUsernameByID(id, callback) {
        github.users.getById({id: id}).then(function (profile) {
            callback(profile.login)
        });
    },

    /*
     Returns the contributors list with additions, deletions, and commit counts

     Response

     total - The Total number of commits authored by the contributor.

     Weekly Hash (weeks array):

     w - Start of the week, given as a Unix timestamp.
     a - Number of additions
     d - Number of deletions
     c - Number of commits
     */
    getRepoContributionStats: function getRepoContributionStats(owner, repo, callback) {
        module.exports.httpGetAsync('/repos/' + owner + '/' + repo + '/stats/contributors', function (res) {
            var data = JSON.parse(res);
            callback(data);
        });
    }
    /*
     Example of looping through the JSON data for the useful stuff
     for(author in res){
     console.log(res[author].author.login);
     console.log(res[author].total);
     console.log(res[author].weeks);
     }
     */

};

/*
 Example
 module.exports.getRepoContributionStats('ivanb7','soen341group3',function(res){

 for(author in res){
 console.log(res[author].author.login);
 console.log(res[author].total);
 for(week in res[author].weeks){
 console.log(res[author].weeks[week]);
 }
 }
 });
 */


