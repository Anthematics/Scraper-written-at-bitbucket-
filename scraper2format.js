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

										json.firstname = $('#OneSheetUser_lblName').html().split(" ")[0].toLowerCase()
										json.lastname = $('#OneSheetUser_lblName').html().split(" ")[1].toLowerCase()
										// ^ should perform some REGEX on this name, to parse out first, middle, last names and unnecessary attributes.
										// use the selector by CLASS to get the element for the agent name.
										json.agencyname = $('.AgencyName').html();

										json.number = $('.oneSheetContactInfo>*:nth-child(7)').html().replace("(","").replace(")","").replace("-","").replace("-","").trim();
										json.email = $(".oneSheetContactInfo>span:nth-child(3)").html();
										// use selector for "a" href
										json.website = $(".oneSheetContactInfo>a").html();
										// console log the JSON
										agencyinfo.push(json);
										if (urls.length == agencyinfo.length) {
											console.log("file written please check project directory for output")
												fs.writeFile('agencyinfo.json', JSON.stringify(agencyinfo), function (err) {

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
