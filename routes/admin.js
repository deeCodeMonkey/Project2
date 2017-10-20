var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/portfolio' });
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "dee139139",
    database: "timesheet_qb_db"
});

connection.connect();

//display list of records
router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM projects ORDER BY project_title', (err, rows, fields) => {
        if (err) throw err;
        res.render('admin/index', {
            'projects': rows
        });
    });
});

router.get('/add', function (req, res, next) {
    res.render('admin/add');
});

//enter details for new project
router.post('/add', upload.single('projectimage'), function (req, res, next) {

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
        client_id: req.body.client_id,
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

    /*
    //validation rules
    req.checkBody('project_title', 'Title field is required').notEmpty();
    req.checkBody('task', 'Task field is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        ///////////////////////////need to update for validation
        res.render('admin/add', {
            errors: errors[0].msg,
            title: req.body.title,
            description: req.body.description,
            service: req.body.service,
            client: req.body.client,
            url: req.body.url,
            date: req.body.projectdate
        });
    } else {
        var query = connection.query('INSERT INTO projects SET ?', project, function (err, result) {
            if (err) {
                console.log('Error: ' + err);
            } else {
                console.log('Success: ' + result);
            }
        });
    //req.flash('success_msg', 'Project Added');
        res.redirect('/admin');
    }
    */
    res.redirect('/admin');
    
});

//show form with values for editing
router.get('/edit/:project_id', function (req, res, next) {
    //id= looking for specific project
    connection.query('SELECT * FROM projects WHERE project_id = ?', req.params.project_id, (err, rows, fields) => {
        if (err) throw err;

        var data = rows[0];
        data.date = new Date(data.date).toISOString().slice(0, 10);

        res.render('admin/edit', {
            //getting back one row, needs to be singular 'project'
            'project': data
        });
    });
});

//update with edits to project detail
router.post('/edit/:project_id', upload.single('projectimage'), function (req, res, next) {
    // Get Form Values
    var project = {
        title: req.body.title,
        description: req.body.description,
        service: req.body.service,
        client: req.body.client,
        date: req.body.projectdate,
        url: req.body.url,
       
    };
    // Check Image Upload
    if (req.file) {
        project.image = req.file.filename
    }

    var query = connection.query('UPDATE projects SET ? WHERE id = ' + req.params.id, project, function (err, result) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            console.log('Success: ' + result);
        }
    });

    res.redirect('/admin');
});

//delete record from edit window
router.delete('/delete/:idOfrecord', (req, res) => {
    connection.query('DELETE FROM projects WHERE project_id = ' + req.params.idOfrecord, function (err, result) {
        if (err) throw err;
        console.log('Deleted' + result.affectedRows + 'rows.');
    });
    res.sendStatus(200);
});

module.exports = router;
