var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "timesheet_qb_db"
});

connection.connect();

router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM clients', (err, rows, fields) => {
        if (err) throw err;
        res.render('index', {
            'clients': rows
        });
    });
});

//display list of records
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






module.exports = router;
