var express = require('express');
var router = express.Router();
var connection = require('../model/connection.js');


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
