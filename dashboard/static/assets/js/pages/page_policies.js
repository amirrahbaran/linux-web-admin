var save_xhr;
var PoliciesModalWindow;
var $PoliciesScheduleSelect, PoliciesScheduleSelect, schedule_xhr;
var $PoliciesSourceZoneSelect, PoliciesSourceZoneSelect, sourcezone_xhr;
var $PoliciesDestinationZoneSelect, PoliciesDestinationZoneSelect, destinationzone_xhr;
var $PoliciesSourceNetworkSelect, PoliciesSourceNetworkSelect, sourcenetwork_xhr;
var $PoliciesDestinationNetworkSelect, PoliciesDestinationNetworkSelect, destinationnetwork_xhr;
var $PoliciesSourceServiceSelect, PoliciesSourceServiceSelect, sourceservice_xhr;
var $PoliciesDestinationServiceSelect, PoliciesDestinationServiceSelect, destinationservice_xhr;
var $PoliciesSnatToSelect, PoliciesSnatToSelect, snatto_xhr;
var $PoliciesDnatToSelect, PoliciesDnatToSelect, dnatto_xhr;
var CurrentPage = 1;

$(function() {
    Policies.loadTable();
    Policies.init();
    Policies.save();
    Policies.char_words_counter();
    Policies.form_validator();
	Policies.loadAllSelects();
	Policies.loadElementsEvent();
});

