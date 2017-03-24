
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


//For Github URL: https://api.github.com/
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", "https://api.github.com" + theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

/*
 Returns the user's github profile as JSON to the callback function
 */
function getGitProfileByID(id, callback) {
    if (id) {
        github.users.getById({id: id}).then(function (res) {
            if (typeof callback === "function")
                callback(res);
        });
    }
}
/*
 To iterate Repo names :
 for(repo in res){
 console.log(res[repo].name);
 }
 */
/*
 Function that gets Repositories for a user from github using a username
 */
function getGitReposByUsername(username, callback) {
    httpGetAsync('/users/' + username + '/repos', function (res) {
        var data = JSON.parse(res);
        callback(data);
    });
}

/*
 Returns Git Repositories of the user with the provided ID
 */
function getGitReposByID(id, callback) {
    getGitUsernameByID(id, function (username) {
        getGitReposByUsername(username, callback);
    });
}

/*
 Returns the username of the user with the provided ID
 */
function getGitUsernameByID(id, callback) {
    github.users.getById({id: id}).then(function (profile) {
        callback(profile.login)
    });
}

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
function getRepoContributionStats(owner, repo, callback) {
    httpGetAsync('/repos/' + owner + '/' + repo + '/stats/contributors', function (res) {
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
/*
 getRepoContributionStats('ivanb7','soen341group3',function(res){

 for(author in res){
 console.log(res[author].author.login);
 console.log(res[author].total);
 console.log(res[author].weeks);
 }
 });
 */


module.exports.getGitProfileByID = getGitProfileByID;

