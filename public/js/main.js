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