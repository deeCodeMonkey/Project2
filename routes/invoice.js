var express = require('express');
var router = express.Router();
var path = require('path');
var connection = require('../model/connection.js');
var phantom = require('phantom-render-stream');
var fs = require('fs');
var render = phantom();


//generate actual invoice 
router.get('/inv/:id', function (req, res, next) {
    connection.query('SELECT * FROM projects INNER JOIN clients ON projects.client_id = clients.client_id WHERE projects.client_id =' + req.params.id, (err, rows, fields) => {
        if (err) throw err;

        var total = 0;
        console.log(rows);
        //sum ext_amt for every row 
        rows.map(function (row) { total += row.ext_amt; });
        total = currency(total);

        res.render('invoice/invoicePrint', {
            'client_id': req.params.id,
            'projects': rows,
            'invoice_total': total,
            'company_name': rows[0].company_name,
            'contact_person': rows[0].contact_person,
            'mailing_address': rows[0].mailing_address,
            'email_address': rows[0].email_address,
            'phone': rows[0].phone,
            layout: false
        });
    });



});

router.get('/pdf/:id', function (req, res, next) {
    var destination = fs.createWriteStream('out.pdf');
    destination.addListener('finish', () => {
        res.sendFile(path.join(__dirname, '../out.pdf'));
    });
    render('http://localhost:8080/invoice/inv/' + req.params.id, {
        orientation: 'portrait',
        format: 'pdf',
        zoomFactor: 1,
        margin: '1cm',
        width: 1000,
    }).pipe(destination);

});


//generate and display invoice for client
router.get('/:id', function (req, res, next) {
    connection.query('SELECT * FROM projects INNER JOIN clients ON projects.client_id = clients.client_id WHERE projects.client_id =' + req.params.id, (err, rows, fields) => {
        if (err) throw err;

        var total = 0;
        console.log(rows);
        //sum ext_amt for every row 
        rows.map(function (row) { total += row.ext_amt; });
        total = currency(total);

        res.render('invoice/invoice', {
            'client_id': req.params.id,
            'projects': rows,
            'invoice_total': total,
            'company_name': rows[0].company_name,
            'contact_person': rows[0].contact_person,
            'mailing_address': rows[0].mailing_address,
            'email_address': rows[0].email_address,
            'phone': rows[0].phone
        });   
    });
});


var currency = function (num) {
    var str = num.toString();
    var decIndex = str.indexOf('.');
    if (decIndex === -1) {
        decIndex = str.length;
        str += '.00';
    }
    for (var i = decIndex - 3; i > 0; i -= 3) {
        str = str.slice(0, i) + "," + str.slice(i);
    }
    return str;
};



module.exports = router;
