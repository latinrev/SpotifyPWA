const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const https = require("https");
var server;
const { isNull } = require("util");
const { readdirSync, readFileSync } = require("fs");
let PORT, Isitsocket, Staticdir, Certificates;

const setStaticDir = () => {
	if (!isNull(Staticdir)) {
		let dir = path.join(__dirname, Staticdir);
		try {
			readdirSync(dir);
			app.use(express.static(path.join(__dirname, Staticdir)));
			return false;
		} catch (error) {
			console.error(`Couldn't find a directory with the name of ${Staticdir}`);
			return true;
		}
	} else {
		console.error("No directory specified");
	}
};

const setSocketServer = (initializedServer) => {
	if (Isitsocket) {
		const io = require("socket.io");
		io(initializedServer);
		initializedServer.listen(PORT);
	}
};

const displayInfoServer = () => {
	console.log(
		`Server running on localhost:${PORT} with ${Isitsocket ? "SocketIO support" : "Express support"} ${
			!isNull(Staticdir)
				? `currently hosting static files located at "${Staticdir}"`
				: "not hosting any static files"
		} serving over ${!isNull(Certificates) ? "HTTPS with certificates" : "HTTP with no certificates"}`
	);
};
const testCertificates = () => {
	if (Certificates != null) {
		try {
			if (Certificates.hasOwnProperty("key") && Certificates.hasOwnProperty("cert")) {
				try {
					Certificates = {
						key: readFileSync(path.join(__dirname, Certificates.key)),
						cert: readFileSync(path.join(__dirname, Certificates.cert)),
					};
				} catch (error) {
					console.error("Couldn't find any certificates with the name of " + JSON.stringify(Certificates));
					return true;
				}
				return false;
			} else {
				throw exception;
			}
		} catch (error) {
			console.error("Error in certificates");
			return true;
		}
	}
};
const SelectServer = () => {
	if (Certificates != null) {
		Isitsocket
			? (server = https.createServer(Certificates, app))
			: https.createServer(Certificates, app).listen(PORT);
	} else {
		Isitsocket ? (server = http.createServer(app)) : app.listen(PORT);
	}
	setSocketServer(server);
};

class ServerHandler {
	constructor(port, isitsocket, staticdir, certificates) {
		PORT = port || 5000;
		Isitsocket = isitsocket || false;
		Staticdir = staticdir || null;
		Certificates = certificates || null;
	}

	SetCertificates = (certificates) => {
		Certificates = certificates;
	};
	SetDirectory = (directory) => {
		Staticdir = directory;
	};
	SetPort = (port) => {
		PORT = port;
	};
	SetUseSocket = (isitsocket) => {
		Isitsocket = isitsocket;
	};
	StartServer = () => {
		let errorChecks = [];

		try {
			errorChecks.push(testCertificates());
			errorChecks.push(setStaticDir(Staticdir));
			SelectServer();
		} catch (error) {
			console.error("Error in constructor please check arguments\n" + "Error reason: " + error);
			errorChecks.push(true);
		}
		let isError = errorChecks.some((curr) => curr === true);
		!isError ? displayInfoServer() : console.error("Couldn't start server");
		return this;
	};
	/**
	 * @returns {(app)} Returns back express app object with type
	 */
	GetApp = () => {
		return app;
	};
	/**
	 * @returns {(express)} Returns back express app object with type
	 */
	GetExpressInstance = () => {
		return express;
	};
	/**
	 * @returns {(io)} Returns back server object with type
	 */
	GetServerConnection = () => {
		return server;
	};
	/**
	 * @returns {(io|express|app)} Returns back server object without type
	 */
	GetAllInstances = () => {
		return { app, express, io };
	};
}

module.exports = ServerHandler;
/*if(!isNull(Certificates) && Isitsocket){
  https.createServer({key:Certificates.key,cert:Certificates.cert},io(server)).listen(PORT, fallback());
}else if(isNull(Certificates) && Isitsocket){
  console.log("No certificates with socket")
  io(https.Server(server)).listen(PORT, fallback());




      if(Certificates != null && Isitsocket){
      io(https.createServer({key:Certificates.key,cert:Certificates.cert},app)).use().
    }else if(Certificates != null && !Isitsocket){
      https.createServer({key:Certificates.key,cert:Certificates.cert},app).listen(PORT, fallback);
    }else if(Certificates === null && !Isitsocket){
      app.listen(PORT, fallback);
    }else if (Certificates === null && Isitsocket){
      io(https.createServer(app)).listen(PORT,fallback)
    }
    return this;

}*/
