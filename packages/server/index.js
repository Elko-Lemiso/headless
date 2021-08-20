require("@babel/polyfill");
require("dotenv").config();

import api from "./functions/api";
import generateThumbnail from "./functions/generateThumb";

const functions = require("firebase-functions");
const next = require("next");

var dev = process.env.NODE_ENV !== "production";
var app = next({
	dev,
	conf: {
		distDir: "next",
		publicRuntimeConfig: {
			staticFolder: "../../public",
		},
	},
});
var handle = app.getRequestHandler();

exports.api = functions.https.onRequest(api);
exports.generateThumbnail = generateThumbnail;
exports.next = functions.https.onRequest((req, res) => {
	console.log("File: " + req.originalUrl); // log the page.js file that is being requested
	return app.prepare().then(() => handle(req, res));
});
