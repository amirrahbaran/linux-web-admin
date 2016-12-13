var VpnProfileModalWindow;
var $VpnProfileEncapTypeSelect, VpnProfileEncapTypeSelect;
var $VpnProfilePhase1AlgoSelect, VpnProfilePhase1AlgoSelect;
var $VpnProfilePhase1AuthSelect, VpnProfilePhase1AuthSelect;
var $VpnProfilePhase1DhgSelect, VpnProfilePhase1DhgSelect;
var $VpnProfilePhase2AlgoSelect, VpnProfilePhase2AlgoSelect;
var $VpnProfilePhase2AuthSelect, VpnProfilePhase2AuthSelect;
var $VpnProfilePhase2DhgSelect, VpnProfilePhase2DhgSelect;
var $VpnProfileEncapLocalEndpointSelect, VpnProfileEncapLocalEndpointSelect, encap_local_endpoint_xhr;
var $VpnProfileEncapRemoteEndpointSelect, VpnProfileEncapRemoteEndpointSelect, encap_remote_endpoint_xhr;
var $VpnProfileEncapServiceSelect, VpnProfileEncapServiceSelect, encap_service_xhr;
var CurrentPage = 1;

$(function() {
    VpnProfile.loadTable();
    VpnProfile.init();
    VpnProfile.save();
    VpnProfile.char_words_counter();
    VpnProfile.form_validator();
});

