var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/logos' });
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "timesheet_qb_db"
});

connection.connect();

//add new client company
router.get('/add', function (req, res, next) {
    res.render('company/add');
});

//enter details for new client company
router.post('/add', upload.single('logo'), function (req, res, next) {

    // Check Image Upload
    if (req.file) {
        var logo = req.file.filename;
    } else {
        var logo = 'NoLogo.jpg';
    }

    var client = {
        client_id: req.body.client_id,
        company_name: req.body.company_name,
        logo: logo
    };

    var query = connection.query('INSERT INTO clients SET ?', client, function (err, result) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log('Success: ' + result);
        }
    });
    res.redirect('/');
});


//delete client company
router.delete('/delete/:idOfrecord', (req, res) => {
    console.log('deleting route ' + req.params.idOfrecord);
    connection.query('DELETE FROM clients WHERE client_id = ' + req.params.idOfrecord, function (err, result) {
        if (err) throw err;
        console.log('Deleted' + result.affectedRows + 'rows.');
    });
    res.sendStatus(200);
});


module.exports = router;
