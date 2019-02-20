const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const request = require("request");
/*
{{authEndpoint}}/v1/requestToken
*/
const auth_options = {
    method: 'POST',
    url: 'https://auth.exacttargetapis.com/v1/requestToken',
    headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
    },
    body: {
        clientId: 'ly953984jrib62wrltaa4d99',
        clientSecret: 'B1ssz6lsOVtwY6dSP3IXFn9j'
    },
    json: true
};

/**


request({
	url: 'https://yourInstance.salesforce.com/services/data/v20.0/sobjects/Account/ ',
	headers: {
		Authorization: 'Bearer token'
	},
	json: true,
	body: {
		/// body here
	}
})

*/

express()
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/cool', (req, res) => res.send(cool()))
    .get('/helloworld', (req, res) => res.send('hello world'))
    .get('/form', (req, res) => res.render('pages/form'))
    .post('/form', function(req, res) {
        console.log(req.body);
        let phoneDigits = req.body.phone;
        // logic to ping MC & SC here
        request(auth_options, function(error, response, body) {
            if (error) throw new Error(error);
            console.trace(body);
            let token = "Bearer " + body.accessToken;

            const de_insert = {
                method: 'POST',
                url: 'https://www.exacttargetapis.com/hub/v1/dataevents/key:de_adventurers/rowset',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: [{
                    keys: {
                        SubKey: 123
                    },
                    values: {
                        Email: req.body.email,
                        FirstName: req.body.firstname,
                        LastName: req.body.firstname,
                        Phone: phoneDigits,
                        'Zip Code': req.body.zipcode
                    }
                }],
                json: true
            };

            const sms_options = {
                method: 'POST',
                url: 'https://www.exacttargetapis.com/sms/v1/messageContact/MTo3ODow/send',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: {
                    Subscribe: true,
                    Resubscribe: true,
                    mobileNumbers: [phoneDigits],
                    keyword: 'SNAKES',
                    Override: true,
                    messageText: "Throw me the idol! I'll throw you the whip!"
                },
                json: true
            };
            // next call
            request(sms_options, function(err, r, b) {
                if (err) throw new Error(err);

                console.trace(b);
            });
            // next call
            request(de_insert, function(err, r, b) {
                if (err) throw new Error(err);

                console.trace(b);
            });

        });
        res.send('Thanks for submitting a form');
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))



/*
var request = require("request");

var options = { method: 'POST',
  url: 'https://auth.exacttargetapis.com/v1/requestToken',
  headers: 
   { 'Postman-Token': 'b513afc7-fa50-47c6-8f7f-20ea89fff653',
     'Cache-Control': 'no-cache',
     'Content-Type': 'application/json' },
  body: 
   { clientId: 'q4upcyyfbed1ldmj4j8u4l54',
     clientSecret: 'CHh4P3z2icCxKKjUq54q8Cd4' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

*/