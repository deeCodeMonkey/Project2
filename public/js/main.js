$(document).ready(function () {
    $('.delete-project').click(function () {
        var project_id = $(this).data('id');
        var client_id = $(this).data('name');
        console.log('this is from jquery' + project_id);
        var url = '/admin/delete/' + project_id;
        if (confirm('Delete Project')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (result) {
                    window.location = '/admin/' + client_id;
                }, error: function (err) {
                    console.log(err);
                }
            });
        } 
    });
});

//expland table for task/project list
$('[data-open-details]').click(function (e) {
    e.preventDefault();
    $(this).next().toggleClass('is-active');
    $(this).toggleClass('is-active');
});

//delete company
$(document).ready(function () {
    $('.delete-icon').click(function () {
        var id = $(this).data('id');
        console.log('this is from jquery' + id);
        var url = '/company/delete/' + id;
        if (confirm('Delete Client')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (result) {
                    window.location = '/';
                }, error: function (err) {
                    console.log(err);
                }
            });
        } 
    });
});


//date of today for invoice
$(document).ready(function () {
    document.getElementById("today").innerHTML = new Date().toISOString().slice(0, 10);
});


//search bar
