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
										//The regex basically matches the first letter of each word within the given string and transforms only that letter to uppercase:
										json.firstname = $('#OneSheetUser_lblName').html().split(" ")[0].toLowerCase().replace (/\b\w/g, function(l){ return l.toUpperCase() });
										json.lastname = $('#OneSheetUser_lblName').html().split(" ")[1].toLowerCase().replace (/\b\w/g, function(l){ return l.toUpperCase() });
										json.agencyname = $('.AgencyName').html();
										//This returns a 2nd possible phone number but only if it is 10 digits , unfortunatly right now it returns as an array or null value but it should return as a string or an empty string
										json.number = $('.oneSheetContactInfo>*:nth-child(7)').html().replace(/\D+/g, '');
										json.altnumber = $('.oneSheetContactInfo>*:nth-child(9)').html().replace(/\D+/g, '')
										json.email = $(".oneSheetContactInfo>span:nth-child(3)").html();
										json.website = $(".oneSheetContactInfo>a").html();


										agencyinfo.push(json);
										if (urls.length == agencyinfo.length) {
											console.log("file written please check project directory for output (filename: agencyinfo.json)")
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
