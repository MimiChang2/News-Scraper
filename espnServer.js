//Scraping Tools
var cheerio = require("cheerio");
//var request = require("request");
var axios = require("axios");

var mongoose = require("mongoose");
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");

//Require Models
var db = require("./models");

var PORT = process.env.PORT || 8080;

var MONGODBURI = process.env.MONGODB_URI || "mongodb://heroku_5ffflz78:tltu50cuv2mpqe8osrbdla1lh6@ds135547.mlab.com:35547/heroku_5ffflz78";
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

//Mongoose.Promise allows us to use the .then function
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/Article", {
    //useMongoClient: true
});

// Request to grab HTML body from site 

app.get("/scrape", function(req, res) {

    axios.get("http://www.espn.com/").then(function(response) {
        console.log(response);
        // console.log("logging err")
        // console.log(err);
        var $ = cheerio.load(response.data);

        $("h1.contentItem__title.contentItem__title--story").each(function(i, element) {

            var result = {};

            result.link = "http://www.espn.com" + $(this).parent().parent().attr("href");
            result.title = $(this).text();
            result.summary = $(this).parent().find('p').text();

            //Linking Scrape to Database

            db.Article
                .create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    res.json(err);
                });
        });
    });
});

//res.send("Scraped!");

//Getting Articles from database
app.get("/article", function(req, res) {
    db.Article
        .find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//Get a specific Article by ID and populate w comment
app.get("/article/:id", function(req, res) {
    db.Article
        .findOne({ _id: req.params.id })
        .populate("comments")
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//Saving and updating associated comment
app.post("/article/:id", function(req, res) {
    db.Comment
        .create(req.body)
        .then(function(dbComment) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//Start Server
app.listen(PORT, function() {
    console.log("App Listening on PORT" + PORT);
});
