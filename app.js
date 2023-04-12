const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const config = require('./config');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// for using static files
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    console.log(firstName, lastName, email);

    const data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    const url = `https://us9.api.mailchimp.com/3.0/lists/${config.listCode}`;
    const options = {
        method: 'POST',
        auth: `ninja09:${config.apiKey}`,
    }

    const request = https.request(url, options, function(response) {
        response.on('data', function(data) {
            console.log('data returned from mailchimp', JSON.parse(data));
            if (response.statusCode === 200) {
                res.sendFile(__dirname + '/success.html');
            } else {
                res.sendFile(__dirname + '/faliure.html');
            }

        });
    });

    request.write(jsonData);
    request.end();
});


//redirecting user to try again is failed

app.post('/faliure', function(req, res){
	res.redirect('/');
});

app.listen(3000, function() {
    console.log('Running on port 3000');
});

//94787ad16992db7aa4843b38f1ce3995-us9
//6e0a000c86