const dotenv = require("dotenv").config();
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require("twilio")(accountSid, authToken);

function sendMessageFunction(phone, messages) {
	try {
		client.messages
			.create({
				body: messages,
				from: "whatsapp:+14843934574",
				// to: "whatsapp:+523131413031",
				to: "whatsapp:" + phone,
			})
			.then((message) => console.log(message));

		return { message: "success" };
	} catch (error) {
		console.log(error);
	}
}

module.exports = sendMessageFunction;
