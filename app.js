const express = require("express");
const parser = require("body-parser");
const https = require("https");
const { response } = require("express");
const app = express();
app.use(parser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, () => {
    console.log("Server Online");
});

app.get("/", (req,res) => {
    res.sendFile(__dirname+"/signup.html");
})

app.post("/process", (req,res) => {
    const fname = req.body.fstname;
    const lname = req.body.lastname;
    const email = req.body.email;
    console.log(req.body.email);
    console.log(email);
    console.log(fname);
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }
    var jsondata = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/1493d2aa19";
    
    const options = {
        method: "POST",
        auth: "Wyvern:470ac9629446210dbc73b4c1efa9f6db-us12"
    }

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            if(response.statusCode === 200){
                res.sendFile(__dirname + "/process.html");
            }else{
                res.sendFile(__dirname + "/fail.html");
            }
        })
    })
    request.write(jsondata);
    request.end();
})

app.post("/failed", (req,res) => {
    res.redirect("/");
})