Policies = {
	init: function() {
    	$(document).ready(function () {
        	PoliciesModalWindow = UIkit.modal("#window_Policies");
    	});
    },
    add: function(){
    	if ( PoliciesModalWindow.isActive() ) {
			PoliciesModalWindow.hide();
		} else {
			PoliciesModalWindow.show();
		}
		$("#window_policies_title").text(" Add new policy ");
		$("#window_policies_id").val("0");
		$("#window_policies_row").val(parseInt($("#records_number").val())+1);
		$("#window_policies_status").iCheck('check');
		$("#window_policies_log").iCheck('uncheck');
		$("#window_policies_name").val("");
		$("#window_policies_desc").val("");
		$("#window_policies_action_accept").iCheck('check');
		PoliciesScheduleSelect.setValue();
		PoliciesSourceZoneSelect.setValue();
		PoliciesSourceNetworkSelect.setValue();
		PoliciesSourceServiceSelect.setValue();
		PoliciesDestinationZoneSelect.setValue();
		PoliciesDestinationNetworkSelect.setValue();
		PoliciesDestinationServiceSelect.setValue();
		$("#window_policies_snatenabled").iCheck('unckeck');
		$("#window_policies_snatpolicy_snat").iCheck('disable');
		PoliciesSnatToSelect.setValue();
		PoliciesSnatToSelect.disable();
		$("#window_policies_snatpolicy_masq").iCheck('disable');
		$("#window_policies_snatpolicy_masq").iCheck('ckeck');
		$("#window_policies_dnatenabled").iCheck('unckeck');
		PoliciesDnatToSelect.setValue();
		PoliciesDnatToSelect.disable();
		$("#window_policies_name").focus();
    },
    edit: function(obj){
		var $eventTargetId = obj.id.split("-");
		if ( PoliciesModalWindow.isActive() ) {
			PoliciesModalWindow.hide();
		} else {
			PoliciesModalWindow.show();
		}

		$.getJSON( "/policies/view", {
    		PoliciesId: $eventTargetId[2]
    	}, function(record) {
			$("#window_policies_title").text(" Edit policy ( "+record[0].Name+" ) ");
    		$("#window_policies_id").val(record[0].PoliciesId);
			$("#window_policies_row").val($eventTargetId[1]);

			if (record[0].Status === true) {
				$('#window_policies_status').iCheck('check');
            }

			if (record[0].Log === true) {
				$('#window_policies_log').iCheck('check');
            }


			$("#window_policies_name").val(record[0].Name);
			$("#window_policies_desc").val(record[0].Description);

			switch (record[0].Action) {
				case "accept":
					$('#window_policies_action_accept').iCheck('check');
					break;
				case "drop":
					$('#window_policies_action_drop').iCheck('check');
					break;
				case "reject":
					$('#window_policies_action_reject').iCheck('check');
					break;
			}
            PoliciesScheduleSelect.setValue([record[0].Schedule]);
            PoliciesSourceZoneSelect.setValue([record[0].SourceZone]);
            PoliciesSourceNetworkSelect.setValue([record[0].SourceNetwork]);
            PoliciesSourceServiceSelect.setValue([record[0].SourceService]);
            PoliciesDestinationZoneSelect.setValue([record[0].DestinationZone]);
            PoliciesDestinationNetworkSelect.setValue([record[0].DestinationNetwork]);
            PoliciesDestinationServiceSelect.setValue([record[0].DestinationService]);

            if (record[0].SnatEnabled === true) {
				$('#window_policies_snatenabled').iCheck('check');
				switch (record[0].SnatPolicy) {
					case "snat":
						$('#window_policies_snatpolicy_snat').iCheck('check');
            			PoliciesSnatToSelect.setValue([record[0].SnatTo]);
						break;
					case "masq":
						$('#window_policies_snatpolicy_masq').iCheck('check');
						break;
				}
			}
            if (record[0].DnatEnabled === true) {
                $('#window_policies_dnatenabled').iCheck('check');
                PoliciesDnatToSelect.setValue([record[0].DnatTo]);
            }
		});
		$("#window_policies_name").focus();
    },
    remove: function(obj){
    	var $eventTarget = obj;
    	var $eventTargetId = obj.id.split("-");
    	UIkit.modal.confirm('Are you sure you want to delete this item?', function(){
        	$.ajax({
        		type: 'POST',
        		url: "/policies/delete",
        		data: {
        			PoliciesId: $eventTargetId[2],
            		},
        		dataType: 'json',
        		success: function(json) {
        			setTimeout(UIkit.notify({
                        message : json.Message,
                        status  : json.Status,
                        timeout : 2000,
                        pos     : 'top-center'
                    }), 5000);
                	if ( json.Result === "OK" ){
	    				$eventTarget.closest("li").remove();
	    				$("#records_number").val(parseInt($("#records_number").val())-1);
            			Policies.reloadTable(CurrentPage);
                	}
        		}
        	});
        });
    },
    isNotValid: function($FieldName){
    	var FieldInstance = $FieldName.parsley();
    	return !FieldInstance.isValid();
    },
    save: function(){
        $("#window_policies_save").click( function() {
        	var row_number = $('#window_policies_row').val();
        	var policies_id = $('#window_policies_id').val();

			var policies_status = "off";
        	if($("#window_policies_status").is(':checked'))
        		policies_status = "on";

			var policies_log = "off";
        	if($("#window_policies_log").is(':checked'))
        		policies_log = "on";

			var $FieldName = "";
			$FieldName = $('#window_policies_name');
			if (Policies.isNotValid($FieldName)) return;
			var policies_name = $FieldName.val();

			$FieldName = $('#window_policies_desc');
			if (Policies.isNotValid($FieldName)) return;
			var policies_desc = $FieldName.val();

			var policies_action = "accept";
        	if ($("#window_policies_action_drop").is(':checked')) {
                policies_action = "drop";
            } else if ($("#window_policies_action_reject").is(':checked')) {
        		policies_action = "reject";
			}

			var policies_schedule = PoliciesScheduleSelect.getValue();
			var policies_sourcezone = PoliciesSourceZoneSelect.getValue();
			var policies_sourcenetwork = PoliciesSourceNetworkSelect.getValue();
			var policies_sourceservice = PoliciesSourceServiceSelect.getValue();
			var policies_destinationzone = PoliciesDestinationZoneSelect.getValue();
			var policies_destinationnetwork = PoliciesDestinationNetworkSelect.getValue();
			var policies_destinationservice = PoliciesDestinationServiceSelect.getValue();

			var policies_snatenabled = "off";
			var policies_dnatenabled = "off";
			var policies_snatpolicy = "";
			var policies_snatto = "";
			var policies_dnatto = "";
            $('#window_policies_snatenabled').on('ifChecked', function(event) {
				policies_snatenabled = "on";
				$('#window_policies_snatpolicy_snat').on('ifChecked', function(event) {
					policies_snatpolicy = "snat";
					policies_snatto = PoliciesSnatToSelect.getValue();
				});
				$('#window_policies_snatpolicy_masq').on('ifChecked', function(event) {
					policies_snatpolicy = "masq";
				});
            });

            $('#window_policies_snatenabled').on('ifChecked', function(event) {
				policies_dnatenabled = "on";
				policies_dnatto = PoliciesDnatToSelect.getValue();
            });

            $('#window_policies_save').addClass("disabled");

        	var target_url = '';
        	if ( policies_id === "0" ) {
        		target_url = '/policies/create';
        	} else {
        		target_url = '/policies/update';
        	}

        	save_xhr && save_xhr.abort();
            save_xhr = $.ajax({
        		type: 'POST',
        		url: target_url,
        		data: {
        			PoliciesId: policies_id,
            		Status: policies_status,
            		Log: policies_log,
            		Name: policies_name,
            		Description: policies_desc,
            		Action: policies_action,
					Schedule: policies_schedule,
					SourceZone: policies_sourcezone,
					SourceNetwork: policies_sourcenetwork,
					SourceService: policies_sourceservice,
					DestinationZone: policies_destinationzone,
					DestinationNetwork: policies_destinationnetwork,
					DestinationService: policies_destinationservice,
					SnatEnabled: policies_snatenabled,
					SnatPolicy: policies_snatpolicy,
					SnatTo: policies_snatto,
					DnatEnabled: policies_dnatenabled,
            		DnatTo: policies_dnatto
        		},
        		dataType: 'json',
        		success: function(json) {
    				$('#window_policies_save').removeClass("disabled");
        			if (json.Result == "OK") {
        				PoliciesModalWindow.hide();
                        Policies.reloadTable(CurrentPage);
            			setTimeout(UIkit.notify({
                            message : json.Message,
                            status  : json.Status,
                            timeout : 2000,
                            pos     : 'top-center'
                        }), 5000);
        			} else {
        				if (json.Result == "DUP"){
        					$("#invalid-form-error-message").text(json.Message);
        					$("#window_policies_name").select();
        					Policies.fadeInvalidFormErrorMessage();
        				}
        			}
        		}
    		});
        });
    },
	loadAllSelects: function(){
		Policies.initScheduleSelect();
		Policies.initSourceZoneSelect();
		Policies.initDestinationZoneSelect()
		Policies.initSourceNetworkSelect();
		Policies.initDestinationNetworkSelect();
		Policies.initSourceServiceSelect();
		Policies.initDestinationServiceSelect();
		Policies.initSnatToSelect();
		Policies.initDnatToSelect();
    },
	unloadAllSelects: function(){
		PoliciesScheduleSelect.destroy();
		PoliciesSourceZoneSelect.destroy();
		PoliciesDestinationZoneSelect.destroy();
		PoliciesSourceNetworkSelect.destroy();
		PoliciesDestinationNetworkSelect.destroy();
		PoliciesSourceServiceSelect.destroy();
		PoliciesDestinationServiceSelect.destroy();
		PoliciesSnatToSelect.destroy();
		PoliciesDnatToSelect.destroy();
    },
    refreshTable: function() {
		$("#record_table li:first:contains('No data')").remove();
    	if($("#records_number").val() == "0") {
    		$("ul#record_table").append($('<li>')
    			    .append($('<div>')
    		    		.attr('class', 'md-card')
    			        .append($('<div>')
    		        		.attr('class', 'md-card-content')
    		        		.append($('<div>')
    			        		.attr({'class':'uk-grid uk-grid-medium','data-uk-grid-margin':'','data-uk-grid-match':"{target:'.md-card'}"})
    			        		.append($('<div>')
			        				.attr('class','uk-width-1-1 uk-text-center')
	    			        		.append($('<span>')
    			        				.attr('class','uk-text-large uk-text-bold uk-text-danger')
    			        				.text("No data available!")
			        				)
		        				)
	        				)
        				)
    				)
				);
    		$("ul#pagination").empty();
    	}
    },
	clearTable: function() {
		$("ul#record_table").empty();
		$("ul#pagination").empty();
	},
    loadPagination: function (current_page, page_size, total_records) {
		if (total_records === 0) return false;
    	total_pages = Math.ceil(total_records/page_size);
    	var first_page = ( current_page <= 1 );
		var last_page = ( current_page >= total_pages );
		var previous_page = current_page - 1;
		var next_page = current_page + 1;

		if (first_page) {
			$("ul#pagination")
				.append($('<li>')
					.attr('class','uk-disabled')
					.append($('<span>')
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-left')
						)
					)
				)
				.append($('<li>')
					.attr('class','uk-disabled')
					.append($('<span>')
						.append($('<i>')
							.attr('class', 'uk-icon-angle-left')
						)
					)
				);
		} else {
			$("ul#pagination")
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'Policies.reloadTable( 1,' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-left')
						)
					)
				)
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'Policies.reloadTable('+ previous_page + ',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-left')
						)
					)
				);
		}

		for (index_page = 1 ; index_page < total_pages + 1; index_page++) {
			if (current_page == index_page) {
				$("ul#pagination")
					.append($('<li>')
						.attr('class','uk-active')
						.append($('<span>')
							.text(index_page)
						)
					)
			} else {
				$("ul#pagination")
					.append($('<li>')
						.append($('<a>')
							.attr({'href':'#','onclick':'Policies.reloadTable('+index_page+','+page_size+')'})
							.text(index_page)
						)
					)
			}
		}

		if (last_page) {
			$("ul#pagination")
				.append($('<li>')
					.attr('class','uk-disabled')
					.append($('<span>')
						.append($('<i>')
							.attr('class', 'uk-icon-angle-right')
						)
					)
				)
				.append($('<li>')
					.attr('class','uk-disabled')
					.append($('<span>')
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-right')
						)
					)
				);
		} else {
			$("ul#pagination")
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'Policies.reloadTable('+ next_page + ',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-right')
						)
					)
				)
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'Policies.reloadTable( '+ total_pages +',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-right')
						)
					)
				);
		}
		CurrentPage = current_page;
    },
	reloadTable: function (page_number,page_size) {
    	Policies.clearTable();
		Policies.loadTable(page_number,page_size);
    },
    loadTable: function (page_number,page_size) {
    	if ($( "#page_size" ).length) {
			$('#page_size').selectize({
				plugins: {
					'remove_button': {
						label: ''
					}
				},
				options: [
					{id: 5, title: '5'},
					{id: 10, title: '10'},
					{id: 25, title: '25'},
					{id: 50, title: '50'},
					{id: 100, title: '100'},
					{id: 250, title: '250'},
					{id: 500, title: '500'}
				],
				maxItems: 1,
				valueField: 'id',
				labelField: 'title',
				searchField: 'title',
				create: false,
				onDropdownOpen: function ($dropdown) {
					$dropdown
						.hide()
						.velocity('slideDown', {
							begin: function() {
								$dropdown.css({'margin-top': '0'})
							},
							duration: 200,
							easing: easing_swiftOut
						})
				},
				onDropdownClose: function ($dropdown) {
					$dropdown
						.show()
						.velocity('slideUp', {
							complete: function() {
								$dropdown.css({'margin-top': ''})
							},
							duration: 200,
							easing: easing_swiftOut
						})
				},
				onChange: function() {
					Policies.reloadTable(CurrentPage);
				}
			});
			$('#page_size option:selected').each(function() {
				page_size = $(this).text();
			});
		}
    	page_number = typeof page_number !== 'undefined' ? page_number : 1;
  		page_size = typeof page_size !== 'undefined' ? page_size : 5;

        var start_index = ((page_number - 1) * page_size);
        var total_record_count = 0;
        var TheCurrentPageDoesNotHaveAnyRecordAndMustLoadThePreviousPageRecords = false;
    	$.ajax({
    		type: 'GET',
    		url: "/policies/read",
    		data: {
    			StartIndex: start_index,
    			PageSize: page_size
        		},
    		dataType: 'json',
    		success: function(json) {
    			total_record_count = json.TotalRecordCount;
    			TheCurrentPageDoesNotHaveAnyRecordAndMustLoadThePreviousPageRecords =
                    (json.Records.length != total_record_count) &&
                    (json.Records.length === 0 && total_record_count !== 0);

    			if (TheCurrentPageDoesNotHaveAnyRecordAndMustLoadThePreviousPageRecords) {
    			    Policies.loadTable(--page_number,page_size);
                } else {
                    Policies.perform(json.Records,"drawTable");
                    Policies.loadPagination(page_number,page_size,total_record_count);
                }
    		}
		});
    },
    perform: function (recordList,what) {
    	var row_number = $('#window_policies_row').val(); // for addRow and editRow
		if (what === "drawTable")
			row_number = 0;
		$.each(recordList, function(eachRecordIndex, eachRecord) {
			if (what === "drawTable")
				row_number = eachRecordIndex + 1;
			// else addRow and editRow

			if (what === "editRow") {
    			$("#name-"+row_number).text(eachRecord.Name);
    			$("#description-"+row_number).text(eachRecord.Description);
    			$("#action-"+row_number).text("Action: "+eachRecord.Action);
    			$("#schedule-"+row_number).text("Schedule: "+eachRecord.Schedule);
    			$("#sourcezone-"+row_number).text("SourceZone: "+eachRecord.SourceZone);
    			$("#sourcenetwork-"+row_number).text(eachRecord.SourceNetwork);
    			$("#sourceservice-"+row_number).text(eachRecord.SourceService);
    			$("#destinationzone-"+row_number).text(eachRecord.DestinationZone);
    			$("#destinationnetwork-"+row_number).text(eachRecord.DestinationNetwork);
    			$("#destinationservice-"+row_number).text(eachRecord.DestinationService);

				if(eachRecord.Status === true){
    				$("#status_anchor-"+row_number).attr("title","Enabled");
    				$("#status_image-"+row_number).attr({"alt":"Enabled", "src":"/static/assets/img/md-images/toggle-switch.png"});
    			} else{
    				$("#status_anchor-"+row_number).attr("title","Disabled");
    				$("#status_image-"+row_number).attr({"alt":"Disabled", "src":"/static/assets/img/md-images/toggle-switch-off.png"});
    			}

    			if(eachRecord.Log === true){
    				$("#log_anchor-"+row_number).attr("title","Log is on");
    				$("#log_image-"+row_number).attr({"alt":"Log is on", "src":"/static/assets/img/md-images/gateway-on.png"});
    			} else{
    				$("#log_anchor-"+row_number).attr("title","Log is off");
    				$("#log_image-"+row_number).attr({"alt":"Log is off", "src":"/static/assets/img/md-images/gateway-off.png"});
    			}

    			// if(eachRecord.SnatEnabled === true){
    			// 	$("#snat_anchor-"+row_number).attr("title","NAT is on");
    			// 	$("#snat_image-"+row_number).attr({"alt":"NAT is on", "src":"/static/assets/img/md-images/gateway-on.png"});
    			// } else{
    			// 	$("#snat_anchor-"+row_number).attr("title","NAT is off");
    			// 	$("#snat_image-"+row_number).attr({"alt":"NAT is off", "src":"/static/assets/img/md-images/gateway-off.png"});
    			// }
                //
    			// if(eachRecord.DnatEnabled === true){
    			// 	$("#dnat_anchor-"+row_number).attr("title","Publish is on");
    			// 	$("#dnat_image-"+row_number).attr({"alt":"Publish is on", "src":"/static/assets/img/md-images/gateway-on.png"});
    			// } else{
    			// 	$("#dnat_anchor-"+row_number).attr("title","Publish is off");
    			// 	$("#dnat_image-"+row_number).attr({"alt":"Publish is off", "src":"/static/assets/img/md-images/gateway-off.png"});
    			// }

			} else { // for addRow and drawTable
				var status_tooltip = "Disabled";
				var status_icon = "/static/assets/img/md-images/toggle-switch-off.png";
				if(eachRecord.Status === true){
					status_tooltip = "Enabled";
					status_icon = "/static/assets/img/md-images/toggle-switch.png";
				}

				var log_tooltip = "Log is off";
				var log_icon = "/static/assets/img/md-images/gateway-off.png";
				if(eachRecord.Log === true){
					log_tooltip = "Log is on";
					log_icon = "/static/assets/img/md-images/gateway-on.png";
				}


				$("ul#record_table").append($('<li>')
			    .append($('<div>')
		    		.attr('class', 'md-card')
			        .append($('<div>')
		        		.attr('class', 'md-card-content')
		        		.append($('<div>')
			        		.attr({'class':'uk-grid uk-grid-medium','data-uk-grid-margin':'','data-uk-grid-match':"{target:'.md-card'}"})
			        		.append($('<div>')
				        		.attr('class','uk-width-2-10')
				        		.append($('<div>')
	    			        		.attr('class','uk-grid')
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-large','id':'name-'+row_number})
	    			        				.text(eachRecord.Name)
				        				)
			        				)
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small uk-text-truncate','id':'description-'+row_number})
	    			        				.text(eachRecord.Description)
				        				)
			        				)
		        				)
	        				)
	        				.append($('<div>')
				        		.attr('class','uk-width-3-10')
				        		.append($('<div>')
	    			        		.attr('class','uk-grid')
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'sourcenetwork-'+row_number})
	    			        				.text(eachRecord.SourceNetwork)
				        				)
			        				)
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'sourcezone-'+row_number})
	    			        				.text(eachRecord.SourceZone)
				        				)
			        				)
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'sourceservice-'+row_number})
	    			        				.text(eachRecord.SourceService)
				        				)
			        				)
		        				)
	        				)
	        				.append($('<div>')
				        		.attr('class','uk-width-3-10')
				        		.append($('<div>')
	    			        		.attr('class','uk-grid')
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'destinationnetwork-'+row_number})
	    			        				.text(eachRecord.DestinationNetwork)
				        				)
			        				)
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'destinationzone-'+row_number})
	    			        				.text(eachRecord.DestinationZone)
				        				)
			        				)
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'destinationservice-'+row_number})
	    			        				.text(eachRecord.DestinationService)
				        				)
			        				)
		        				)
	        				)
	        				.append($('<div>')
				        		.attr('class','uk-width-2-10')
				        		.append($('<div>')
			        				.attr({'class':'uk-grid uk-grid-medium','data-uk-grid-margin':'','data-uk-grid-match':"{target:'.md-card'}"})
									.append($('<div>')
				        				.attr('class','uk-width-1-4')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': status_tooltip,
				        						'style':'cursor:default;',
				        						'href': '#',
				        						'id':'status_anchor-'+row_number+'-'+eachRecord.PoliciesId
				        						})
			        						.append($('<img>')
		        								.attr({
		        									'src': status_icon,
		        									'alt': status_tooltip,
		        									'id': 'status_image-'+row_number+'-'+eachRecord.PoliciesId
		        									})
	    									)
										)
			        				)
			        				.append($('<div>')
				        				.attr('class','uk-width-1-4')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': log_tooltip,
				        						'style':'cursor:default;',
				        						'href': '#',
				        						'id':'log_anchor-'+row_number+'-'+eachRecord.PoliciesId
				        						})
			        						.append($('<img>')
		        								.attr({
		        									'src': log_icon,
		        									'alt': log_tooltip,
		        									'id': 'link_image-'+row_number+'-'+eachRecord.PoliciesId
		        									})
	    									)
										)
			        				)
									.append($('<div>')
				        				.attr('class','uk-width-1-4')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': 'Delete',
				        						'onclick':'Policies.remove(this)',
				        						'href': '#',
				        						'id':'delete_Policies-'+row_number+'-'+eachRecord.PoliciesId
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
				        				.attr('class','uk-width-1-4')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': 'Edit',
				        						'onclick':'Policies.edit(this)',
				        						'href': '#',
				        						'id':'edit_Policies-'+row_number+'-'+eachRecord.PoliciesId
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
				$("#records_number").val(row_number);
			}
		});
		Policies.refreshTable();
    },
    initScheduleSelect: function() {
    	$PoliciesScheduleSelect = $('#window_policies_schedule').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 1,
            valueField: 'value',
            labelField: 'name',
            searchField: ['name', 'value'],
			options: [],
			render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.value ? '<span class="email">' + escape(item.value) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.value;
                    var caption = item.name ? item.value : null;
                    return '<div>' +
                        '<span class="label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            onDropdownOpen: function($dropdown) {
                $dropdown
                    .hide()
                    .velocity('slideDown', {
                        begin: function() {
                            $dropdown.css({'margin-top':'0'})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            },
            onDropdownClose: function($dropdown) {
                $dropdown
                    .show()
                    .velocity('slideUp', {
                        complete: function() {
                            $dropdown.css({'margin-top':''})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            }
        });
        PoliciesScheduleSelect = $PoliciesScheduleSelect[0].selectize;
        PoliciesScheduleSelect.load(function(callback) {
            schedule_xhr && schedule_xhr.abort();
            schedule_xhr = $.ajax({
                url: '/objects/schedule/getlist',
				type: 'GET',
				dataType: 'json',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                	console.log("error has occured!!!");
                    callback();
                }
            })
        });
    },
	initSourceZoneSelect: function() {
    	$PoliciesSourceZoneSelect = $('#window_policies_sourcezone').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 1,
            valueField: 'value',
            labelField: 'name',
            searchField: ['name', 'value'],
			options: [],
			render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.value ? '<span class="email">' + escape(item.value) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.value;
                    var caption = item.name ? item.value : null;
                    return '<div>' +
                        '<span class="label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            onDropdownOpen: function($dropdown) {
                $dropdown
                    .hide()
                    .velocity('slideDown', {
                        begin: function() {
                            $dropdown.css({'margin-top':'0'})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            },
            onDropdownClose: function($dropdown) {
                $dropdown
                    .show()
                    .velocity('slideUp', {
                        complete: function() {
                            $dropdown.css({'margin-top':''})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            }
        });
        PoliciesSourceZoneSelect = $PoliciesSourceZoneSelect[0].selectize;
        PoliciesSourceZoneSelect.load(function(callback) {
            sourcezone_xhr && sourcezone_xhr.abort();
            sourcezone_xhr= $.ajax({
                url: '/objects/zone/getlist',
				type: 'GET',
				dataType: 'json',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                	console.log("error has occured!!!");
                    callback();
                }
            })
        });
    },
	initDestinationZoneSelect: function() {
    	$PoliciesDestinationZoneSelect = $('#window_policies_destinationzone').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 1,
            valueField: 'value',
            labelField: 'name',
            searchField: ['name', 'value'],
			options: [],
			render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.value ? '<span class="email">' + escape(item.value) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.value;
                    var caption = item.name ? item.value : null;
                    return '<div>' +
                        '<span class="label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            onDropdownOpen: function($dropdown) {
                $dropdown
                    .hide()
                    .velocity('slideDown', {
                        begin: function() {
                            $dropdown.css({'margin-top':'0'})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            },
            onDropdownClose: function($dropdown) {
                $dropdown
                    .show()
                    .velocity('slideUp', {
                        complete: function() {
                            $dropdown.css({'margin-top':''})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            }
        });
        PoliciesDestinationZoneSelect = $PoliciesDestinationZoneSelect[0].selectize;
        PoliciesDestinationZoneSelect.load(function(callback) {
            destinationzone_xhr && destinationzone_xhr.abort();
            destinationzone_xhr = $.ajax({
                url: '/objects/zone/getlist',
				type: 'GET',
				dataType: 'json',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                	console.log("error has occured!!!");
                    callback();
                }
            })
        });
    },
	initSourceNetworkSelect: function() {
    	var REGEX_IPV4 = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    	$PoliciesSourceNetworkSelect = $('#window_policies_sourcenetwork').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 1,
            valueField: 'value',
            labelField: 'name',
            searchField: ['name', 'value'],
			options: [],
			render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.value ? '<span class="email">' + escape(item.value) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.value;
                    var caption = item.name ? item.value : null;
                    return '<div>' +
                        '<span class="label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            createFilter: function(input) {
                var match, regex;

                regex = new RegExp('^' + REGEX_IPV4 + '$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[0]);

                regex = new RegExp('^([^<]*)\<' + REGEX_IPV4 + '\>$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[2]);

                return false;
            },
            create: function(input) {
                if ((new RegExp('^' + REGEX_IPV4 + '$', 'i')).test(input)) {
                    return {value: input};
                }
                var match = input.match(new RegExp('^([^<]*)\<' + REGEX_IPV4 + '\>$', 'i'));
                if (match) {
                    return {
                        value : match[2],
                        name  : $.trim(match[1])
                    };
                }
                alert('Invalid value address.');
                return false;
            },
            onDropdownOpen: function($dropdown) {
                $dropdown
                    .hide()
                    .velocity('slideDown', {
                        begin: function() {
                            $dropdown.css({'margin-top':'0'})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            },
            onDropdownClose: function($dropdown) {
                $dropdown
                    .show()
                    .velocity('slideUp', {
                        complete: function() {
                            $dropdown.css({'margin-top':''})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            }
        });
        PoliciesSourceNetworkSelect = $PoliciesSourceNetworkSelect[0].selectize;
        PoliciesSourceNetworkSelect.load(function(callback) {
            sourcenetwork_xhr && sourcenetwork_xhr.abort();
            sourcenetwork_xhr = $.ajax({
                url: '/objects/address/getlist',
				type: 'GET',
				dataType: 'json',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                	console.log("error has occured!!!");
                    callback();
                }
            })
        });
    },
	initDestinationNetworkSelect: function() {
    	var REGEX_IPV4 = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    	$PoliciesDestinationNetworkSelect = $('#window_policies_destinationnetwork').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 1,
            valueField: 'value',
            labelField: 'name',
            searchField: ['name', 'value'],
			options: [],
			render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.value ? '<span class="email">' + escape(item.value) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.value;
                    var caption = item.name ? item.value : null;
                    return '<div>' +
                        '<span class="label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            createFilter: function(input) {
                var match, regex;

                regex = new RegExp('^' + REGEX_IPV4 + '$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[0]);

                regex = new RegExp('^([^<]*)\<' + REGEX_IPV4 + '\>$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[2]);

                return false;
            },
            create: function(input) {
                if ((new RegExp('^' + REGEX_IPV4 + '$', 'i')).test(input)) {
                    return {value: input};
                }
                var match = input.match(new RegExp('^([^<]*)\<' + REGEX_IPV4 + '\>$', 'i'));
                if (match) {
                    return {
                        value : match[2],
                        name  : $.trim(match[1])
                    };
                }
                alert('Invalid value address.');
                return false;
            },
            onDropdownOpen: function($dropdown) {
                $dropdown
                    .hide()
                    .velocity('slideDown', {
                        begin: function() {
                            $dropdown.css({'margin-top':'0'})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            },
            onDropdownClose: function($dropdown) {
                $dropdown
                    .show()
                    .velocity('slideUp', {
                        complete: function() {
                            $dropdown.css({'margin-top':''})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            }
        });
        PoliciesDestinationNetworkSelect = $PoliciesDestinationNetworkSelect[0].selectize;
        PoliciesDestinationNetworkSelect.load(function(callback) {
            destinationnetwork_xhr && destinationnetwork_xhr.abort();
            destinationnetwork_xhr = $.ajax({
                url: '/objects/address/getlist',
				type: 'GET',
				dataType: 'json',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                	console.log("error has occured!!!");
                    callback();
                }
            })
        });
    },
	initSourceServiceSelect: function() {
    	$PoliciesSourceServiceSelect = $('#window_policies_sourceservice').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 1,
            valueField: 'value',
            labelField: 'name',
            searchField: ['name', 'value'],
			options: [],
			render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.value ? '<span class="email">' + escape(item.value) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.value;
                    var caption = item.name ? item.value : null;
                    return '<div>' +
                        '<span class="label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            onDropdownOpen: function($dropdown) {
                $dropdown
                    .hide()
                    .velocity('slideDown', {
                        begin: function() {
                            $dropdown.css({'margin-top':'0'})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            },
            onDropdownClose: function($dropdown) {
                $dropdown
                    .show()
                    .velocity('slideUp', {
                        complete: function() {
                            $dropdown.css({'margin-top':''})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            }
        });
        PoliciesSourceServiceSelect = $PoliciesSourceServiceSelect[0].selectize;
        PoliciesSourceServiceSelect.load(function(callback) {
            sourceservice_xhr && sourceservice_xhr.abort();
            sourceservice_xhr = $.ajax({
                url: '/objects/protocol/getlist',
				type: 'GET',
				dataType: 'json',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                	console.log("error has occured!!!");
                    callback();
                }
            })
        });
    },
	initDestinationServiceSelect: function() {
    	$PoliciesDestinationServiceSelect = $('#window_policies_destinationservice').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 1,
            valueField: 'value',
            labelField: 'name',
            searchField: ['name', 'value'],
			options: [],
			render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.value ? '<span class="email">' + escape(item.value) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.value;
                    var caption = item.name ? item.value : null;
                    return '<div>' +
                        '<span class="label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            onDropdownOpen: function($dropdown) {
                $dropdown
                    .hide()
                    .velocity('slideDown', {
                        begin: function() {
                            $dropdown.css({'margin-top':'0'})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            },
            onDropdownClose: function($dropdown) {
                $dropdown
                    .show()
                    .velocity('slideUp', {
                        complete: function() {
                            $dropdown.css({'margin-top':''})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            }
        });
        PoliciesDestinationServiceSelect = $PoliciesDestinationServiceSelect[0].selectize;
        PoliciesDestinationServiceSelect.load(function(callback) {
            destinationservice_xhr && destinationservice_xhr.abort();
            destinationservice_xhr = $.ajax({
                url: '/objects/protocol/getlist',
				type: 'GET',
				dataType: 'json',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                	console.log("error has occured!!!");
                    callback();
                }
            })
        });
    },
	initSnatToSelect: function() {
    	var REGEX_IPV4 = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    	$PoliciesSnatToSelect = $('#window_policies_snatto').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 1,
            valueField: 'value',
            labelField: 'name',
            searchField: ['name', 'value'],
			options: [],
			render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.value ? '<span class="email">' + escape(item.value) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.value;
                    var caption = item.name ? item.value : null;
                    return '<div>' +
                        '<span class="label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            createFilter: function(input) {
                var match, regex;

                regex = new RegExp('^' + REGEX_IPV4 + '$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[0]);

                regex = new RegExp('^([^<]*)\<' + REGEX_IPV4 + '\>$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[2]);

                return false;
            },
            create: function(input) {
                if ((new RegExp('^' + REGEX_IPV4 + '$', 'i')).test(input)) {
                    return {value: input};
                }
                var match = input.match(new RegExp('^([^<]*)\<' + REGEX_IPV4 + '\>$', 'i'));
                if (match) {
                    return {
                        value : match[2],
                        name  : $.trim(match[1])
                    };
                }
                alert('Invalid value address.');
                return false;
            },
            onDropdownOpen: function($dropdown) {
                $dropdown
                    .hide()
                    .velocity('slideDown', {
                        begin: function() {
                            $dropdown.css({'margin-top':'0'})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            },
            onDropdownClose: function($dropdown) {
                $dropdown
                    .show()
                    .velocity('slideUp', {
                        complete: function() {
                            $dropdown.css({'margin-top':''})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            }
        });
        PoliciesSnatToSelect = $PoliciesSnatToSelect[0].selectize;
        PoliciesSnatToSelect.load(function(callback) {
            snatto_xhr && snatto_xhr.abort();
            snatto_xhr = $.ajax({
                url: '/objects/address/getlist',
				type: 'GET',
				dataType: 'json',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                	console.log("error has occured!!!");
                    callback();
                }
            })
        });
    },
	initDnatToSelect: function() {
    	var REGEX_IPV4 = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    	$PoliciesDnatToSelect = $('#window_policies_dnatto').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 1,
            valueField: 'value',
            labelField: 'name',
            searchField: ['name', 'value'],
			options: [],
			render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.value ? '<span class="email">' + escape(item.value) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.value;
                    var caption = item.name ? item.value : null;
                    return '<div>' +
                        '<span class="label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            createFilter: function(input) {
                var match, regex;

                regex = new RegExp('^' + REGEX_IPV4 + '$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[0]);

                regex = new RegExp('^([^<]*)\<' + REGEX_IPV4 + '\>$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[2]);

                return false;
            },
            create: function(input) {
                if ((new RegExp('^' + REGEX_IPV4 + '$', 'i')).test(input)) {
                    return {value: input};
                }
                var match = input.match(new RegExp('^([^<]*)\<' + REGEX_IPV4 + '\>$', 'i'));
                if (match) {
                    return {
                        value : match[2],
                        name  : $.trim(match[1])
                    };
                }
                alert('Invalid value address.');
                return false;
            },
            onDropdownOpen: function($dropdown) {
                $dropdown
                    .hide()
                    .velocity('slideDown', {
                        begin: function() {
                            $dropdown.css({'margin-top':'0'})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            },
            onDropdownClose: function($dropdown) {
                $dropdown
                    .show()
                    .velocity('slideUp', {
                        complete: function() {
                            $dropdown.css({'margin-top':''})
                        },
                        duration: 200,
                        easing: easing_swiftOut
                    })
            }
        });
        PoliciesDnatToSelect = $PoliciesDnatToSelect[0].selectize;
        PoliciesDnatToSelect.load(function(callback) {
            dnatto_xhr && dnatto_xhr.abort();
            dnatto_xhr = $.ajax({
                url: '/objects/address/getlist',
				type: 'GET',
				dataType: 'json',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                	console.log("error has occured!!!");
                    callback();
                }
            })
        });
    },
    char_words_counter: function() {
        var $imputCount = $('.input-count');
        if($imputCount.length) {
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
    fadeInvalidFormErrorMessage: function(){
	    $("#invalid-form-error-window").css("display", "inline").fadeToggle(4000);
    },
    form_validator: function() {
        var $formValidate = $('#window_policies_form');

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
	loadElementsEvent: function() {
		$('#window_policies_snatenabled').on('ifChecked', function(event){
			$('#window_policies_snatpolicy_snat').iCheck('enable');
			PoliciesSnatToSelect.enable();
			$("#window_policies_snatpolicy_masq").iCheck('enable');
		});
		$('#window_policies_snatenabled').on('ifUnchecked', function(event){
			$("#window_policies_snatpolicy_snat").iCheck('disable');
			PoliciesSnatToSelect.disable();
			$("#window_policies_snatpolicy_masq").iCheck('disable');
        });
		$('#window_policies_snatpolicy_snat').on('ifChecked', function(event){
			PoliciesSnatToSelect.enable();
		});
		$('#window_policies_snatpolicy_snat').on('ifUnchecked', function(event){
			PoliciesSnatToSelect.disable();
		});
		$('#window_policies_dnatenabled').on('ifChecked', function(event){
			PoliciesDnatToSelect.enable();
		});
		$('#window_policies_dnatenabled').on('ifUnchecked', function(event){
			PoliciesDnatToSelect.disable();
		});
    }
};
