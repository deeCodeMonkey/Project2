var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var multer = require('multer');
//default destination directory for multer
var upload = multer({ dest: './public/images/logos' });

var phantom = require('phantom-render-stream');
var fs = require('fs');
var render = phantom();

var app = express();


app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Middleware, body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Middleware, handle sessions
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));


// Route Files
var routes = require('./routes/index');
var admin = require('./routes/admin');
var company = require('./routes/company');
var invoice = require('./routes/invoice');
app.use('/', routes);
app.use('/admin', admin);
app.use('/company', company);
app.use('/invoice', invoice);


//create pdf from route
app.get('/test', (req, res) => {
    var destination = fs.createWriteStream('out.pdf');
    destination.addListener('finish', () => {
        res.sendFile('./out.pdf');
    });
    render('http://localhost:8080/invoice/100', {
        format: 'pdf'
    }).pipe(destination);

});

app.get('/test1', function (req, res) {
    res.render('invoice', { layout: false });
});


/*
app.get('/pdf/send', function (req, res) {

    nodemailer.createTestAccount((err, account) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'testCo108@gmail.com',
                pass: 'testco888'
            }
        });

        // setup email data 
        let mailOptions = {
            from: " Time'nDinero <testCo108@gmail.com>", 
            to: 'testCo108@gmail.com', 
            subject: "Invoice from Time'nDinero!", 
            text: 'Please see your attached invoice. Prompt payment is appreciated. Thank you!', 
            html: '<p>Please see your attach invoice. Prompt payment is appreciated. Thank you!</p>', 
            attachments: [
                {
                    filename: 'invoice.pdf',
                    path: './invoice.pdf'
                }
            ]
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.redirect('/');
            }
            console.log('Message Sent: ' + info.response);
            res.redirect('/');
        });
    });
});
*/


app.listen(8080, function () {
    console.log('Server started 8080');
});
