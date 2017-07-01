$(document).ready(function() {
    //register new endpoint
    $("#create").click(function() {
        console.log("fui clicado");
        var form_data = {
            "model": $("#model").val(),
            "serialNumber": $("#serialNumber").val(),
            "name": $("#name").val(),
            "processor": $("#processor").val(),
            "memory": $("#memory").val(),
            "hd": $("#hd").val(),
        };
        $.ajax({
            url: '/create_endpoint',
            type: 'post',
            dataType: 'json',
            data: form_data,
            success: function(data) {
                var classType = data.success ? "alert alert-success fade in alert-dismissable" : 
                                               "alert alert-danger fade in alert-dismissable";
                $("#form_submit_result").html(
                    '<div class="'+classType+'">'+
                        '<a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>'+
                        data.message +
                    '</div>'
                );
            }
        });
    });

    function draw_disabled_row(item) {
        var power = item.on ? "On" : "Off";
        var color = "#f2f4ed";
        return '<tr bgcolor="'+color+'">\n' +
                    '<td>'+item.model+'</td>\n' +
                    '<td>'+item.serialNumber+'</td>\n' +
                    '<td>'+item.name+'</td>\n' +
                    '<td>'+item.processor+'</td>\n' +
                    '<td>'+item.memory+'</td>\n' +
                    '<td>'+item.hd+'</td>\n' +
                    '<td>'+item.celsiusDegrees+'</td>\n' +
                    '<td>'+item.user+'</td>\n' +
                    '<td>\n'+
                        '<button type="button" class="btn btn-md" id="power_'+item.id+'"'+
                        ' disabled>' + power + '</button>' +
                    '</td>\n'+
                    '<td>'+
                        '<button type="button" class="btn btn-md" id="edit_'+item.id+'"'+
                        ' disabled>Edit</button>' +
                    '</td>\n' +
                    '<td>' +
                        '<button type="button" class="btn btn-md remove" id="remove_'+item.id+'"'+
                        ' disabled>X</button>' +
                    '</td>\n' +
                '</tr>';
    }

    function draw_enabled_row(item) {
        return '';
    }

    //draw table
    function draw_table() {
        $.ajax({
            url: '/list_endpoints',
            type: 'get',
            success: function(data) {
                console.log(data);
                var data_rows = "";
                data.endpoints.forEach(function(item, index) {
                    data_rows += item.disabled ? draw_disabled_row(item) : draw_enabled_row(item);
                });
                var table_content = 
                    '<div class="panel panel-default">'+
                        '<div class="panel-heading">'+
                            '<h3>We have '+data.endpoints.length+' registered machines</h3>'+
                            '<button type="button" class="btn btn-primary btn-lg" data-toggle="modal"'+
                                    'data-target="#addMachine">' +
                                'Do you want to add one ?'+
                            '</button>'+
                        '</div>'+
                        '<div class="table-responsive">' +
                        '<table class = "table table-fixed">' +
                            '<thead>' +
                                '<tr>' +
                                    '<th>Model</th>' +
                                    '<th>Serial Number</th>' +
                                    '<th>Name</th>' +
                                    '<th>Processor</th>' +
                                    '<th>Memory (GB)</th>' +
                                    '<th>HD (GB)</th>' +
                                    '<th>Celsius Degrees</th>' +
                                    '<th>User</th>' +
                                    '<th>Power</th>' +
                                    '<th>Edit</th>' +
                                    '<th>Remove</th>' +
                                '</tr>' +
                            '</thead>' +
                            '<tbody>' + data_rows + '</tbody>' +
                        '</table>'+
                        '</div>'+
                    '</div>';
                console.log(table_content);
                $("#machines_table").html(table_content);
            }
        });
    }
    draw_table();

    //list all endpoints without user constraints
    setInterval(function() {
        draw_table();
    }, 5000);
});

/*        <div class="col-sm-4">
            <div class="list-group">
                <div class="list-group-item">
                </div>
            </div>
        </div>

*/