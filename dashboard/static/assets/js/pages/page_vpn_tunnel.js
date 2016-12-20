var VpnTunnelModalWindow;
var $VpnTunnelProfileSelect, VpnTunnelProfileSelect, profile_xhr;
var $VpnTunnelLocalNetworkSelect, VpnTunnelLocalNetworkSelect, localnetwork_xhr;
var $VpnTunnelLocalEndpointSelect, VpnTunnelLocalEndpointSelect, localendpoint_xhr;
var $VpnTunnelRemoteNetworkSelect, VpnTunnelRemoteNetworkSelect, remotenetwork_xhr;
var $VpnTunnelRemoteEndpointSelect, VpnTunnelRemoteEndpointSelect, remoteendpoint_xhr;
var $VpnTunnelAuthMethodSelect, VpnTunnelAuthMethodSelect;
var CurrentPage = 1;

$(function() {
    VpnTunnel.loadTable();
    VpnTunnel.init();
    VpnTunnel.save();
    VpnTunnel.char_words_counter();
    VpnTunnel.form_validator();
});

VpnTunnel = {
	init: function() {
    	$(document).ready(function () {
        	VpnTunnelModalWindow = UIkit.modal("#window_VpnTunnel");
        	VpnTunnel.initProfileSelect();
        	VpnTunnel.initLocalNetworkSelect();
        	VpnTunnel.initLocalEndpointSelect();
        	VpnTunnel.initRemoteNetworkSelect();
        	VpnTunnel.initRemoteEndpointSelect();
        	VpnTunnel.initAuthMethodSelect();
    	});
    },
    add: function(){
    	if ( VpnTunnelModalWindow.isActive() ) {
			VpnTunnelModalWindow.hide();
		} else {
			VpnTunnelModalWindow.show();
		}
		$("#window_vpntunnel_title").text(" Add new tunnel ");
		$("#window_vpntunnel_id").val("0");
		$("#window_vpntunnel_row").val(parseInt($("#records_number").val())+1);
		$("#window_vpntunnel_name").val("");
		$("#window_vpntunnel_desc").val("");
		VpnTunnelProfileSelect.setValue();
		VpnTunnelLocalNetworkSelect.setValue();
		VpnTunnelLocalEndpointSelect.setValue();
		$("#window_vpntunnel_localid").val("");
		VpnTunnelRemoteNetworkSelect.setValue([1]);
		VpnTunnelRemoteEndpointSelect.setValue();
		$("#window_vpntunnel_peerid").val("");
		VpnTunnelAuthMethodSelect.setValue();
		// $('.encap').hide();
		// $('.layer3').hide();
		// $('.layer4').hide();
		$("#window_vpntunnel_name").focus();
    },
    edit: function(obj){
		var $eventTargetId = obj.id.split("-");
		if ( VpnTunnelModalWindow.isActive() ) {
			VpnTunnelModalWindow.hide();
		} else {
			VpnTunnelModalWindow.show();
		}

		$.getJSON( "/vpn/tunnel/view", {
    		VpnTunnelId: $eventTargetId[2]
    	}, function(record) {
			$("#window_vpntunnel_title").text(" Edit vpn tunnel ( "+record[0].Name+" ) ");
    		$("#window_vpntunnel_id").val(record[0].VpnTunnelId);
			$("#window_vpntunnel_row").val($eventTargetId[1]);
			$("#window_vpntunnel_name").val(record[0].Name);
			$("#window_vpntunnel_desc").val(record[0].Description);
			VpnTunnelProfileSelect.setValue(record[0].Profile);
			VpnTunnelLocalNetworkSelect.setValue(record[0].LocalNetwork);
			VpnTunnelLocalEndpointSelect.setValue(record[0].LocalEndpoint);
			$("#window_vpntunnel_localid").val(record[0].LocalId);
			VpnTunnelRemoteNetworkSelect.setValue(record[0].RemoteNetwork);
			VpnTunnelRemoteEndpointSelect.setValue(record[0].RemoteEndpoint);
			$("#window_vpntunnel_peerid").val(record[0].PeerId);
			VpnTunnelAuthMethodSelect.setValue(record[0].AuthenticationMethod);
		});
		$("#window_vpntunnel_name").focus();
    },
    remove: function(obj){
    	var $eventTarget = obj;
    	var $eventTargetId = obj.id.split("-");
    	UIkit.modal.confirm('Are you sure you want to delete this item?', function(){
        	$.ajax({
        		type: 'POST',
        		url: "/vpn/tunnel/delete",
        		data: {
        			VpnTunnelId: $eventTargetId[2],
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
            			VpnTunnel.reloadTable(CurrentPage);
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
        $("#window_vpntunnel_save").click( function() {
        	var row_number = $('#window_vpntunnel_row').val();
        	var VpnTunnel_id = $('#window_vpntunnel_id').val();

			var $FieldName = "";
			$FieldName = $('#window_vpntunnel_name');
			if (VpnTunnel.isNotValid($FieldName)) return;
			var VpnTunnel_name = $FieldName.val();

			$FieldName = $('#window_vpntunnel_desc');
			if (VpnTunnel.isNotValid($FieldName)) return;
			var VpnTunnel_desc = $FieldName.val();

			var VpnTunnel_EncapType = VpnTunnelProfileSelect.getValue();
			var VpnTunnel_Phase1Algo = VpnTunnelLocalNetworkSelect.getValue();
			var VpnTunnel_Phase1Auth = VpnTunnelLocalEndpointSelect.getValue();
			$FieldName = $('#window_vpntunnel_localid');
			if (VpnTunnel.isNotValid($FieldName)) return;
			var VpnTunnel_localid = $FieldName.val();

			var VpnTunnel_Phase1Dhg = VpnTunnelRemoteNetworkSelect.getValue();
			var VpnTunnel_Phase2Algo = VpnTunnelRemoteEndpointSelect.getValue();
			$FieldName = $('#window_vpntunnel_peerid');
			if (VpnTunnel.isNotValid($FieldName)) return;
			var VpnTunnel_peerid = $FieldName.val();

			var VpnTunnel_authmethod = VpnTunnelAuthMethodSelect.getValue();

			// ???
			var VpnTunnel_EncapLocalEndpoint = "";
			var VpnTunnel_EncapRemoteEndpoint = "";

        	switch ( VpnTunnel_authmethod ) {
				case "PresharedKey":
					$FieldName = $('#window_vpntunnel_presha');
					if (VpnTunnel.isNotValid($FieldName)) return;
					VpnTunnel_EncapLocalEndpoint = VpnTunnelEncapLocalEndpointSelect.getValue();
					$FieldName = $('#window_vpntunnel_encapremoteendpoint');
					if (VpnTunnel.isNotValid($FieldName)) return;
					VpnTunnel_EncapRemoteEndpoint = VpnTunnelEncapRemoteEndpointSelect.getValue();
					break;
				case "RSA":
					$FieldName = $('#window_vpntunnel_encapservice');
					if (VpnTunnel.isNotValid($FieldName)) return;
					VpnTunnel_EncapService = VpnTunnelEncapServiceSelect.getValue();
					$FieldName = $('#window_vpntunnel_encapremoteendpoint');
					if (VpnTunnel.isNotValid($FieldName)) return;
					VpnTunnel_EncapRemoteEndpoint = VpnTunnelEncapRemoteEndpointSelect.getValue();
					break;
			}

            $('#window_vpntunnel_save').addClass("disabled");

        	var target_url = '';
        	if ( VpnTunnel_id === "0" ) {
        		target_url = '/vpn/tunnel/create';
        	} else {
        		target_url = '/vpn/tunnel/update';
        	}

        	$.ajax({
        		type: 'POST',
        		url: target_url,
        		data: {
        			VpnTunnelId: VpnTunnel_id,
            		Name: VpnTunnel_name,
            		Description: VpnTunnel_desc,
					Phase1Algo: VpnTunnel_Phase1Algo,
					Phase1Auth: VpnTunnel_Phase1Auth,
					Phase1Dhg: VpnTunnel_Phase1Dhg,
					Phase1LifeTime: VpnTunnel_phase1lifetime,
					Phase2Algo: VpnTunnel_Phase2Algo,
					Phase2Auth: VpnTunnel_Phase2Auth,
					Phase2Dhg: VpnTunnel_Phase2Dhg,
					Phase2LifieTime: VpnTunnel_phase2lifetime,
					EncapType: VpnTunnel_EncapType,
					EncapLocalEndpoint: VpnTunnel_EncapLocalEndpoint,
					EncapRemoteEndpoint: VpnTunnel_EncapRemoteEndpoint,
					EncapService: VpnTunnel_EncapService
            		},
        		dataType: 'json',
        		success: function(json) {
    				$('#window_vpntunnel_save').removeClass("disabled");
        			if (json.Result == "OK") {
        				VpnTunnelModalWindow.hide();
                        VpnTunnel.reloadTable(CurrentPage);
            			setTimeout(UIkit.notify({
                            message : json.Message,
                            status  : json.Status,
                            timeout : 2000,
                            pos     : 'top-center'
                        }), 5000);
        			} else {
        				if (json.Result == "DUP"){
        					$("#invalid-form-error-message").text(json.Message);
        					$("#window_vpntunnel_name").select();
        					VpnTunnel.fadeInvalidFormErrorMessage();
        				}
        			}
        		}
    		});
        });
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
	clearTable: function () {
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
						.attr({'href':'#','onclick':'VpnTunnel.reloadTable( 1,' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-left')
						)
					)
				)
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'VpnTunnel.reloadTable('+ previous_page + ',' + page_size + ')'})
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
							.attr({'href':'#','onclick':'VpnTunnel.reloadTable('+index_page+','+page_size+')'})
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
						.attr({'href':'#','onclick':'VpnTunnel.reloadTable('+ next_page + ',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-right')
						)
					)
				)
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'VpnTunnel.reloadTable( '+ total_pages +',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-right')
						)
					)
				);
		}
		CurrentPage = current_page;
    },
	reloadTable: function (page_number,page_size) {
    	VpnTunnel.clearTable();
		VpnTunnel.loadTable(page_number,page_size);
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
							begin: function () {
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
							complete: function () {
								$dropdown.css({'margin-top': ''})
							},
							duration: 200,
							easing: easing_swiftOut
						})
				},
				onChange: function () {
					VpnTunnel.reloadTable(CurrentPage);
				}
			});
			$('#page_size option:selected').each(function () {
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
    		url: "/vpn/tunnel/read",
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
    			    VpnTunnel.loadTable(--page_number,page_size);
                } else {
                    VpnTunnel.perform(json.Records,"drawTable");
                    VpnTunnel.loadPagination(page_number,page_size,total_record_count);
                }
    		}
		});
    },
    perform: function (recordList,what) {
    	var row_number = $('#window_vpntunnel_row').val(); // for addRow and editRow
		if (what === "drawTable")
			row_number = 0;
		$.each(recordList, function(eachRecordIndex, eachRecord) {
			if (what === "drawTable")
				row_number = eachRecordIndex + 1;
			// else addRow and editRow

			if (what === "editRow") {
    			$("#name-"+row_number).text(eachRecord.Name);
    			$("#description-"+row_number).text(eachRecord.Description);
    			$("#group-"+row_number).text("Group: "+eachRecord.Group);
    			$("#version-"+row_number).text("Version: "+eachRecord.Version);
    			$("#type-"+row_number).text("Type: "+eachRecord.Type);
    			$("#value-"+row_number).text(eachRecord.Value);
			} else { // for addRow and drawTable
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
				        		.attr('class','uk-width-2-10')
				        		.append($('<div>')
	    			        		.attr('class','uk-grid')
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'phase1algo-'+row_number})
	    			        				.text("Phase 1 Enc: "+eachRecord.Phase1Algo)
				        				)
			        				)
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'phase1auth-'+row_number})
	    			        				.text("Phase 1 Auth: "+eachRecord.Phase1Auth)
				        				)
			        				)
		        				)
	        				)
	        				.append($('<div>')
				        		.attr('class','uk-width-2-10')
				        		.append($('<div>')
	    			        		.attr('class','uk-grid')
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'phase2algo-'+row_number})
	    			        				.text("Phase 2 Enc: "+eachRecord.Phase2Algo)
				        				)
			        				)
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'phase2auth-'+row_number})
	    			        				.text("Phase 2 Auth: "+eachRecord.Phase2Auth)
				        				)
			        				)
		        				)
	        				)
	        				.append($('<div>')
				        		.attr('class','uk-width-2-10')
				        		.append($('<div>')
	    			        		.attr('class','uk-grid')
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-middle','id':'value-'+row_number})
	    			        				.text(eachRecord.EncapType)
				        				)
			        				)
									.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'encapremoteendpoint-'+row_number})
	    			        				.text("Type: "+eachRecord.EncapRemoteEndpoint)
				        				)
			        				)

		        				)
	        				)
	        				.append($('<div>')
				        		.attr('class','uk-width-2-10')
				        		.append($('<div>')
			        				.attr({'class':'uk-grid uk-grid-medium','data-uk-grid-margin':'','data-uk-grid-match':"{target:'.md-card'}"})
			        				.append($('<div>')
				        				.attr('class','uk-width-1-2')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': 'Delete',
				        						'onclick':'VpnTunnel.remove(this)',
				        						'href': '#',
				        						'id':'delete_VpnTunnel-'+row_number+'-'+eachRecord.VpnTunnelId
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
				        				.attr('class','uk-width-1-2')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': 'Edit',
				        						'onclick':'VpnTunnel.edit(this)',
				        						'href': '#',
				        						'id':'edit_VpnTunnel-'+row_number+'-'+eachRecord.VpnTunnelId
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
		VpnTunnel.refreshTable();
    },
    initProfileSelect: function() {
    	$VpnTunnelProfileSelect = $('#window_vpntunnel_profile').selectize({
    		options: [],
            maxItems: 1,
            valueField: 'value',
            labelField: 'name',
            searchField: 'name',
            create: false,
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
    	VpnTunnelProfileSelect = $VpnTunnelProfileSelect[0].selectize;
		VpnTunnelProfileSelect.load(function(callback) {
			profile_xhr && profile_xhr.abort();
			profile_xhr = $.ajax({
                url: '/vpn/profile/getlist',
                success: function(results) {
                    console.log("res: "+results);
                    callback(results);
                },
                error: function() {
                    callback();
                }
            });
        });
    },
    initLocalNetworkSelect: function() {
    	$VpnTunnelLocalNetworkSelect = $('#window_vpntunnel_localnetwork').selectize({
    		options: [],
            maxItems: 1,
            valueField: 'value',
            labelField: 'title',
            searchField: 'title',
            create: false,
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
    	VpnTunnelLocalNetworkSelect = $VpnTunnelLocalNetworkSelect[0].selectize;
        VpnTunnelLocalNetworkSelect.load(function(callback) {
			localnetwork_xhr && localnetwork_xhr.abort();
			localnetwork_xhr = $.ajax({
                url: '/objects/address/getlist',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                    callback();
                }
            });
        });
    },
    initLocalEndpointSelect: function() {
    	$VpnTunnelLocalEndpointSelect = $('#window_vpntunnel_localendpoint').selectize({
    		options: [
                {value: 'md5', title: 'MD5'},
                {value: 'sha1', title: 'SHA1'}
            ],
            maxItems: 1,
            valueField: 'value',
            labelField: 'title',
            searchField: 'title',
            create: false,
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
    	VpnTunnelLocalEndpointSelect = $VpnTunnelLocalEndpointSelect[0].selectize;
        VpnTunnelLocalEndpointSelect.load(function(callback) {
			localendpoint_xhr && localendpoint_xhr.abort();
			localendpoint_xhr = $.ajax({
                url: '/objects/address/getlist',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                    callback();
                }
            })
        });
    },
    initRemoteNetworkSelect: function() {
    	$VpnTunnelRemoteNetworkSelect = $('#window_vpntunnel_remotenetwork').selectize({
    		options: [],
			maxItems: 1,
            valueField: 'value',
            labelField: 'title',
            searchField: ['title', 'value'],
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
		VpnTunnelRemoteNetworkSelect = $VpnTunnelRemoteNetworkSelect[0].selectize;
        VpnTunnelRemoteNetworkSelect.load(function(callback) {
			remotenetwork_xhr && remotenetwork_xhr.abort();
			remotenetwork_xhr = $.ajax({
                url: '/objects/address/getlist',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                    callback();
                }
            })
        });
    },
    initRemoteEndpointSelect: function() {
    	$VpnTunnelRemoteEndpointSelect = $('#window_vpntunnel_remoteendpoint').selectize({
    		options: [
                {value: 'paya256', title: 'PAYA-256'},
                {value: '3des', title: '3DES'},
                {value: 'aes128', title: 'AES-128'},
                {value: 'aes192', title: 'AES-192'},
                {value: 'aes256', title: 'AES-256'}
            ],
            maxItems: 1,
            valueField: 'value',
            labelField: 'title',
            searchField: 'title',
            create: false,
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
    	VpnTunnelRemoteEndpointSelect = $VpnTunnelRemoteEndpointSelect[0].selectize;
        VpnTunnelRemoteEndpointSelect.load(function(callback) {
			remoteendpoint_xhr && remoteendpoint_xhr.abort();
			remoteendpoint_xhr = $.ajax({
                url: '/objects/address/getlist',
                success: function(results) {
                    callback(results);
                },
                error: function() {
                    callback();
                }
            })
        });
    },
    initAuthMethodSelect: function() {
    	$VpnTunnelAuthMethodSelect = $('#window_vpntunnel_authmethod').selectize({
    		options: [
                {value: 'PresharedKey', title: 'Preshared Key'},
                {value: 'rsa', title: 'RSA'}
            ],
            maxItems: 1,
            valueField: 'value',
            labelField: 'title',
            searchField: 'title',
            create: false,
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
    	VpnTunnelAuthMethodSelect = $VpnTunnelAuthMethodSelect[0].selectize;
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
        var $formValidate = $('#window_vpntunnel_form');

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
