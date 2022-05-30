const express = require("express");
const https = require("https") 
const axios = require('axios')
const request = require('request')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express()
const { json } = require("express/lib/response");
const port = process.env.PORT || 8080

const DIST = path.join(__dirname , "./dist")
const homePage = path.join(DIST, "index.html")
const successPage = path.join(DIST, "success.html")
const errorPage = path.join(DIST, "error.html")
const nullPage = path.join(DIST, "404.html")
const activeMemberPage = path.join(DIST, "activeMember.html")

app.use(cors());
app.use('/dist', express.static(DIST));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=> {
	res.sendFile(homePage)
})

app.post('/', (req, res)=> {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const userEmail = req.body.userEmail;

	const subscriberData = {
		email_address: userEmail,
		status: "subscribed",
		merge_fields: {
			FNAME: firstName,
			LNAME : lastName
		}
	}
	const jsonStringSubscriberData = JSON.stringify(subscriberData)
	
	mailchimp.setConfig({
		apiKey: "e3a0be586feb4804ac9160c75109a82f-us14",
		server: "us14",
	});
	const listId = "c58721a1fe";

	async function run() {
		try{
			const parsesubscriberData = await JSON.parse(jsonStringSubscriberData)
			const subcriptionResponse = await mailchimp.lists.addListMember(listId, parsesubscriberData);
			console.log( `Successfully added contact as an audience member. The contact's id is ${subcriptionResponse.id}.` );
			res.sendFile(successPage)
		}
		catch(e){
			if(e.response.body.title === "Member Exists"){
				console.log(`Already a member`)
				res.sendFile(activeMemberPage)
			}
			else{
				console.log( `Unable to add contact as an audience member.`, e);
				res.sendFile(errorPage)
			}
		}	
	}
	run();
})

app.post('/error', (req, res)=> {
	res.redirect("/")
})

app.all('*', (req, res) => {
	res.status(404).sendFile(nullPage);
})

app.listen(port, ()=> {
	console.log(`Server listening on port ${port}`)
})
