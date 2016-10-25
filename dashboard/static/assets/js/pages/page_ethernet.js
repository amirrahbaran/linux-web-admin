/*
*  NGFW Admin
*  page_ethernet.js (page_ethernet.html)
*/
var ethernetModalWindow, virtualModalWindow;

$(function() {
    networking.init();
    networking.edit();
    networking.add_virtual();
    networking.char_words_counter();
    networking.ethernet_form_validator();
    networking.virtual_form_validator();
});

networking = {
	init: function() {
    	$(document).ready(function () {
    		$('#window_ethernet_ipv4addr').ipAddress();
    		$('#window_ethernet_netmask').selectize();
    		$('#window_ethernet_gateway').ipAddress();
    		$('#window_ethernet_pdns').ipAddress();
    		$('#window_ethernet_sdns').ipAddress();
    		$('#window_virtual_ipv4addr').ipAddress();
    		$('#window_virtual_netmask').selectize();
    		
        	ethernetModalWindow = UIkit.modal("#window_ethernet");
        	virtualModalWindow = UIkit.modal("#window_virtual");
        	
        	$('a').click(function(){
				// var thisRow = $(this).attr("href");
				var eventTargetId = $(this).attr("id").split("-");
	            if(eventTargetId[0] === "edit_ethernet") {

					if ( ethernetModalWindow.isActive() ) {
						ethernetModalWindow.hide();
					} else {
						ethernetModalWindow.show();
					}
					
					$.getJSON( "/networking/ethernet/get_edit", {
	            		EthernetId: eventTargetId[1]
	            	}, function(eth) {
            			if(eth[0].Status === true)
            				$('#window_ethernet_status').iCheck('check');
            			else
            				$('#window_ethernet_status').iCheck('uncheck');
	            		$("#window_ethernet_id").val(eventTargetId[1]);
            			$("#window_ethernet_row").val(eventTargetId[1]);
            			$("#window_ethernet_name").val(eth[0].Name);
            			$("#window_ethernet_title").text(" Ethernet ( "+eth[0].Name+" ) ");
            			$("#window_ethernet_desc").val(eth[0].Description);
            			if(eth[0].DHCP === true)
            				$('#window_ethernet_dhcp').iCheck('check');
            			else
            				$('#window_ethernet_dhcp').iCheck('uncheck');
            			$("#window_ethernet_ipv4addr").val(eth[0].IPv4Address);
            			$("#window_ethernet_netmask").val(eth[0].Netmask);
            			$("#window_ethernet_gateway").val(eth[0].Gateway);
            			if(eth[0].ManualDNS === true)
            				$('#window_ethernet_manualdns').iCheck('check');
            			else
            				$('#window_ethernet_manualdns').iCheck('uncheck');
            			$("#window_ethernet_pdns").val(eth[0].PrimaryDNS);
            			$("#window_ethernet_sdns").val(eth[0].SecondaryDNS);
            			$("#window_ethernet_mtu").val(eth[0].MTU);
            			$("#window_ethernet_mss").val(eth[0].MSS);
            		});
	            }
	            else if(eventTargetId[0] === "add_virtualip") {
					if ( virtualModalWindow.isActive() ) {
						virtualModalWindow.hide();
					} else {
						virtualModalWindow.show();
					}
	            	
        			$("#window_virtual_parentid").val(eventTargetId[1]);
	            }
			});
        	
        	$('#window_ethernet_dhcp').on('ifChecked', function(event){
    		  $('.dhcp-group').hide(500);
    		});
        	
        	$('#window_ethernet_dhcp').on('ifUnchecked', function(event){
        		$('.dhcp-group').show(500);
      		});        	

        	$('#window_ethernet_manualdns').on('ifChecked', function(event){
      		  $('.dns-group').show(500);
      		});
      	
	      	$('#window_ethernet_manualdns').on('ifUnchecked', function(event){
	      		$('.dns-group').hide(500);
    		});        	
    	});
    },
    edit: function(){
        $("#window_ethernet_save").click( function() {
        	var $ethernetForm = $('#window_ethernet_form');
            if (( typeof($ethernetForm[0].checkValidity) == "function" ) && !$ethernetForm[0].checkValidity()) {
               return;
            }
            
            $('#window_ethernet_save').addClass("disabled");

        	var ethernet_status = "off";
        	if($("#window_ethernet_status").is(':checked'))
        		ethernet_status = "on";
        	var ethernet_row = $('#window_ethernet_row').val();
        	var ethernet_id = $('#window_ethernet_id').val();
        	var ethernet_name = $('#window_ethernet_name').val();
        	var ethernet_desc = $('#window_ethernet_desc').val();
        	var ethernet_dhcp = "off";
        	if ($("#window_ethernet_dhcp").is(':checked'))
        		ethernet_dhcp = "on";
        	var ethernet_ipv4addr = $('#window_ethernet_ipv4addr').val();
        	var ethernet_netmask = $('#window_ethernet_netmask').val();
        	var ethernet_gateway = $('#window_ethernet_gateway').val();
        	var ethernet_manualdns = "off";
        	if ($("#window_ethernet_manualdns").is(':checked'))
        		ethernet_manualdns = "on";
        	var ethernet_pdns = $('#window_ethernet_pdns').val();
        	var ethernet_sdns = $('#window_ethernet_sdns').val();
        	var ethernet_mtu = $('#window_ethernet_mtu').val();
        	var ethernet_mss = $('#window_ethernet_mss').val();

        	$.ajax({
        		type: 'POST',
        		url: '/networking/ethernet/ethernet_update',
        		data: { 
        			EthernetId: ethernet_id,
        			Status: ethernet_status,
            		Name: ethernet_name,
            		Description: ethernet_desc,
            		DHCP: ethernet_dhcp,
            		IPv4Address: ethernet_ipv4addr,
            		Netmask: ethernet_netmask,
            		Gateway: ethernet_gateway,
            		ManualDNS: ethernet_manualdns,
            		PrimaryDNS: ethernet_pdns,
            		SecondaryDNS: ethernet_sdns,
            		MTU: ethernet_mtu,
            		MSS: ethernet_mss
            		},
        		dataType: 'json',
        		success: function(json) {
    				$('#window_ethernet_save').removeClass("disabled");
    				
    				ethernetModalWindow.hide();
    				
        			setTimeout(UIkit.notify({
                        message : json.Message,
                        status  : json.Status,
                        timeout : 2000,
                        pos     : 'top-center'
                    }), 5000);
        			
        			networking.loadTable(ethernet_row);
        		}
    		});
        });
    },
    add_virtual: function(){
        $("#window_virtual_save").click(function(){
        	var $virtualForm = $('#window_virtual_form');
            if (( typeof($virtualForm[0].checkValidity) == "function" ) && !$virtualForm[0].checkValidity()) {
               return;
            }
            
            $('#window_virtual_save').addClass("disabled");
            
        	var virtual_parentid = $('#window_virtual_parentid').val();
        	var virtual_desc = $('#window_virtual_desc').val();
        	var virtual_ipv4addr = $('#window_virtual_ipv4addr').val();
        	var virtual_netmask = $('#window_virtual_netmask').val();

        	$.ajax({
        		type: 'POST',
        		url: '/networking/ethernet/add_virtual',
        		data: { 
        			ParentId: virtual_parentid,
            		Description: virtual_desc,
            		IPv4Address: virtual_ipv4addr,
            		Netmask: virtual_netmask
            		},
        		dataType: 'json',
        		success: function(json) {
    	            $('#window_virtual_save').removeClass("disabled");
    	            
    				virtualModalWindow.hide();
    				
        			setTimeout(UIkit.notify({
                        message : json.Message,
                        status  : json.Status,
                        timeout : 2000,
                        pos     : 'top-center'
                    }), 5000);
        			
        			networking.loadTable(ethernet_row);
        		}
    		});        	
        	
        });
    },
    loadTable: function(row_number) {
    	if(row_number)
		{
    		$.getJSON( "/networking/ethernet/get_edit", {
        		EthernetId: row_number
        	}, function(eth) {
    			$("#name-"+row_number).text(eth[0].Name);
    			$("#description-"+row_number).text(eth[0].Description);
    			$("#ipv4address-"+row_number).text(eth[0].IPv4Address);
    			$("#netmask-"+row_number).text(eth[0].Netmask);
    			$("#gateway-"+row_number).text(eth[0].Gateway);
    			$("#primary_dns-"+row_number).text(eth[0].PrimaryDNS);
    			$("#secondary_dns-"+row_number).text(eth[0].SecondaryDNS);
    			$("#mtu-"+row_number).text(eth[0].MTU);
    			$("#mss-"+row_number).text(eth[0].MSS);
    			
    			if(eth[0].Status === true){
    				$("#status_anchor-"+row_number).attr("title","Up");
    				$("#status_image-"+row_number).attr({"alt":"Up", "src":"/static/assets/img/md-images/lan-connect.png"});
    			}
    			else{
    				$("#status_anchor-"+row_number).attr("title","Down");
    				$("#status_image-"+row_number).attr({"alt":"Down", "src":"/static/assets/img/md-images/lan-disconnect.png"});
    			}

    			if(eth[0].DHCP === true){
    				$("#dhcp_anchor-"+row_number).attr("title","Auto");
    				$("#dhcp_image-"+row_number).attr({"alt":"Auto", "src":"/static/assets/img/md-images/server-network.png"});
    			}
    			else{
    				$("#dhcp_anchor-"+row_number).attr("title","Manually");
    				$("#dhcp_image-"+row_number).attr({"alt":"Manually", "src":"/static/assets/img/md-images/server-network-off.png"});
    			}
    		});    			
		}
    },
    // characters/words counter
    char_words_counter: function() {
        var $imputCount = $('.input-count');
        if($imputCount.length) {
            /* http://qwertypants.github.io/jQuery-Word-and-Character-Counter-Plugin/ */
            (function($){"use strict";$.fn.extend({counter:function(options){var defaults={type:"char",count:"down",goal:140,text:true,target:false,append:true,translation:"",msg:"",container_class:""};var $countObj="",countIndex="",noLimit=false,options=$.extend({},defaults,options);var methods={init:function($obj){var objID=$obj.attr("id"),counterID=objID+"_count";methods.isLimitless();$countObj=$("<span id="+counterID+"/>");var counterDiv=$("<div/>").attr("id",objID+"_counter").append($countObj).append(" "+methods.setMsg());if(options.container_class&&options.container_class.length){counterDiv.addClass(options.container_class)}if(!options.target||!$(options.target).length){options.append?counterDiv.insertAfter($obj):counterDiv.insertBefore($obj)}else{options.append?$(options.target).append(counterDiv):$(options.target).prepend(counterDiv)}methods.bind($obj)},bind:function($obj){$obj.bind("keypress.counter keydown.counter keyup.counter blur.counter focus.counter change.counter paste.counter",methods.updateCounter);$obj.bind("keydown.counter",methods.doStopTyping);$obj.trigger("keydown")},isLimitless:function(){if(options.goal==="sky"){options.count="up";noLimit=true;return noLimit}},setMsg:function(){if(options.msg!==""){return options.msg}if(options.text===false){return""}if(noLimit){if(options.msg!==""){return options.msg}else{return""}}this.text=options.translation||"character word left max";this.text=this.text.split(" ");this.chars="s ( )".split(" ");this.msg=null;switch(options.type){case"char":if(options.count===defaults.count&&options.text){this.msg=this.text[0]+this.chars[1]+this.chars[0]+this.chars[2]+" "+this.text[2]}else if(options.count==="up"&&options.text){this.msg=this.text[0]+this.chars[0]+" "+this.chars[1]+options.goal+" "+this.text[3]+this.chars[2]}break;case"word":if(options.count===defaults.count&&options.text){this.msg=this.text[1]+this.chars[1]+this.chars[0]+this.chars[2]+" "+this.text[2]}else if(options.count==="up"&&options.text){this.msg=this.text[1]+this.chars[1]+this.chars[0]+this.chars[2]+" "+this.chars[1]+options.goal+" "+this.text[3]+this.chars[2]}break;default:}return this.msg},getWords:function(val){if(val!==""){return $.trim(val).replace(/\s+/g," ").split(" ").length}else{return 0}},updateCounter:function(e){var $this=$(this);if(countIndex<0||countIndex>options.goal){methods.passedGoal($this)}if(options.type===defaults.type){if(options.count===defaults.count){countIndex=options.goal-$this.val().length;if(countIndex<=0){$countObj.text("0")}else{$countObj.text(countIndex)}}else if(options.count==="up"){countIndex=$this.val().length;$countObj.text(countIndex)}}else if(options.type==="word"){if(options.count===defaults.count){countIndex=methods.getWords($this.val());if(countIndex<=options.goal){countIndex=options.goal-countIndex;$countObj.text(countIndex)}else{$countObj.text("0")}}else if(options.count==="up"){countIndex=methods.getWords($this.val());$countObj.text(countIndex)}}return},doStopTyping:function(e){var keys=[46,8,9,35,36,37,38,39,40,32];if(methods.isGoalReached(e)){if(e.keyCode!==keys[0]&&e.keyCode!==keys[1]&&e.keyCode!==keys[2]&&e.keyCode!==keys[3]&&e.keyCode!==keys[4]&&e.keyCode!==keys[5]&&e.keyCode!==keys[6]&&e.keyCode!==keys[7]&&e.keyCode!==keys[8]){if(options.type===defaults.type){return false}else if(e.keyCode!==keys[9]&&e.keyCode!==keys[1]&&options.type!=defaults.type){return true}else{return false}}}},isGoalReached:function(e,_goal){if(noLimit){return false}if(options.count===defaults.count){_goal=0;return countIndex<=_goal?true:false}else{_goal=options.goal;return countIndex>=_goal?true:false}},wordStrip:function(numOfWords,text){var wordCount=text.replace(/\s+/g," ").split(" ").length;text=$.trim(text);if(numOfWords<=0||numOfWords===wordCount){return text}else{text=$.trim(text).split(" ");text.splice(numOfWords,wordCount,"");return $.trim(text.join(" "))}},passedGoal:function($obj){var userInput=$obj.val();if(options.type==="word"){$obj.val(methods.wordStrip(options.goal,userInput))}if(options.type==="char"){$obj.val(userInput.substring(0,options.goal))}if(options.type==="down"){$countObj.val("0")}if(options.type==="up"){$countObj.val(options.goal)}}};return this.each(function(){methods.init($(this))})}})})(jQuery);

            $imputCount.each(function() {
                var $this = $(this);

                var $thisGoal = $(this).attr('maxlength') ? $(this).attr('maxlength') : 80 ;

                $this.counter({
                    container_class: 'text-count-wrapper',
                    msg: ' / '+$thisGoal,
                    goal: $thisGoal,
                    count: 'up'
                });

                if($this.closest('.md-input-wrapper').length) {
                    $this.closest('.md-input-wrapper').addClass('md-input-wrapper-count')
                }
            })
        }
    },
    ethernet_form_validator: function() {
        var $formValidate = $('#window_ethernet_form');

        $formValidate
        	.parsley()
	        	.on('form:validated',function() {
	                altair_md.update_input($formValidate.find('.md-input-danger'));
	            })
	            .on('field:validated',function(parsleyField) {
	                if($(parsleyField.$element).hasClass('md-input')) {
	                    altair_md.update_input( $(parsleyField.$element) );
	                }
	            });
    },
    virtual_form_validator: function() {
        var $formValidate = $('#window_virtual_form');

        $formValidate
        	.parsley()
	        	.on('form:validated',function() {
	                altair_md.update_input($formValidate.find('.md-input-danger'));
	            })
	            .on('field:validated',function(parsleyField) {
	                if($(parsleyField.$element).hasClass('md-input')) {
	                    altair_md.update_input( $(parsleyField.$element) );
	                }
	            });
    }
};
