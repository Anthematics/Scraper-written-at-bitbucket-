let express = require('express');
let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
let app     = express();
app.get('/scrape', function(req, res){
		url = "https://nacta.com/onesheet/?uid=12269&tmpl=component";
		request(url, function(error,response,html){
				if(!error){
						let $ = cheerio.load(html);
						let agentname, agencyname , email, number;
						let json = {
								agentname: "",
								agencyname:"",
								email: "",
								website: "" ,
								number:""
						};
						// use the selector by ID to get the element for the agent name.
						// extract the inner HTML of the element using html cheerio function
						json.agentname = $('#OneSheetUser_lblName').html();
						// ^ should perform some REGEX on this name, to parse out first, middle, last names and unnecessary attributes.
						// use the selector by CLASS to get the element for the agent name.
						json.agencyname = $('.AgencyName').html();

						// use nth child selector.
						json.email = $(".oneSheetContactInfo>span:nth-child(3)").html();

						// use selector for "a" href
						json.website = $(".oneSheetContactInfo>a").html();
						// console log the JSON
						json.number = $('.oneSheetContactInfo>span:nth-child(5)').html();

						console.log(json);


												fs.writeFile('agencyinfo.json', JSON.stringify(json), function(err)  {

														console.log ("file written please check the directory (agencyinfo.json) for output")
												 });
				}
		})
})


app.listen('8081')
console.log('(1) Go to http://localhost:8081/scrape and make sure you are loading the page \n (2) check your terminal if you can see your data \n (3) Open agencyinfo.json for your data');
exports = module.exports = app;
// contactinfo=document.querySelector('.oneSheetContactInfo') (This pulls the whole table)
// agencyname= document..querySelector('.AgencyName')
