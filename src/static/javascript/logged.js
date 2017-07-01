$(document).ready(function() {
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
                $("#form_submit_result").attr("class",
                data.success ? "success" : "error");

                $("#form_submit_result").text(data.message);
                $("#form_submit_result").show().delay(5000).fadeOut();
            }
        });
    });

    //draw table
    function draw_table() {
        $.ajax({
            url: '/list_endpoints',
            type: 'get',
            success: function(data) {
                console.log(data);
                var data_rows = "";
                data.endpoints.forEach(function(item, index) {
                    var power = item.on ? "On" : "Off";
                    var disabled = item.disabled ? "disabled" : "";
                    data_rows += '<tr>' +
                                    '<td align="center">'+item.model+'</td>' +
                                    '<td align="center">'+item.serialNumber+'</td>' +
                                    '<td align="center">'+item.name+'</td>' +
                                    '<td align="center">'+item.processor+'</td>' +
                                    '<td align="center">'+item.memory+'</td>' +
                                    '<td align="center">'+item.hd+'</td>' +
                                    '<td align="center">'+item.celsiusDegrees+'</td>' +
                                    '<td align="center">'+item.user+'</td>' +
                                    '<td align="center">'+power+'</td>'+
                                    '<td align="center">' +
                                        '<input type="button" id="'+item.id+'" value="X" class="remove" '+
                                        disabled + '/>'
                                    '</td>' +
                                '</tr>'
                });
                var table_content = 
                    '<div id="table-wrapper">' +
                        '<div id="table-scroll">' +
                            '<table>' +
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
                                        '<th>Remove</th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody>' + data_rows + '</tbody>' +
                            '</table>' +
                        '</div>' +
                    '</div>';
                $("#machines_list").html(table_content);
            }
        });
    }
    draw_table();

    //list all endpoints without user constraints
    setInterval(function() {
        draw_table();
    }, 5000);
    

});