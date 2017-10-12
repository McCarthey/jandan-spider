const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');

var index = 1;
var url = "http://jandan.net/ooxx/page-" + index + "#comments";
//爬取的页数
var pageMax = 10;
//每页爬取的图片数
var imgMax = 10;

function startRequest(url) {
	http.get(url, function(res) {
		let html = '';
		res.setEncoding('utf-8');
		res.on('data', function(chunk) {
			html += chunk;
		});

		res.on('end', function() {
			let $ = cheerio.load(html);
			for (let i = 0; i < imgMax; i++) {
				let img = $('#comments .text img').eq(i);
				let imgSrc = 'http:' + img.attr('src');
				let img_filename = 'image-' + img.attr('src').split('/').splice(-1);
				console.log(imgSrc);
				request.head(imgSrc, function(err, res, body) {
					if (err) {
						console.log(err);
					}
				});
				request(imgSrc).pipe(fs.createWriteStream('./image/' + img_filename));
			}
		});
	});
}
while (index < pageMax) {
	let url = "http://jandan.net/ooxx/page-" + index + "#comments";
	startRequest(url);
	index++;
}