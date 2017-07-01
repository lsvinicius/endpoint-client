$(document).ready(function() {

    function power(power_state, id) {
        var endpoint_action = "";
        if(power_state === "Off") {
            endpoint_action = "/turnon";
        } else if(power_state === "On") {
            endpoint_action = "/turnoff";
        }
        console.log(endpoint_action);
        $.ajax({
            url: endpoint_action,
            type: 'post',
            dataType: 'json',
            data: {"id":id},
            success: function(data) {
                console.log(data.message);
            }
        });
    }

    function remove(id) {

    }

    //handle endpoint actions
    $(document.body).on('click', '.endpoint-action', function() {
        var split = $(this).attr('id').split("_");
        var action = split[0];
        var id = split[1];
        var power_state = $(this).text();
        if(action !== 'edit') {
            $(this).button('loading')
        }
        if(action === 'edit') {
            edit(id);
        } else if(action === 'power') {
            power(power_state, id);
        } else if(action === 'remove') {
            remove(id);
        }
    });
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

    function draw_row(item) {
        var power = item.on ? "On" : "Off";
        var color = "#f2f4ed";
        var disabled = item.disabled ? "disabled" : "";
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
                        '<button type="button" data-loading-text="<i class=\'fa fa-circle-o-notch fa-spin\'></i>"'+
                        'class="btn btn-md endpoint-action" id="power_'+item.id+'"'+
                        disabled+'>' + power + '</button>' +
                    '</td>\n'+
                    '<td>'+
                        '<button type="button"'+
                        'class="btn btn-md endpoint-action" id="edit_'+item.id+'"'+
                        disabled+'>Edit</button>' +
                    '</td>\n' +
                    '<td>' +
                        '<button type="button" data-loading-text="<i class=\'fa fa-circle-o-notch fa-spin\'></i>"'+
                        'class="btn btn-md remove endpoint-action" id="remove_'+item.id+'"'+
                        disabled+'>X</button>' +
                    '</td>\n' +
                '</tr>';
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
                    data_rows += draw_row(item);
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