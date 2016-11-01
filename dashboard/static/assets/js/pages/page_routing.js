/*
*  NGFW Admin
*  page_routing.js (page_routing.html)
*/
var routingModalWindow;

$(function() {
    routing.init();
    routing.save();
    routing.char_words_counter();
    routing.routing_form_validator();
});

routing = {
	init: function() {
    	$(document).ready(function () {
        	routingModalWindow = UIkit.modal("#window_routing");
        	
        	$('a').click(function(){
				// var thisRow = $(this).attr("href");
//        		console.log($(this).attr("id"));
				var eventTargetId = $(this).attr("id").split("-");
				if(eventTargetId[0] === "add_routing") {
					if ( routingModalWindow.isActive() ) {
						routingModalWindow.hide();
					} else {
						routingModalWindow.show();
					}
					$("#window_routing_title").text(" Add new route ");
    				$('#window_routing_status').iCheck('check');
            		$("#window_routing_id").val("0");
        			$("#window_routing_row").val(parseInt($("#records_number").val())+1);
        			$("#window_routing_name").val("");
        			$("#window_routing_desc").val("");
        			$("#window_routing_ipv4addr").val("");
        			$("#window_routing_netmask").val("");
        			$("#window_routing_gateway").val("");
        			$("#window_routing_interface").val("");
//        			$("#window_routing_interface").attr("selected","selected");
        			$("#window_routing_metric").val("0");
        			
		    		$('#window_routing_ipv4addr').ipAddress();
		    		$('#window_routing_netmask').selectize();
		    		$('#window_routing_gateway').ipAddress();
		    		$('#window_routing_interface').selectize();
        			
        			
				} else if(eventTargetId[0] === "edit_routing") {

					if ( routingModalWindow.isActive() ) {
						routingModalWindow.hide();
					} else {
						routingModalWindow.show();
					}
					
					$.getJSON( "/networking/routing/get_edit", {
	            		routingId: eventTargetId[1]
	            	}, function(eth) {
            			$("#window_routing_title").text(" Edit route ( "+eth[0].Name+" ) ");
            			if(eth[0].Status === true)
            				$('#window_routing_status').iCheck('check');
            			else
            				$('#window_routing_status').iCheck('uncheck');
	            		$("#window_routing_id").val(eventTargetId[1]);
            			$("#window_routing_row").val(eventTargetId[1]);
            			$("#window_routing_name").val(eth[0].Name);
            			$("#window_routing_desc").val(eth[0].Description);
            			$("#window_routing_ipv4addr").val(eth[0].IPv4Address);
            			$("#window_routing_netmask").val(eth[0].Netmask);
            			$("#window_routing_gateway").val(eth[0].Gateway);
            			//console.log(eth[0].Interface);
            			$("#window_routing_interface option[value='"+eth[0].Interface+"']").attr("selected","selected");
            			$("#window_routing_metric").val(eth[0].Metric);

            			$('#window_routing_ipv4addr').ipAddress();
    		    		$('#window_routing_netmask').selectize();
    		    		$('#window_routing_gateway').ipAddress();
    		    		$('#window_routing_interface').selectize();
            		});
	            }
			});
    	});
    },
    save: function(){
        $("#window_routing_save").click( function() {
        	var $routingForm = $('#window_routing_form');
            if (( typeof($routingForm[0].checkValidity) == "function" ) && !$routingForm[0].checkValidity()) {
               return;
            }
            
            $('#window_routing_save').addClass("disabled");

        	var routing_status = "off";
        	if($("#window_routing_status").is(':checked'))
        		routing_status = "on";
        	var routing_row = $('#window_routing_row').val();
        	var routing_id = $('#window_routing_id').val();
        	var routing_name = $('#window_routing_name').val();
        	var routing_desc = $('#window_routing_desc').val();
        	var routing_ipv4addr = $('#window_routing_ipv4addr').val();
        	var routing_netmask = $('#window_routing_netmask').val();
        	var routing_gateway = $('#window_routing_gateway').val();
        	var routing_interface = $('#window_routing_interface').val();
        	var routing_metric = $('#window_routing_metric').val();
        	
        	var target_url = '';
        	if ( routing_id === "0" ) {
        		target_url = '/networking/routing/create';
        	} else {
        		target_url = '/networking/routing/update';
        	}
        	
        	$.ajax({
        		type: 'POST',
        		url: target_url,
        		data: { 
        			routingId: routing_id,
        			Status: routing_status,
            		Name: routing_name,
            		Description: routing_desc,
            		IPv4Address: routing_ipv4addr,
            		Netmask: routing_netmask,
            		Gateway: routing_gateway,
            		Interface: routing_interface,
            		Metric: routing_metric
            		},
        		dataType: 'json',
        		success: function(json) {
    				$('#window_routing_save').removeClass("disabled");
    				
    				routingModalWindow.hide();
    				
        			setTimeout(UIkit.notify({
                        message : json.Message,
                        status  : json.Status,
                        timeout : 2000,
                        pos     : 'top-center'
                    }), 5000);
        			
        			if ( routing_id === "0" ) {
        				var status_tooltip = "Disabled";
        				var status_icon = "/static/assets/img/md-images/toggle-switch-off.png";
            			if(json.Record[0].Status === true){
            				status_tooltip = "Enabled";
            				status_icon = "/static/assets/img/md-images/toggle-switch.png";
            			}

        				var link_tooltip = "Gateway is dead";
        				var link_icon = "/static/assets/img/md-images/gateway-off.png";
            			if(json.Record[0].Status === true){
            				link_tooltip = "Gateway is alive";
            				link_icon = "/static/assets/img/md-images/gateway-on.png";
            			}

        				$("ul#record_table").append($('<li>')
        			    .append($('<div>')
    			    		.attr('class', 'md-card')
        			        .append($('<div>')
    			        		.attr('class', 'md-card-content')
    			        		.append($('<div>')
	    			        		.attr({'class':'uk-grid uk-grid-medium','data-uk-grid-margin':'','data-uk-grid-match':"{target:'.md-card'}"})
	    			        		.append($('<div>')
    	    			        		.attr('class','uk-width-medium-2-10 uk-width-small-1-1')
    	    			        		.append($('<div>')
	    	    			        		.attr('class','uk-grid')
	    	    			        		.append($('<div>')
    	    			        				.attr('class','uk-width-1-1')
    	    	    			        		.append($('<span>')
	    	    			        				.attr({'class':'uk-text-large','id':'name-'+routing_row})
	    	    			        				.text(json.Record[0].Name)
    	    			        				)
	    			        				)
	    	    			        		.append($('<div>')
    	    			        				.attr('class','uk-width-1-1')
    	    	    			        		.append($('<span>')
	    	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'description-'+routing_row})
	    	    			        				.text(json.Record[0].Description)
    	    			        				)
	    			        				)
    			        				)
			        				)
			        				.append($('<div>')
    	    			        		.attr('class','uk-width-medium-2-10 uk-width-small-1-1')
    	    			        		.append($('<div>')
	    	    			        		.attr('class','uk-grid')
	    	    			        		.append($('<div>')
    	    			        				.attr('class','uk-width-1-1')
    	    	    			        		.append($('<span>')
	    	    			        				.attr({'class':'uk-text-middle','id':'ipv4address-'+routing_row})
	    	    			        				.text(json.Record[0].IPv4Address)
    	    			        				)
	    			        				)
	    	    			        		.append($('<div>')
    	    			        				.attr('class','uk-width-1-1')
    	    	    			        		.append($('<span>')
	    	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'netmask-'+routing_row})
	    	    			        				.text(json.Record[0].Netmask)
    	    			        				)
	    			        				)
    			        				)
			        				)
			        				.append($('<div>')
    	    			        		.attr('class','uk-width-medium-2-10 uk-width-small-1-1')
    	    			        		.append($('<div>')
	    	    			        		.attr('class','uk-grid')
	    	    			        		.append($('<div>')
    	    			        				.attr('class','uk-width-1-1')
    	    	    			        		.append($('<span>')
	    	    			        				.attr({'class':'uk-text-middle','id':'gateway-'+routing_row})
	    	    			        				.text(json.Record[0].Gateway)
    	    			        				)
	    			        				)
    			        				)
			        				)
			        				.append($('<div>')
    	    			        		.attr('class','uk-width-medium-2-10 uk-width-small-1-1')
    	    			        		.append($('<div>')
	    	    			        		.attr('class','uk-grid')
	    	    			        		.append($('<div>')
    	    			        				.attr('class','uk-width-1-1')
    	    	    			        		.append($('<span>')
	    	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'interface-'+routing_row})
	    	    			        				.text(json.Record[0].Interface)
    	    			        				)
	    			        				)
	    	    			        		.append($('<div>')
    	    			        				.attr('class','uk-width-1-1')
    	    	    			        		.append($('<span>')
	    	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'metric-'+routing_row})
	    	    			        				.text(json.Record[0].Metric)
    	    			        				)
	    			        				)
    			        				)
			        				)
			        				.append($('<div>')
    	    			        		.attr('class','uk-width-medium-2-10 uk-width-small-1-1')
    	    			        		.append($('<div>')
	    			        				.attr({'class':'uk-grid uk-grid-medium','data-uk-grid-margin':'','data-uk-grid-match':"{target:'.md-card'}"})
	    	    			        		.append($('<div>')
    	    			        				.attr('class','uk-width-large-1-5 uk-width-medium-1-2 uk-width-small-1-5')
    	    	    			        		.append($('<a>')
	    	    			        				.attr({
	    	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
    	    			        						'title': status_tooltip,
    	    			        						'href': '#',
    	    			        						'id':'status_anchor-'+routing_row
    	    			        						})
	    			        						.append($('<img>')
    			        								.attr({
    			        									'src': status_icon,
    			        									'alt': status_tooltip,
    			        									'id': 'status_image-'+routing_row
    			        									})
		        									)
	        									)
	    			        				)
	    			        				.append($('<div>')
    	    			        				.attr('class','uk-width-large-1-5 uk-width-medium-1-2 uk-width-small-1-5')
    	    	    			        		.append($('<a>')
	    	    			        				.attr({
	    	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
    	    			        						'title': link_tooltip,
    	    			        						'href': '#',
    	    			        						'id':'link_anchor-'+routing_row
    	    			        						})
	    			        						.append($('<img>')
    			        								.attr({
    			        									'src': link_icon,
    			        									'alt': link_tooltip,
    			        									'id': 'link_image-'+routing_row
    			        									})
		        									)
	        									)
	    			        				)
	    			        				.append($('<div>')
    	    			        				.attr('class','uk-width-large-1-5 uk-width-medium-1-2 uk-width-small-1-5')
    	    	    			        		.append($('<a>')
	    	    			        				.attr({
	    	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
    	    			        						'title': 'Delete',
    	    			        						'href': '#',
    	    			        						'id':'delete_routing-'+routing_row
    	    			        						})
	    			        						.append($('<img>')
    			        								.attr({
    			        									'src': '/static/assets/img/md-images/delete.png',
    			        									'alt': 'Delete'
    			        									})
		        									)
	        									)
	    			        				)
	    			        				.append($('<div>')
    	    			        				.attr('class','uk-width-large-1-5 uk-width-medium-1-2 uk-width-small-1-5')
    	    	    			        		.append($('<a>')
	    	    			        				.attr({
	    	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
    	    			        						'title': 'Edit',
    	    			        						'href': '#',
    	    			        						'id':'edit_routing-'+routing_row
    	    			        						})
	    			        						.append($('<img>')
    			        								.attr({
    			        									'src': '/static/assets/img/md-images/pencil.png',
    			        									'alt': 'Edit'
    			        									})
		        									)
	        									)
	    			        				)
    			        				)
			        				)
	        					)
    						)
		        		)
        			    );
        				
        				$("#records_number").val(routing_row);
        				
        			} else {
//        				routing.loadTable(routing_id);
        				
            			$("#name-"+routing_row).text(json.Record[0].Name);
            			$("#description-"+routing_row).text(json.Record[0].Description);
            			$("#ipv4address-"+routing_row).text(json.Record[0].IPv4Address);
            			$("#netmask-"+routing_row).text(json.Record[0].Netmask);
            			$("#gateway-"+routing_row).text(json.Record[0].Gateway);
            			$("#interface-"+routing_row).text("Interface: "+json.Record[0].Interface);
            			$("#metric-"+routing_row).text("Metric: "+json.Record[0].Metric);
            			
            			if(json.Record[0].Status === true){
            				$("#status_anchor-"+routing_row).attr("title","Enabled");
            				$("#status_image-"+routing_row).attr({"alt":"Enabled", "src":"/static/assets/img/md-images/toggle-switch.png"});
            			} else{
            				$("#status_anchor-"+routing_row).attr("title","Disabled");
            				$("#status_image-"+routing_row).attr({"alt":"Disabled", "src":"/static/assets/img/md-images/toggle-switch-off.png"});
            			}

            			if(json.Record[0].Link === true){
            				$("#link_anchor-"+routing_row).attr("title","Gateway is alive");
            				$("#link_image-"+routing_row).attr({"alt":"Gateway is alive", "src":"/static/assets/img/md-images/gateway-on.png"});
            			} else{
            				$("#link_anchor-"+routing_row).attr("title","Gateway is dead");
            				$("#link_image-"+row_number).attr({"alt":"Gateway is dead", "src":"/static/assets/img/md-images/gateway-off.png"});
            			}
        				
        			}
        		}
    		});
        });
    },
    loadTable: function(row_number) {
    	if(row_number) {
    		$.getJSON( "/networking/routing/get_edit", {
        		routingId: row_number
        	}, function(eth) {
    			$("#name-"+row_number).text(eth[0].Name);
    			$("#description-"+row_number).text(eth[0].Description);
    			$("#ipv4address-"+row_number).text(eth[0].IPv4Address);
    			$("#netmask-"+row_number).text(eth[0].Netmask);
    			$("#gateway-"+row_number).text(eth[0].Gateway);
    			$("#interface-"+row_number).text("Interface: "+eth[0].Interface);
    			$("#metric-"+row_number).text("Metric: "+eth[0].Metric);
    			
    			if(eth[0].Status === true){
    				$("#status_anchor-"+row_number).attr("title","Enabled");
    				$("#status_image-"+row_number).attr({"alt":"Enabled", "src":"/static/assets/img/md-images/toggle-switch.png"});
    			} else{
    				$("#status_anchor-"+row_number).attr("title","Disabled");
    				$("#status_image-"+row_number).attr({"alt":"Disabled", "src":"/static/assets/img/md-images/toggle-switch-off.png"});
    			}

    			if(eth[0].Link === true){
    				$("#link_anchor-"+row_number).attr("title","Gateway is alive");
    				$("#link_image-"+row_number).attr({"alt":"Gateway is alive", "src":"/static/assets/img/md-images/gateway-on.png"});
    			} else{
    				$("#link_anchor-"+row_number).attr("title","Gateway is dead");
    				$("#link_image-"+row_number).attr({"alt":"Gateway is dead", "src":"/static/assets/img/md-images/gateway-off.png"});
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
    routing_form_validator: function() {
        var $formValidate = $('#window_routing_form');

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
