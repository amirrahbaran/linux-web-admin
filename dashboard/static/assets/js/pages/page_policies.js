/*
*  NGFW Admin
*  page_policies.js (page_policies.html)
*/

$(function() {
    ngfw_policies.init();
    ngfw_policies.delete_records();
});

ngfw_policies = {
    // init
    init: function() {
        $(document).ready(function() {
            $('#ajaxStatus')
                .ajaxStart(function() {
                    $(this).show();
                })
                .ajaxStop(function() {
                    $(this).hide();
                });
        $.ajax({
            url: 'ajax-gateway.php',
            data: { val : 'Hello world' },
            dataType: 'json',
            success: function(json) {
                // Data processing code
                $('body').append( 'Response value: ' + json.val );
            }
            });                
        });
    },
    // list_records
    list_records: function() {
        $(document).ready(function() {
            
        });
    },
    // delete_records
    delete_records: function() {
        $(document).ready(function() {
            $( document ).on( "click", function( event ) {
                var eventTargetId = event.target.id.split("-");
                if(eventTargetId[0] === "delete_policy_submit") {
                    UIkit.modal.confirm('Are you sure?', function(){ 
                        $.post("php/views/page_policies_del_backend.php",
                        {
                          policy_id: eventTargetId[1]
                        },
                        function(data,status){
                            var message = data.split(",");
                            UIkit.notify({
                                message : message[1],
                                status  : message[0],
                                timeout : 1000,
                                pos     : 'top-center'
                            });
                            if (message[0] === "success") {
                                $( event.target ).closest(".md-card").remove();
                                
                            }
                        });
                    });
                }
                });
            });
    }
};