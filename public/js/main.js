$(document).ready(function () {
    $('.delete-project').click(function () {
        var id = $(this).data('id');
        console.log('this is from jquery' + id);
        var url = '/admin/delete/' + id;
        if (confirm('Delete Project')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (result) {
                    window.location = '/admin';
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


