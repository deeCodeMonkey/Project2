var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/portfolio' });
var connection = require('../model/connection.js');


//show form with values for editing
router.get('/edit/:project_id', function (req, res, next) {
    //id= looking for specific project
    connection.query('SELECT * FROM projects WHERE project_id = ?', req.params.project_id, (err, rows, fields) => {
        if (err) throw err;
        
        var data = rows[0];
        //data.date = new Date(data.date).toISOString().slice(0, 10);

        res.render('admin/edit', {
            //getting back one row, needs to be singular 'project'
            'project': data
        });
        //console.log('data is' + data);
    });
});


//update with edits to project detail
router.post('/edit/:id', upload.single('projectimage'), function (req, res, next) {
    // Get Form Values
    var project = {
        //names must match to sql db
        project_title: req.body.title,
        description: req.body.description,
        task: req.body.task,
        hours: req.body.hours,
        rate: req.body.rate,
        notes: req.body.notes,
        client_id: req.body.client_id
    };
    // Check Image Upload
    if (req.file) {
        project.image = req.file.filename
    }

    var query = connection.query('UPDATE projects SET ? WHERE project_id = ' + req.params.id, project, function (err, result) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log('Success: ' + result);
        }
    });

    res.redirect('/admin/' + project.client_id);
});

//delete record from edit window
router.delete('/delete/:idOfrecord', (req, res) => {
    connection.query('DELETE FROM projects WHERE project_id = ' + req.params.idOfrecord, function (err, result) {
        if (err) throw err;
        console.log('Deleted' + result.affectedRows + 'rows.');
    });
    res.sendStatus(200);
});


//display list of tasks of a client
router.get('/:client_id', function (req, res, next) {
    connection.query('SELECT projects.*, clients.* FROM projects INNER JOIN clients ON projects.client_id = clients.client_id WHERE projects.client_id = ?', req.params.client_id, (err, rows, fields) => {

        console.log("-------------------------");
        console.log(rows);
        if (err) throw err;
        //change date format for presenation
        rows.forEach((e) => {
            e.date = new Date(e.date).toISOString().slice(0, 10);
        });
        

        res.render('admin/index', {
            'client_id': req.params.client_id,
            'projects': rows,
            'company_name': rows[0].company_name
        });
        
    });
});


//route to add task for a Client ID
router.get('/add/:client_id', function (req, res, next) {
    res.render('admin/add', {
        'client_id': req.params.client_id,
        'date': new Date().toISOString().slice(0, 10)
    });
});

//enter details for new task add for a Client ID
router.post('/add/:client_id', upload.single('attachment'), function (req, res, next) {

    // Check Image Upload
    if (req.file) {
        var projectAttachment = req.file.attachment
    } else {
        var projectAttachment = 'No Attachment';
    }

    var project = {
        project_title: req.body.title,
        date: req.body.date,
        task: req.body.task,
        description: req.body.description,
        hours: req.body.hours,
        rate: req.body.rate,
        notes: req.body.notes,
        client_id: req.params.client_id,
        attachments: projectAttachment
    };

    var query = connection.query('INSERT INTO projects SET ?', project, function (err, result) {
        if (err) {
            console.log('Error: ' + err);
            console.log(project.date);
        } else {
            console.log('Success: ' + result);
            console.log(project.date);
        }
    });
    res.redirect('/admin/' + req.params.client_id);
});

module.exports = router;
