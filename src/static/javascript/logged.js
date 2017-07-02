$(document).ready(function() {
    var fetch_data = true;
    var interval_id = -1;
    var edit_id=-1;

    function power(power_state, id) {
        var endpoint_action = "";
        if(power_state === "Off") {
            endpoint_action = "/turnon";
        } else if(power_state === "On") {
            endpoint_action = "/turnoff";
        }
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

    function edit(id) {
        var form = {};
        form['id'] = id;
        form['model'] = $("#row_"+id).children().eq(0).children().eq(0).val();
        form['serialNumber'] = $("#row_"+id).children().eq(1).children().eq(0).val();
        form['name'] = $("#row_"+id).children().eq(2).children().eq(0).val();
        form['processor'] = $("#row_"+id).children().eq(3).children().eq(0).val();
        form['memory'] = $("#row_"+id).children().eq(4).children().eq(0).val();
        form['hd'] = $("#row_"+id).children().eq(5).children().eq(0).val();
        $.ajax({
            url: '/edit',
            type: 'post',
            dataType: 'json',
            data: form,
            success: function(data) {
                console.log(data.message);
            }
        });
    }

    function remove(id) {
        $.ajax({
            url: '/remove',
            type: 'post',
            dataType: 'json',
            data: {"id":id},
            success: function(data) {
                console.log(data.message);
            }
        });
    }

    function disable_toggle() {
        $("#toggle_fetching_data").attr("disabled", true);
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
            disable_toggle();
        } else if(action === 'remove') {
            remove(id);
            disable_toggle();
        }
    });

    $(document.body).on('click', '#toggle_fetching_data', function() {
        var text = $(this).text();
        if(fetch_data) {
            fetch_data = false;
            $(this).text("Start fetching data");
            $(this).attr('class', 'btn btn-success');
            clearInterval(interval_id);
            $('.item-row').each(function(index, item){
                var current_username = $("#username").text();
                var column_username = $(item).children().eq(7).children().eq(0).attr('value');
                if(current_username === column_username) {
                    $(this).children().eq(0).children().eq(0).attr('disabled', false);
                    $(this).children().eq(1).children().eq(0).attr('disabled', false);
                    $(this).children().eq(2).children().eq(0).attr('disabled', false);
                    $(this).children().eq(3).children().eq(0).attr('disabled', false);
                    $(this).children().eq(4).children().eq(0).attr('disabled', false);
                    $(this).children().eq(5).children().eq(0).attr('disabled', false);
                    $(this).children().eq(8).children().eq(0).attr('disabled', true);
                    $(this).children().eq(9).children().eq(0).attr('disabled', false);
                    $(this).children().eq(10).children().eq(0).attr('disabled', true);
                }
            });
        } else {
            fetch_data = true;
            interval_id = setInterval(function() {
                    draw_table();
            }, 5000);
            $(this).text("Stop fetching data");
            $(this).attr('class', 'btn btn-warning');
            $('.item-row').each(function(index, item){
                var current_username = $("#username").text();
                var column_username = $(item).children().eq(7).children().eq(0).attr('value');;
                if(current_username === column_username) {
                    $(this).children().eq(0).children().eq(0).attr('disabled', true);
                    $(this).children().eq(1).children().eq(0).attr('disabled', true);
                    $(this).children().eq(2).children().eq(0).attr('disabled', true);
                    $(this).children().eq(3).children().eq(0).attr('disabled', true);
                    $(this).children().eq(4).children().eq(0).attr('disabled', true);
                    $(this).children().eq(5).children().eq(0).attr('disabled', true);
                    $(this).children().eq(8).children().eq(0).attr('disabled', false);
                    $(this).children().eq(9).children().eq(0).attr('disabled', true);
                    $(this).children().eq(10).children().eq(0).attr('disabled', false);
                }
            });
        }
    });
    
    //register new endpoint
    $("#create").click(function() {
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

        return '<tr bgcolor="'+color+'" class="item-row" id="row_'+item.id+'">\n' +
                    '<td>'+
                        '<input type="text" class="input-cell form-control" value="'+
                            item.model+
                    '" disabled/>'+
                    '</td>\n' +
                    '<td>'+
                        '<input type="text" class="input-cell form-control" value="'+
                            item.serialNumber+
                    '" disabled/>'+
                    '<td>'+
                        '<input type="text" class="input-cell form-control" value="'+
                        item.name+
                    '" disabled/>' +
                    '<td>'+
                        '<input type="text" class="input-cell form-control" value="'+
                        item.processor+
                    '" disabled/>' +
                    '<td>'+
                        '<input type="text" class="input-cell form-control" value="'+
                        item.memory+
                    '" disabled/>' +
                    '<td>'+
                        '<input type="text" class="input-cell form-control" value="'+
                        item.hd+
                    '" disabled/>' +
                    '<td>'+
                        '<input type="text" class="input-cell form-control" value="'+
                        item.celsiusDegrees+
                    '" disabled/>'+
                    '<td>'+
                        '<input type="text" class="input-cell form-control" value="'+
                        item.user+
                    '" disabled/>' +
                    '<td>\n'+
                        '<button type="button" data-loading-text="<i class=\'fa fa-circle-o-notch fa-spin\'></i>"'+
                        'class="btn btn-md endpoint-action" id="power_'+item.id+'"'+
                        disabled+'>' + power + '</button>' +
                    '</td>\n'+
                    '<td>'+
                        '<button type="button"'+
                        'class="btn btn-md endpoint-action" data-toggle="collapse" id="edit_'+item.id+'"'+
                        'disabled>Edit</button>' +
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
                                    'data-target="#addEndpoint">' +
                                'Do you want to add one ?'+
                            '</button>'+
                            '<div class="btn-space">'+
                            '<button type="button" id="toggle_fetching_data" class="btn btn-warning">'+
                                'Stop fetching data'+
                            '</button>'+
                            '</div>'+
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
    interval_id = setInterval(function() {
                    draw_table();
            }, 5000);
});