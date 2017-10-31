var express = require('express');
var router = express.Router();
var connection = require('../model/connection.js');

//show all clients
router.get('/', function(req, res, next) {
    connection.query('SELECT * FROM clients ORDER BY client_id DESC', (err, rows, fields) => {
        if (err) throw err;
        res.render('index', {
            'clients': rows
        });
    });
});



//display all clients with projects
router.get('/api', function (req, res, next) {
    connection.query('SELECT * FROM clients INNER JOIN projects ON clients.client_id = projects.client_id', (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
    });
});


module.exports = router;
