'use strict';

let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
let url = "https://nacta.com/nacta-professional-travel-agent-listing";
let agencyinfo = [];
let urls = [];

console.log("Jason's scraper written 2017")

request(url, function (error, response, html) {
		if (!error) {
				let $ = cheerio.load(html);

				$(".TravelAgent").each(function () {

						let link = $(this).find("a");
						urls.push(link.attr("href"));
				});

				for (let i = 0; i < urls.length; i++) {
						request("https://nacta.com" + urls[i], function (error, response, html) { //the trick here is to figure out the structure of the url and apply it to the scrape
								if (!error) {
										let $ = cheerio.load(html);
										let firstname,lastname,agencyname,number,email,website;
										let json = {
												firstname: "",
												lastname:"",
												agencyname:"",
												number: "",
												email: "",
												website: "",
										};
										// use the selector by ID to get the element for the agent name.
										// extract the inner HTML of the element using html cheerio function

										json.firstname = $('#OneSheetUser_lblName').html().split(" ")[0].toLowerCase().replace (/\b\w/g, function(l){ return l.toUpperCase() });

										json.lastname = $('#OneSheetUser_lblName').html().split(" ")[1].toLowerCase().replace (/\b\w/g, function(l){ return l.toUpperCase() });



										json.agencyname = $('.AgencyName').html();
										json.number = $('.oneSheetContactInfo>*:nth-child(7)').html().replace("(","").replace(")","").replace("-","").replace("-","").replace(/ /g,'');
										json.email = $(".oneSheetContactInfo>span:nth-child(3)").html();
										json.website = $(".oneSheetContactInfo>a").html();

										agencyinfo.push(json);
										if (urls.length == agencyinfo.length) {
											console.log("file written please check project directory for output")
												fs.writeFile('agencyinfosplit.json', JSON.stringify(agencyinfo), function (err) {

												});
										}

								}
								else
								{
										agencyinfo.push({error: "error occured"});
								}
						});
				}
		}
});
