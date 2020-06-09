const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(
	"mongodb+srv://auth_angela:0553089970@cluster0-hieqb.mongodb.net/userDB?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);
const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		// minLength: 5,
		// maxLength: 50,
		// unique: true,
	},
	password: {
		type: String,
		// required: true,
		// minLength: 5,
		// maxLength: 1024,
	},
});
var secret = "thisourlittlesecretthatwewanttokeep.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
	res.render("home");
});
app.get("/login", (req, res) => {
	res.render("login");
});
app.get("/register", (req, res) => {
	res.render("register");
});
//! Create new user
app.post("/register", (req, res) => {
	async function createUser() {
		const newUser = await User({
			email: req.body.username,
			password: req.body.password,
		});
		newUser.save((err) => {
			if (err) {
				console.log(err);
			} else {
				res.render("secrets");
			}
		});
	}
	createUser();
});
//! Authenticate the user
app.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	async function findUser() {
		const findUser = await User.findOne(
			{
				email: username,
			},
			(err, result) => {
				if (err) {
					console.log(err);
				} else {
					if (result) {
						if (result.password === password) {
							res.render("secrets");
						}
					}
				}
			}
		);
		console.log("user found");
	}
	findUser();
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`we are listening to the ${port} 👀 ...`);
});