VpnProfile = {
	init: function() {
    	$(document).ready(function () {
        	VpnProfileModalWindow = UIkit.modal("#window_VpnProfile");
        	VpnProfile.initEncapTypeSelect();
        	VpnProfile.initPhase1AlgoSelect();
        	VpnProfile.initPhase1AuthSelect();
        	VpnProfile.initPhase1DhgSelect();
        	VpnProfile.initPhase2AlgoSelect();
        	VpnProfile.initPhase2AuthSelect();
        	VpnProfile.initPhase2DhgSelect();
        	VpnProfile.initEncapLocalEndpointSelect();
        	VpnProfile.initEncapRemoteEndpointSelect();
        	VpnProfile.initEncapServiceSelect();
    	});
    },
    add: function(){
    	if ( VpnProfileModalWindow.isActive() ) {
			VpnProfileModalWindow.hide();
		} else {
			VpnProfileModalWindow.show();
		}
		$("#window_vpnprofile_title").text(" Add new profile ");
		$("#window_vpnprofile_id").val("0");
		$("#window_vpnprofile_row").val(parseInt($("#records_number").val())+1);
		$("#window_vpnprofile_name").val("");
		$("#window_vpnprofile_desc").val("");
		VpnProfileEncapTypeSelect.setValue();
		VpnProfilePhase1AlgoSelect.setValue();
		VpnProfilePhase1AuthSelect.setValue();
		VpnProfilePhase1DhgSelect.setValue();
		$("#window_vpnprofile_phase1lifetime").val("");
		VpnProfilePhase2AlgoSelect.setValue();
		VpnProfilePhase2AuthSelect.setValue();
		VpnProfilePhase2DhgSelect.setValue();
		$("#window_vpnprofile_phase2lifetime").val("");
		VpnProfileEncapLocalEndpointSelect.setValue();
		VpnProfileEncapRemoteEndpointSelect.setValue();
		VpnProfileEncapServiceSelect.setValue();
		$('.encap').hide();
		$('.layer3').hide();
		$('.layer4').hide();
		$("#window_vpnprofile_name").focus();
    },
    edit: function(obj){
		var $eventTargetId = obj.id.split("-");
		if ( VpnProfileModalWindow.isActive() ) {
			VpnProfileModalWindow.hide();
		} else {
			VpnProfileModalWindow.show();
		}

		$.getJSON( "/vpn/profile/view", {
    		VpnProfileId: $eventTargetId[2]
    	}, function(record) {
			$("#window_vpnprofile_title").text(" Edit profile object ( "+record[0].Name+" ) ");
    		$("#window_vpnprofile_id").val(record[0].VpnProfileId);
			$("#window_vpnprofile_row").val($eventTargetId[1]);
			$("#window_vpnprofile_name").val(record[0].Name);
			$("#window_vpnprofile_desc").val(record[0].Description);
			VpnProfileEncapTypeSelect.setValue(record[0].EncapType);
			VpnProfilePhase1AlgoSelect.setValue(record[0].Phase1Algo);
			VpnProfilePhase1AuthSelect.setValue(record[0].Phase1Auth);
			VpnProfilePhase1DhgSelect.setValue(record[0].Phase1Dhg);
			$("#window_vpnprofile_phase1lifetime").val(record[0].Phase1LifeTime);
			VpnProfilePhase2AlgoSelect.setValue(record[0].Phase2Algo);
			VpnProfilePhase2AuthSelect.setValue(record[0].Phase2Auth);
			VpnProfilePhase2DhgSelect.setValue(record[0].Phase2Dhg);
			$("#window_vpnprofile_phase2lifetime").val(record[0].Phase2LifeTime);
			VpnProfileEncapLocalEndpointSelect.setValue(record[0].EncapLocalEndpoint);
			VpnProfileEncapRemoteEndpointSelect.setValue(record[0].EncapRemoteEndpoint);
			VpnProfileEncapServiceSelect.setValue(record[0].EncapService);
		});
		$("#window_vpnprofile_name").focus();
    },
    remove: function(obj){
    	var $eventTarget = obj;
    	var $eventTargetId = obj.id.split("-");
    	UIkit.modal.confirm('Are you sure you want to delete this item?', function(){
        	$.ajax({
        		type: 'POST',
        		url: "/vpn/profile/delete",
        		data: {
        			VpnProfileId: $eventTargetId[2],
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
            			VpnProfile.reloadTable(CurrentPage);
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
        $("#window_vpnprofile_save").click( function() {
        	var row_number = $('#window_vpnprofile_row').val();
        	var VpnProfile_id = $('#window_vpnprofile_id').val();

			var $FieldName = "";
			$FieldName = $('#window_vpnprofile_name');
			if (VpnProfile.isNotValid($FieldName)) return;
			var VpnProfile_name = $FieldName.val();

			$FieldName = $('#window_vpnprofile_desc');
			if (VpnProfile.isNotValid($FieldName)) return;
			var VpnProfile_desc = $FieldName.val();

			$FieldName = $('#window_vpnprofile_phase1lifetime');
			if (VpnProfile.isNotValid($FieldName)) return;
			var VpnProfile_phase1lifetime = $FieldName.val();

			$FieldName = $('#window_vpnprofile_phase2lifetime');
			if (VpnProfile.isNotValid($FieldName)) return;
			var VpnProfile_phase2lifetime = $FieldName.val();

			var VpnProfile_EncapType = VpnProfileEncapTypeSelect.getValue();
			var VpnProfile_Phase1Algo = VpnProfilePhase1AlgoSelect.getValue();
			var VpnProfile_Phase1Auth = VpnProfilePhase1AuthSelect.getValue();
			var VpnProfile_Phase1Dhg = VpnProfilePhase1DhgSelect.getValue();
			var VpnProfile_Phase2Algo = VpnProfilePhase2AlgoSelect.getValue();
			var VpnProfile_Phase2Auth = VpnProfilePhase2AuthSelect.getValue();
			var VpnProfile_Phase2Dhg = VpnProfilePhase2DhgSelect.getValue();
			var VpnProfile_EncapLocalEndpoint = "";
			var VpnProfile_EncapRemoteEndpoint = "";
			var VpnProfile_EncapService = "";

        	switch ( VpnProfile_EncapType ) {
				case "Multicast":
				case "Point-To-Point":
					$FieldName = $('#window_vpnprofile_encaplocalendpoint');
					if (VpnProfile.isNotValid($FieldName)) return;
					VpnProfile_EncapLocalEndpoint = VpnProfileEncapLocalEndpointSelect.getValue();
					$FieldName = $('#window_vpnprofile_encapremoteendpoint');
					if (VpnProfile.isNotValid($FieldName)) return;
					VpnProfile_EncapRemoteEndpoint = VpnProfileEncapRemoteEndpointSelect.getValue();
					break;
				case "Client-Server":
					$FieldName = $('#window_vpnprofile_encapservice');
					if (VpnProfile.isNotValid($FieldName)) return;
					VpnProfile_EncapService = VpnProfileEncapServiceSelect.getValue();
					$FieldName = $('#window_vpnprofile_encapremoteendpoint');
					if (VpnProfile.isNotValid($FieldName)) return;
					VpnProfile_EncapRemoteEndpoint = VpnProfileEncapRemoteEndpointSelect.getValue();
					break;
			}

            $('#window_vpnprofile_save').addClass("disabled");

        	var target_url = '';
        	if ( VpnProfile_id === "0" ) {
        		target_url = '/vpn/profile/create';
        	} else {
        		target_url = '/vpn/profile/update';
        	}

        	$.ajax({
        		type: 'POST',
        		url: target_url,
        		data: {
        			VpnProfileId: VpnProfile_id,
            		Name: VpnProfile_name,
            		Description: VpnProfile_desc,
					Phase1Algo: VpnProfile_Phase1Algo,
					Phase1Auth: VpnProfile_Phase1Auth,
					Phase1Dhg: VpnProfile_Phase1Dhg,
					Phase1LifeTime: VpnProfile_phase1lifetime,
					Phase2Algo: VpnProfile_Phase2Algo,
					Phase2Auth: VpnProfile_Phase2Auth,
					Phase2Dhg: VpnProfile_Phase2Dhg,
					Phase2LifieTime: VpnProfile_phase2lifetime,
					EncapType: VpnProfile_EncapType,
					EncapLocalEndpoint: VpnProfile_EncapLocalEndpoint,
					EncapRemoteEndpoint: VpnProfile_EncapRemoteEndpoint,
					EncapService: VpnProfile_EncapService
            		},
        		dataType: 'json',
        		success: function(json) {
    				$('#window_vpnprofile_save').removeClass("disabled");
        			if (json.Result == "OK") {
        				VpnProfileModalWindow.hide();
                        VpnProfile.reloadTable(CurrentPage);
            			setTimeout(UIkit.notify({
                            message : json.Message,
                            status  : json.Status,
                            timeout : 2000,
                            pos     : 'top-center'
                        }), 5000);
        			} else {
        				if (json.Result == "DUP"){
        					$("#invalid-form-error-message").text(json.Message);
        					$("#window_vpnprofile_name").select();
        					VpnProfile.fadeInvalidFormErrorMessage();
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
						.attr({'href':'#','onclick':'VpnProfile.reloadTable( 1,' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-left')
						)
					)
				)
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'VpnProfile.reloadTable('+ previous_page + ',' + page_size + ')'})
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
							.attr({'href':'#','onclick':'VpnProfile.reloadTable('+index_page+','+page_size+')'})
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
						.attr({'href':'#','onclick':'VpnProfile.reloadTable('+ next_page + ',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-right')
						)
					)
				)
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'VpnProfile.reloadTable( '+ total_pages +',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-right')
						)
					)
				);
		}
		CurrentPage = current_page;
    },
	reloadTable: function (page_number,page_size) {
    	VpnProfile.clearTable();
		VpnProfile.loadTable(page_number,page_size);
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
					VpnProfile.reloadTable(CurrentPage);
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
    		url: "/vpn/profile/read",
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
    			    VpnProfile.loadTable(--page_number,page_size);
                } else {
                    VpnProfile.perform(json.Records,"drawTable");
                    VpnProfile.loadPagination(page_number,page_size,total_record_count);
                }
    		}
		});
    },
    perform: function (recordList,what) {
    	var row_number = $('#window_vpnprofile_row').val(); // for addRow and editRow
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
				        						'onclick':'VpnProfile.remove(this)',
				        						'href': '#',
				        						'id':'delete_VpnProfile-'+row_number+'-'+eachRecord.VpnProfileId
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
				        						'onclick':'VpnProfile.edit(this)',
				        						'href': '#',
				        						'id':'edit_VpnProfile-'+row_number+'-'+eachRecord.VpnProfileId
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
		VpnProfile.refreshTable();
    },
    initEncapTypeSelect: function() {
    	$VpnProfileEncapTypeSelect = $('#window_vpnprofile_encaptype').selectize({
    		options: [
                {value: 'None', title: 'None (IPSec only)'},
                {value: 'Multicast', title: 'Multicast tunnel'},
                {value: 'Point-To-Point', title: 'Point to point tunnel'},
                {value: 'Client-Server', title: 'Client-Server tunnel'}
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
            },
			onChange: function ($dropdown) {
				$('.encap').hide();
				$('.' + $dropdown).show();
            }
    	});
    	VpnProfileEncapTypeSelect = $VpnProfileEncapTypeSelect[0].selectize;
    },
    initPhase1AlgoSelect: function() {
    	$VpnProfilePhase1AlgoSelect = $('#window_vpnprofile_phase1algo').selectize({
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
    	VpnProfilePhase1AlgoSelect = $VpnProfilePhase1AlgoSelect[0].selectize;
    },
    initPhase1AuthSelect: function() {
    	$VpnProfilePhase1AuthSelect = $('#window_vpnprofile_phase1auth').selectize({
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
    	VpnProfilePhase1AuthSelect = $VpnProfilePhase1AuthSelect[0].selectize;
    },
    initPhase1DhgSelect: function() {
    	$VpnProfilePhase1DhgSelect = $('#window_vpnprofile_phase1dhg').selectize({
    		options: [
                {value: '1', title: '1 (DH768)'},
                {value: '2', title: '2 (DH1024)'},
                {value: '5', title: '5 (DH1536)'},
                {value: '14', title: '14 (DH2048)'},
                {value: '15', title: '15 (DH3072)'},
                {value: '16', title: '16 (DH4096)'},
            ],
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
		VpnProfilePhase1DhgSelect = $VpnProfilePhase1DhgSelect[0].selectize;
    },
    initPhase2AlgoSelect: function() {
    	$VpnProfilePhase2AlgoSelect = $('#window_vpnprofile_phase2algo').selectize({
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
    	VpnProfilePhase2AlgoSelect = $VpnProfilePhase2AlgoSelect[0].selectize;
    },
    initPhase2AuthSelect: function() {
    	$VpnProfilePhase2AuthSelect = $('#window_vpnprofile_phase2auth').selectize({
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
    	VpnProfilePhase2AuthSelect = $VpnProfilePhase2AuthSelect[0].selectize;
    },
    initPhase2DhgSelect: function() {
    	$VpnProfilePhase2DhgSelect = $('#window_vpnprofile_phase2dhg').selectize({
    		options: [
                {value: '1', title: '1 (DH768)'},
                {value: '2', title: '2 (DH1024)'},
                {value: '5', title: '5 (DH1536)'},
                {value: '14', title: '14 (DH2048)'},
                {value: '15', title: '15 (DH3072)'},
                {value: '16', title: '16 (DH4096)'},
            ],
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
		VpnProfilePhase2DhgSelect = $VpnProfilePhase2DhgSelect[0].selectize;
    },
    initEncapLocalEndpointSelect: function() {
    	var REGEX_IPV4 = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    	$VpnProfileEncapLocalEndpointSelect = $('#window_vpnprofile_encaplocalendpoint').selectize({
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
                alert('Invalid value group.');
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
		VpnProfileEncapLocalEndpointSelect = $VpnProfileEncapLocalEndpointSelect[0].selectize;
		VpnProfileEncapLocalEndpointSelect.load(function(callback) {
			encap_local_endpoint_xhr && encap_local_endpoint_xhr.abort();
			encap_local_endpoint_xhr = $.ajax({
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
    initEncapRemoteEndpointSelect: function() {
    	var REGEX_IPV4 = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    	$VpnProfileEncapRemoteEndpointSelect = $('#window_vpnprofile_encapremoteendpoint').selectize({
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
                alert('Invalid value group.');
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
		VpnProfileEncapRemoteEndpointSelect = $VpnProfileEncapRemoteEndpointSelect[0].selectize;
		VpnProfileEncapRemoteEndpointSelect.load(function(callback) {
			encap_remote_endpoint_xhr && encap_remote_endpoint_xhr.abort();
			encap_remote_endpoint_xhr = $.ajax({
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
    initEncapServiceSelect: function() {
    	$VpnProfileEncapSerivceSelect = $('#window_vpnprofile_encapservice').selectize({
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
		VpnProfileEncapServiceSelect = $VpnProfileEncapServiceSelect[0].selectize;
		VpnProfileEncapServiceSelect.load(function(callback) {
			encap_service_xhr && encap_service_xhr.abort();
			encap_service_xhr = $.ajax({
                url: '/objects/protocol/getlist',
                success: function(results) {
                    callback(results);
                },
                error: function() {
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
        var $formValidate = $('#window_vpnprofile_form');

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
