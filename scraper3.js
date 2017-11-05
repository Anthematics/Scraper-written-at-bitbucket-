'use strict';

let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
let url = "https://nacta.com/nacta-professional-travel-agent-listing";
let agencyinfo = [];
let urls = [];

console.log("jasons scraper written 2017 -> time to get some info")
console.log("Summon CODE MAGIC")

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
										let agentname, agencyname, email, number;
										let json = {
												agencyname: "",
												email: "",
												website: "",
												number: ""
										};
										// use the selector by ID to get the element for the agent name.
										// extract the inner HTML of the element using html cheerio function
										json.agentname = $('#OneSheetUser_lblName').html();

										//json.fullname = json.agentname.split(''),

										json.firstname = json.agentname.split(" ")[0].toLowerCase();

										json.lastname = json.agentname.split(" ")[1].toLowerCase();

										// ^ should perform some REGEX on this name, to parse out first, middle, last names and unnecessary attributes.
										// use the selector by CLASS to get the element for the agent name.
										json.agencyname = $('.AgencyName').html();

										// use nth child selector.
										json.email = $(".oneSheetContactInfo>span:nth-child(3)").html();

										// use selector for "a" href
										json.website = $(".oneSheetContactInfo>a").html();
										// console log the JSON
										json.number = $('.oneSheetContactInfo>*:nth-child(7)').html.

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
