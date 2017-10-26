var express = require('express');
var router = express.Router();
var connection = require('../model/connection.js');

//show clients
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM clients', (err, rows, fields) => {
        if (err) throw err;
        res.render('index', {
            'clients': rows
        });
    });
});

/*
//display list of all task records
router.get('/all', function (req, res, next) {
    connection.query('SELECT * FROM projects ORDER BY project_title', (err, rows, fields) => {
        if (err) throw err;
        //change date format for presenation
        rows.forEach((e) => {
            e.date = new Date(e.date).toISOString().slice(0, 10);
        });
        res.render('admin/index', {
            'projects': rows
        });
    });
});
*/






module.exports = router;
