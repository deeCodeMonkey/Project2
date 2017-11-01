//delete project
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


    //expland table for task/project list
    $('[data-open-details]').click(function (e) {
        e.preventDefault();
        $(this).next().toggleClass('is-active');
        $(this).toggleClass('is-active');
    });

    
    //delete company per modal
    $('.delete-company').click(function () {
        var id = $(this).val();
        console.log('this is jquery ' + id);
        var url = '/company/delete/' + id;
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (result) {
                    window.location = '/';
                }, error: function (err) {
                    console.log(err);
                }
            });
    });


    //date of today for invoice
    $('#today').html(new Date().toISOString().slice(0, 10));

    //email pdf invoice
    $('#pdfSender').click(function () {
        //to prevent from clicking more than once
        $('#pdfSender').attr("disabled", "disabled");
        $('#emailModal').modal();
        console.log($('#pdfSender').attr('data-id'));
        window.location = '/invoice/pdf/' + $('#pdfSender').attr('data-id');
    });



    //search bar
    var cache = {};
    $("#search").autocomplete({
        minLength: 1,
        delay: 300,
        source: function (request, response) {
            var term = request.term;
            if (term in cache) {
                response(cache[term]);
                return cache[term];
            }

            $.getJSON("/company/search",
                request,
                function (data, status, xhr) {
                    cache[term] = data;
                    response(data);
                    return cache[term];
                });
        },
        select: function (event, ui) {
            window.location = '/company/profile/' + ui.item.value;
            return false;
        }
    });





});



