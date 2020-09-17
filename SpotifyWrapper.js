const baseURL = "https://api.spotify.com/v1/";
const axios = require("axios").default;

class SpotifyWrapper {
	constructor(client_id, client_secret, redirecturi, scopes) {
		this.client_id = client_id;
		this.client_secret = client_secret;
		this.redirecturi = redirecturi;
		this.scopes = scopes || "user-read-private user-read-email";
	}

	GetLoginURL = () =>
		`https://accounts.spotify.com/authorize?client_id=${this.client_id}&response_type=code&redirect_uri=${this.redirecturi}&scope=${this.scopes} `;
	GetAccess = (code) => {
		return new Promise((resolve, reject) => {
			const params = new URLSearchParams({
				grant_type: "authorization_code",
				code: code,
				redirect_uri: this.redirecturi,
				client_id: this.client_id,
				client_secret: this.client_secret,
			});
			axios
				.post(`https://accounts.spotify.com/api/token`, params, {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				})
				.then((tokenData) => resolve(tokenData))
				.catch((err) => reject(err));
		});
	};
	Get = (token, endpoint, type = "GET") => {
		return new Promise((resolve, reject) => {
			axios
				.get(baseURL + endpoint, { headers: { Authorization: "Bearer " + token } })
				.then((info) => resolve(info))
				.catch((err) => console.log(err));
		});
	};
}

module.exports = SpotifyWrapper;
