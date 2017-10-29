var express = require('express');
var router = express.Router();
var connection = require('../model/connection.js');


//generate and display invoice for client
router.get('/:id', function (req, res, next) {
    connection.query('SELECT * FROM projects WHERE client_id =' + req.params.id, (err, rows, fields) => {
        if (err) throw err;
        var total = 0;
        console.log(rows);
        //sum ext_amt for every row 
        rows.map(function (row) { total += row.ext_amt; });
        total = currency(total);
        res.render('invoice/invoice', {
            'client_id': req.params.id,
            'projects': rows,
            'invoice_total': total
        });
    
    });

    /*
    connection.query('SELECT SUM(ext_amt) FROM projects WHERE client_id =' + req.params.id, (err, rows, fields) => {
        if (err) throw err;
        res.render('invoice/invoice', {
            'client_id': req.params.id,
            'projects': rows
        });
        console.log(rows);
    });
    */

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
