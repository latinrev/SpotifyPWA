const SM = require("./ServerManager");
const app = new SM(5000, false, "./public").StartServer().GetApp();
const fs = require("fs");
const SW = require("./SpotifyWrapper");
require("dotenv").config();

var redirecturi = "http://localhost:5000/success";
const sw = new SW(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirecturi);

app.get("/login", (req, res) => {
	res.redirect(sw.GetLoginURL());
});

app.get("/success", async (req, res) => {
	const tokenData = await sw.GetAccess(req.query.code);
	const { access_token, refresh_token } = tokenData.data;
	const userInfo = await sw.Get(access_token, "me");
	const { display_name, id } = userInfo.data;
	fs.writeFile(`${display_name}-${id}.spt.json`, JSON.stringify({ access_token, refresh_token }), () => {});
	res.redirect("/");
});
