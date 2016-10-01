$(document).ready(function(){
    $("#policies_add_submit").click(function(){
        $.post("php/views/page_blank_backend.php",
        {
          name: "Donald Duck",
          city: "Duckburg"
        },
        function(data,status){
            UIkit.notify({
                message : data,
                status  : status,
                timeout : 1000,
                pos     : 'top-center'
            });
        });
    });
});