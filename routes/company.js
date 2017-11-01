var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/logos' });
var connection = require('../model/connection.js');

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
        contact_person: req.body.contact_person,
        email_address: req.body.email_address,
        phone: req.body.phone,
        mailing_address: req.body.mailing_address,
        logo: logo
    };

    var query = connection.query('INSERT INTO clients SET ?', client, function (err, result) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log('Success: ' + result);
        }
    });
    res.redirect('/company/profile/' + req.body.client_id);
});

//display company info to edit
router.get('/update/:client_id', function (req, res, next) {
    connection.query('SELECT * FROM clients WHERE client_id =' + req.params.client_id, (err, rows, fields) => {
        if (err) throw err;
        res.render('company/edit', {
            'client': rows[0]
        });
        console.log(rows[0]);
    });
});

//update details for new client company
router.post('/save', upload.single('logo'), function (req, res, next) {

    var client = {
        company_name: req.body.company_name,
        contact_person: req.body.contact_person,
        email_address: req.body.email_address,
        phone: req.body.phone,
        mailing_address: req.body.mailing_address
        //do  not add logo to reset by default
    };
    //add only if logo uploaded
    if (req.file) {
        client.logo = req.file.filename;
    }

    var query = connection.query('UPDATE clients SET ? WHERE client_id=' + req.body.client_id, client, function (err, result) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log('Success: ' + result);
        }
    });
    res.redirect('/company/profile/' + req.body.client_id);
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


//display company profile 
router.get('/profile/:id', function (req, res, next) {
    connection.query('SELECT * FROM clients WHERE client_id =' + req.params.id, (err, rows, fields) => {
        if (err) throw err;
        res.render('company/profile', {
            'clients': rows[0]
        });
        console.log(rows[0]);
    });
});

//search bar
router.get('/search', function (req, res, next) {
    var term = req.query.term;
    console.log('Search Term = ' + term);
    connection.query('SELECT company_name, client_id FROM clients WHERE company_name LIKE \'%' + term + '%\'', (err, rows, fields) => {
        if (err) throw err;
        var list = [];
        rows.map(function (row) {
            list.push({ value: row.client_id, label: row.company_name });
        });
        res.json(list);
    });
});


module.exports = router;
