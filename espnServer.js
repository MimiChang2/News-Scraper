//Mongoose.Promise allows us to use the .then function

var cheerio = require("cheerio");
var request = require("request");

// Request to grab HTML body from site 
request("http://www.espn.com", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var results = [];

    // Select each element in the HTML body. Cheerio selectors function similarly to jQuery
    $("h1.contentItem__title.contentItem__title--story").each(function(i, element) {
        //console.log(element);

        var link = $(element).parent().parent().attr("href");
        var title = $(element).text();
        var summary = $(element).parent().find('p').text();

        // console.log(title);
        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
            title: title,
            summary: summary,
            link: "http://www.espn.com" + link
        });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    console.log(results);
});
