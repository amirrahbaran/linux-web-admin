var NetworkingEthernetModalWindow;
var remainedEthernetInterface, ethernet_xhr;
var NetworkingEthernetInterfaceSelect, $NetworkingEthernetInterfaceSelect, interface_xhr;
var NetworkingEthernetIpv4AddressSelect, $NetworkingEthernetIpv4AddressSelect, address_xhr;
var NetworkingEthernetGatewaySelect, $NetworkingEthernetGatewaySelect, gateway_xhr;
var NetworkingEthernetDnsServerSelect, $NetworkingEthernetDnsServerSelect, dns_xhr;
var CurrentPage = 1;

$(function() {
    NetworkingEthernet.loadTable();
    NetworkingEthernet.init();
    NetworkingEthernet.save();
    NetworkingEthernet.char_words_counter();
    NetworkingEthernet.form_validator();
	NetworkingEthernet.loadElementsEvent();
});

NetworkingEthernet = {
	init: function() {
    	$(document).ready(function () {
        	NetworkingEthernetModalWindow = UIkit.modal("#window_NetworkingEthernet");
    	});
    },
    setRemainedEthernetInterface: function () {
	    ethernet_xhr && ethernet_xhr.abort();
        ethernet_xhr = $.ajax({
            url: '/networking/ethernet/getrealethernets',
            type: 'GET',
            dataType: 'json',
            success: function(record) {
                remainedEthernetInterface = record.length;
            },
            error: function() {
                console.log("error has occured!!!");
                callback();
            }
        });
    },
    isRunOutEthernetInterfaces: function () {
        if ( remainedEthernetInterface === 0 ) {
            UIkit.notify({
                message : "There is no ethernet interfaces to define!",
                status  : "warning",
                timeout : 2000,
                pos     : 'top-center'
            });
            return true;
        }
        return false;
    },
    add: function(){
	    if ( this.isRunOutEthernetInterfaces() )
	        return false;
    	if ( NetworkingEthernetModalWindow.isActive() ) {
			NetworkingEthernetModalWindow.hide();
		} else {
			NetworkingEthernetModalWindow.show();
		}
		this.clearValidationErrors();
		this.loadAllSelects();

		$("#window_networkingethernet_title").text(" Add new ethernet ");
		$("#window_networkingethernet_id").val("0");
		$("#window_networkingethernet_row").val(parseInt($("#records_number").val())+1);
		$("#window_networkingethernet_name").val("");
		$("#window_networkingethernet_desc").val("");
		$("#window_networkingethernet_link").val("");
		$("#window_networkingethernet_status").iCheck('check');
		NetworkingEthernetInterfaceSelect.setValue();
		$("#window_networkingethernet_dhcp").iCheck('check');
		NetworkingEthernetIpv4AddressSelect.setValue();
		NetworkingEthernetIpv4AddressSelect.disable();
		NetworkingEthernetGatewaySelect.setValue();
		NetworkingEthernetGatewaySelect.disable();
		$("#window_networkingethernet_manualdns").iCheck('uncheck');
		NetworkingEthernetDnsServerSelect.setValue();
		NetworkingEthernetDnsServerSelect.disable();
		$("#window_networkingethernet_mtu").val("1500");
		$("#window_networkingethernet_manualmss").iCheck('uncheck');
		$("#window_networkingethernet_mss").val("1460");
		$('#window_networkingethernet_mss').prop("disabled", true);
		$("#window_networkingethernet_name").focus();
    },
    edit: function(obj){
		var $eventTargetId = obj.id.split("-");
		if ( NetworkingEthernetModalWindow.isActive() ) {
			NetworkingEthernetModalWindow.hide();
		} else {
			NetworkingEthernetModalWindow.show();
		}
		this.clearValidationErrors();
        this.loadAllSelects();

		$.getJSON( "/networking/ethernet/view", {
    		EthernetId: $eventTargetId[2]
    	}, function(record) {
			$('#window_networkingethernet_title').text(" Edit ethernet object ( "+record[0].Name+" ) ");
    		$('#window_networkingethernet_id').val(record[0].EthernetId);
			$('#window_networkingethernet_row').val($eventTargetId[1]);
			$('#window_networkingethernet_link').val(record[0].Link);
			NetworkingEthernetInterfaceSelect.addOption({
				name: record[0].Name,
				value: record[0].Name
			});
			NetworkingEthernetInterfaceSelect.setValue([record[0].Name]);
			NetworkingEthernetInterfaceSelect.disable();
			$('#window_networkingethernet_desc').val(record[0].Description);
            if (record[0].Status === true) {
				$('#window_networkingethernet_status').iCheck('check');
            }

            var addresses = record[0].IPv4Address.split(",");
			for (var i = 0; i < addresses.length; i++) {
				NetworkingEthernetIpv4AddressSelect.addOption({
					name: addresses[i],
					value: addresses[i]
				});
			}
			NetworkingEthernetIpv4AddressSelect.setValue(addresses);
            NetworkingEthernetGatewaySelect.setValue([record[0].Gateway]);
            if (record[0].Dhcp === true) {
				$('#window_networkingethernet_dhcp').iCheck('check');
				NetworkingEthernetIpv4AddressSelect.disable();
				NetworkingEthernetGatewaySelect.disable();
            }

			var dns_servers = record[0].DnsServer.split(",");
			for (var eachDns in dns_servers) {
				NetworkingEthernetDnsServerSelect.addOption({
					name: dns_servers[eachDns],
					value: dns_servers[eachDns]
				});
			}
			NetworkingEthernetDnsServerSelect.setValue(dns_servers);
            if (record[0].ManualDns === true) {
				$('#window_networkingethernet_manualdns').iCheck('check');
				NetworkingEthernetDnsServerSelect.enable();
            } else {
                $('#window_networkingethernet_manualdns').iCheck('uncheck');
				NetworkingEthernetDnsServerSelect.disable();
            }

			$('#window_networkingethernet_mtu').val(record[0].Mtu);
			$('#window_networkingethernet_mss').val(record[0].Mss);
            if (record[0].ManualMss === true) {
				$('#window_networkingethernet_manualmss').iCheck('check');
                $('#window_networkingethernet_mss').prop("disabled", false);
            } else {
                $('#window_networkingethernet_mss').prop("disabled", true);
            }
		});
		$('#window_networkingethernet_name').focus();
    },
    remove: function(obj){
    	var $eventTarget = obj;
    	var $eventTargetId = obj.id.split("-");
    	UIkit.modal.confirm('Are you sure you want to delete this item?', function(){
        	$.ajax({
        		type: 'POST',
        		url: "/networking/ethernet/delete",
        		data: {
        			EthernetId: $eventTargetId[2],
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
            			NetworkingEthernet.reloadTable(CurrentPage);
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
        $("#window_networkingethernet_save").click( function() {
        	var row_number = $('#window_networkingethernet_row').val();
        	var NetworkingEthernet_id = $('#window_networkingethernet_id').val();

			var NetworkingEthernet_link = $('#window_networkingethernet_link').val();

			var NetworkingEthernet_status = "off";
            if($('#window_networkingethernet_status').is(':checked')) {
        		NetworkingEthernet_status = "on";
            }

			var $FieldName = "";
			$FieldName = $('#window_networkingethernet_name');
			if (NetworkingEthernet.isNotValid($FieldName)) return;
			var NetworkingEthernet_name = NetworkingEthernetInterfaceSelect.getValue();

			$FieldName = $('#window_networkingethernet_desc');
			if (NetworkingEthernet.isNotValid($FieldName)) return;
			var NetworkingEthernet_desc = $FieldName.val();

			var NetworkingEthernet_dhcp = "off";
			var NetworkingEthernet_ipv4addr = "";
			var NetworkingEthernet_gateway = "";
            if($('#window_networkingethernet_dhcp').is(':checked')) {
                NetworkingEthernet_dhcp = "on";
            }

            if (NetworkingEthernet_dhcp === "off") {
				$FieldName = $('#window_networkingethernet_ipv4addr');
				if (NetworkingEthernet.isNotValid($FieldName)) return;
				NetworkingEthernet_ipv4addr = NetworkingEthernetIpv4AddressSelect.getValue().join(",");

				$FieldName = $('#window_networkingethernet_gateway');
				if (NetworkingEthernet.isNotValid($FieldName)) return;
				NetworkingEthernet_gateway = NetworkingEthernetGatewaySelect.getValue();
            }

			var NetworkingEthernet_manualdns = "off";
			var NetworkingEthernet_dnsserver = "";
            if($('#window_networkingethernet_manualdns').is(':checked')) {
                NetworkingEthernet_manualdns = "on";
				$FieldName = $('#window_networkingethernet_dnsserver');
				if (NetworkingEthernet.isNotValid($FieldName)) return;
				NetworkingEthernet_dnsserver = NetworkingEthernetDnsServerSelect.getValue().join(",");
            }

			$FieldName = $('#window_networkingethernet_mtu');
			if (NetworkingEthernet.isNotValid($FieldName)) return;
			var NetworkingEthernet_mtu = $FieldName.val();

			var NetworkingEthernet_manualmss = "off";
			var NetworkingEthernet_mss = "1460";
            if($('#window_networkingethernet_manualmss').is(':checked')) {
                NetworkingEthernet_manualmss = "on";
				$FieldName = $('#window_networkingethernet_mss');
				if (NetworkingEthernet.isNotValid($FieldName)) return;
				NetworkingEthernet_mss = $FieldName.val();
            }

            $('#window_networkingethernet_save').addClass("disabled");

        	var target_url = '';
        	if ( NetworkingEthernet_id === "0" ) {
        		target_url = '/networking/ethernet/create';
        	} else {
        		target_url = '/networking/ethernet/update';
        	}

        	$.ajax({
        		type: 'POST',
        		url: target_url,
        		data: {
        			EthernetId: NetworkingEthernet_id,
            		Name: NetworkingEthernet_name,
            		Description: NetworkingEthernet_desc,
            		Status: NetworkingEthernet_status,
            		Link: NetworkingEthernet_link,
					Dhcp: NetworkingEthernet_dhcp,
					IPv4Address: NetworkingEthernet_ipv4addr,
					Gateway: NetworkingEthernet_gateway,
					ManualDns: NetworkingEthernet_manualdns,
					DnsServer: NetworkingEthernet_dnsserver,
					Mtu: NetworkingEthernet_mtu,
					ManualMss: NetworkingEthernet_manualmss,
					Mss: NetworkingEthernet_mss,
            		},
        		dataType: 'json',
        		success: function(json) {
    				$('#window_networkingethernet_save').removeClass("disabled");
        			if (json.Result == "OK") {
						NetworkingEthernet.unloadAllSelects();
        				NetworkingEthernetModalWindow.hide();
                        NetworkingEthernet.reloadTable(CurrentPage);
            			setTimeout(UIkit.notify({
                            message : json.Message,
                            status  : json.Status,
                            timeout : 2000,
                            pos     : 'top-center'
                        }), 5000);
        			} else {
        				if (json.Result == "DUP"){
        					$("#invalid-form-error-message").text(json.Message);
        					$("#window_networkingethernet_name").select();
        					NetworkingEthernet.fadeInvalidFormErrorMessage();
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
						.attr({'href':'#','onclick':'NetworkingEthernet.reloadTable( 1,' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-left')
						)
					)
				)
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'NetworkingEthernet.reloadTable('+ previous_page + ',' + page_size + ')'})
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
							.attr({'href':'#','onclick':'NetworkingEthernet.reloadTable('+index_page+','+page_size+')'})
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
						.attr({'href':'#','onclick':'NetworkingEthernet.reloadTable('+ next_page + ',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-right')
						)
					)
				)
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'NetworkingEthernet.reloadTable( '+ total_pages +',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-right')
						)
					)
				);
		}
		CurrentPage = current_page;
    },
	reloadTable: function (page_number,page_size) {
    	NetworkingEthernet.clearTable();
		NetworkingEthernet.loadTable(page_number,page_size);
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
					NetworkingEthernet.reloadTable(CurrentPage);
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
    		url: "/networking/ethernet/read",
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
    			    NetworkingEthernet.loadTable(--page_number,page_size);
                } else {
                    NetworkingEthernet.perform(json.Records,"drawTable");
                    NetworkingEthernet.loadPagination(page_number,page_size,total_record_count);
                }
    		}
		});
    },
    perform: function (recordList,what) {
    	var row_number = $('#window_networkingethernet_row').val(); // for addRow and editRow
		if (what === "drawTable")
			row_number = 0;
		var IPv4AddressSegments = [];
		$.each(recordList, function(eachRecordIndex, eachRecord) {
			if (what === "drawTable")
				row_number = eachRecordIndex + 1;
			// else addRow and editRow

			if (what === "editRow") {
    			$("#name-"+row_number).text(eth[0].Name);
    			$("#description-"+row_number).text(eth[0].Description);
    			if (eth[0].DHCP){
        			$("#ipv4address-"+row_number).text("None");
    			} else {
        			$("#ipv4address-"+row_number).text(eth[0].IPv4Address);
        			// $("#netmask-"+row_number).text(eth[0].Netmask);
    			}
    			var gateway = "None";
    			if (eth[0].Gateway)
    				gateway = eth[0].Gateway;
    			$("#gateway-"+row_number).text(gateway);

    			var DnsServer = "None";
    			if (eth[0].DnsServer)
    				DnsServer = eth[0].DnsServer;
    			$("#dnsserver-"+row_number).text("DNS Servers: "+DnsServer);

    			// var SecDNS = "None";
    			// if (eth[0].SecondaryDNS)
    			// 	SecDNS = eth[0].SecondaryDNS;
    			// $("#secondary_dns-"+row_number).text(SecDNS);

    			$("#mtu-"+row_number).text(eth[0].MTU);
    			$("#mss-"+row_number).text(eth[0].MSS);

    			if(eth[0].Status === true) {
    				$("#status_anchor-"+row_number).attr("title","Enabled");
    				$("#status_image-"+row_number).attr({"alt":"Enabled", "src":"/static/assets/img/md-images/toggle-switch.png"});
    			} else {
    				$("#status_anchor-"+row_number).attr("title","Disabled");
    				$("#status_image-"+row_number).attr({"alt":"Disabled", "src":"/static/assets/img/md-images/toggle-switch-off.png"});
    			}

    			if(eth[0].Link === true){
    				$("#link_anchor-"+row_number).attr("title","Connected");
    				$("#link_image-"+row_number).attr({"alt":"Connected", "src":"/static/assets/img/md-images/lan-connect.png"});
    			} else {
    				$("#link_anchor-"+row_number).attr("title","Disconnected");
    				$("#link_image-"+row_number).attr({"alt":"Disconnected", "src":"/static/assets/img/md-images/lan-disconnect.png"});
    			}

    			if(eth[0].Dhcp === true){
    				$("#dhcp_anchor-"+row_number).attr("title","Auto");
    				$("#dhcp_image-"+row_number).attr({"alt":"Auto", "src":"/static/assets/img/md-images/server-network.png"});
    			} else {
    				$("#dhcp_anchor-"+row_number).attr("title","Manually");
    				$("#dhcp_image-"+row_number).attr({"alt":"Manually", "src":"/static/assets/img/md-images/server-network-off.png"});
    			}
			} else { // for addRow and drawTable

                var status_tooltip = "Disabled";
				var status_icon = "/static/assets/img/md-images/toggle-switch-off.png";
				if(eachRecord.Status === true){
					status_tooltip = "Enabled";
					status_icon = "/static/assets/img/md-images/toggle-switch.png";
				}

				var link_tooltip = "Disconnected";
				var link_icon = "/static/assets/img/md-images/lan-disconnect.png";
				if(eachRecord.Link === true){
					link_tooltip = "Connected";
					link_icon = "/static/assets/img/md-images/lan-connect.png";
				}

                var dhcp_tooltip = "Manually";
				var dhcp_icon = "/static/assets/img/md-images/server-network-off.png";
				if(eachRecord.Dhcp === true){
					dhcp_tooltip = "Auto";
					dhcp_icon = "/static/assets/img/md-images/server-network.png";
				}

				var IPv4AddressValue = 'None';
				var NetmaskValue = 'None';
				if (eachRecord.IPv4Address){
                    IPv4AddressSegments = eachRecord.IPv4Address.split("/");
                    IPv4AddressValue = IPv4AddressSegments[0];
                    NetmaskValue = IPv4AddressSegments[1];
                }
				var GatewayValue = 'None';
				if (eachRecord.Gateway){
				    GatewayValue = eachRecord.Gateway;
                }
				var DnsServerValue = 'None';
				if (eachRecord.DnsServer){
				    DnsServerValue = eachRecord.DnsServer;
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
				        		.attr('class','uk-width-2-10')
				        		.append($('<div>')
	    			        		.attr('class','uk-grid')
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-large','id':'ipv4address-'+row_number})
	    			        				.text(IPv4AddressValue)
				        				)
			        				)
                                    .append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'netmask-'+row_number})
	    			        				.text(NetmaskValue)
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
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'gateway-'+row_number})
	    			        				.text("Gateway: "+GatewayValue)
				        				)
			        				)
									.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'dnsserver-'+row_number})
	    			        				.text("DNS Servers: "+DnsServerValue)
				        				)
			        				)
		        				)
	        				)
	        				.append($('<div>')
				        		.attr('class','uk-width-1-10')
				        		.append($('<div>')
	    			        		.attr('class','uk-grid')
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'mtu-'+row_number})
	    			        				.text("MTU: "+eachRecord.Mtu)
				        				)
			        				)
									.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'mss-'+row_number})
	    			        				.text("MSS: "+eachRecord.Mss)
				        				)
			        				)

		        				)
	        				)
	        				.append($('<div>')
				        		.attr('class','uk-width-3-10')
				        		.append($('<div>')
			        				.attr({'class':'uk-grid uk-grid-medium','data-uk-grid-margin':'','data-uk-grid-match':"{target:'.md-card'}"})
									.append($('<div>')
				        				.attr('class','uk-width-1-5')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': status_tooltip,
				        						'style':'cursor:default;',
				        						'href': '#',
				        						'id':'status_anchor-'+row_number+'-'+eachRecord.EthernetId
				        						})
			        						.append($('<img>')
		        								.attr({
		        									'src': status_icon,
		        									'alt': status_tooltip,
		        									'id': 'status_image-'+row_number+'-'+eachRecord.EthernetId
		        									})
	    									)
										)
			        				)
			        				.append($('<div>')
				        				.attr('class','uk-width-1-5')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': link_tooltip,
				        						'style':'cursor:default;',
				        						'href': '#',
				        						'id':'link_anchor-'+row_number+'-'+eachRecord.EthernetId
				        						})
			        						.append($('<img>')
		        								.attr({
		        									'src': link_icon,
		        									'alt': link_tooltip,
		        									'id': 'link_image-'+row_number+'-'+eachRecord.EthernetId
		        									})
	    									)
										)
			        				)
			        				.append($('<div>')
				        				.attr('class','uk-width-1-5')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': dhcp_tooltip,
				        						'style':'cursor:default;',
				        						'href': '#',
				        						'id':'dhcp_anchor-'+row_number+'-'+eachRecord.EthernetId
				        						})
			        						.append($('<img>')
		        								.attr({
		        									'src': dhcp_icon,
		        									'alt': dhcp_tooltip,
		        									'id': 'dhcp_image-'+row_number+'-'+eachRecord.EthernetId
		        									})
	    									)
										)
			        				)
			        				.append($('<div>')
				        				.attr('class','uk-width-1-5')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': 'Delete',
				        						'onclick':'NetworkingEthernet.remove(this)',
				        						'href': '#',
				        						'id':'delete_NetworkingEthernet-'+row_number+'-'+eachRecord.EthernetId
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
				        				.attr('class','uk-width-1-5')
		    			        		.append($('<a>')
	    			        				.attr({
	    			        					'data-uk-tooltip':"{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}",
				        						'title': 'Edit',
				        						'onclick':'NetworkingEthernet.edit(this)',
				        						'href': '#',
				        						'id':'edit_NetworkingEthernet-'+row_number+'-'+eachRecord.EthernetId
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
		this.refreshTable();
		this.setRemainedEthernetInterface();
    },
    initInterfaceSelect: function () {
    	$NetworkingEthernetInterfaceSelect = $('#window_networkingethernet_name').selectize({
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
        NetworkingEthernetInterfaceSelect = $NetworkingEthernetInterfaceSelect[0].selectize;
        NetworkingEthernetInterfaceSelect.load(function(callback) {
            interface_xhr && interface_xhr.abort();
            interface_xhr = $.ajax({
                url: '/networking/ethernet/getrealethernets',
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
    initIpv4AddressSelect: function () {
    	var REGEX_IPV4 = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)+(\/([0-9]|[1-2][0-9]|3[0-2])){0,1}';
    	$NetworkingEthernetIpv4AddressSelect = $('#window_networkingethernet_ipv4addr').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 15,
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
        NetworkingEthernetIpv4AddressSelect = $NetworkingEthernetIpv4AddressSelect[0].selectize;
        NetworkingEthernetIpv4AddressSelect.load(function(callback) {
            address_xhr && address_xhr.abort();
            address_xhr = $.ajax({
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
    initGatewaySelect: function () {
    	var REGEX_GATEWAY = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    	$NetworkingEthernetGatewaySelect = $('#window_networkingethernet_gateway').selectize({
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

                regex = new RegExp('^' + REGEX_GATEWAY + '$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[0]);

                regex = new RegExp('^([^<]*)\<' + REGEX_GATEWAY + '\>$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[2]);

                return false;
            },
            create: function(input) {
                if ((new RegExp('^' + REGEX_GATEWAY + '$', 'i')).test(input)) {
                    return {value: input};
                }
                var match = input.match(new RegExp('^([^<]*)\<' + REGEX_GATEWAY + '\>$', 'i'));
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
        NetworkingEthernetGatewaySelect = $NetworkingEthernetGatewaySelect[0].selectize;
        NetworkingEthernetGatewaySelect.load(function(callback) {
            gateway_xhr && gateway_xhr.abort();
            gateway_xhr = $.ajax({
                url: '/objects/address/gethostlist',
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
    initDnsServerSelect: function () {
    	var REGEX_DNS = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    	$NetworkingEthernetDnsServerSelect = $('#window_networkingethernet_dnsserver').selectize({
    		plugins: {
                'remove_button': {
                    label     : ''
                }
            },
			maxItems: 2,
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

                regex = new RegExp('^' + REGEX_DNS + '$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[0]);

                regex = new RegExp('^([^<]*)\<' + REGEX_DNS + '\>$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[2]);

                return false;
            },
            create: function(input) {
                if ((new RegExp('^' + REGEX_DNS + '$', 'i')).test(input)) {
                    return {value: input};
                }
                var match = input.match(new RegExp('^([^<]*)\<' + REGEX_DNS + '\>$', 'i'));
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
        NetworkingEthernetDnsServerSelect = $NetworkingEthernetDnsServerSelect[0].selectize;
        NetworkingEthernetDnsServerSelect.load(function(callback) {
            dns_xhr && dns_xhr.abort();
            dns_xhr = $.ajax({
                url: '/objects/address/gethostlist',
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
        var $formValidate = $('#window_networkingethernet_form');

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
	clearValidationErrors: function () {
		var $formValidate = $('#window_networkingethernet_form');
		var FormInstance = $formValidate.parsley();
    	FormInstance.reset();
    },
	loadAllSelects: function(){
        NetworkingEthernet.initInterfaceSelect();
        NetworkingEthernet.initIpv4AddressSelect();
        NetworkingEthernet.initGatewaySelect();
        NetworkingEthernet.initDnsServerSelect();
    },
	unloadAllSelects: function(){
		NetworkingEthernetInterfaceSelect.destroy();
		NetworkingEthernetIpv4AddressSelect.destroy();
		NetworkingEthernetGatewaySelect.destroy();
		NetworkingEthernetDnsServerSelect.destroy();
	},
	loadElementsEvent: function() {
		$('#window_networkingethernet_dhcp').on('ifChecked', function(event){
			NetworkingEthernetIpv4AddressSelect.disable();
			NetworkingEthernetGatewaySelect.disable();
		});
		$('#window_networkingethernet_dhcp').on('ifUnchecked', function(event){
			NetworkingEthernetIpv4AddressSelect.enable();
			NetworkingEthernetGatewaySelect.enable();
        });
		$('#window_networkingethernet_manualdns').on('ifChecked', function(event){
			NetworkingEthernetDnsServerSelect.enable();
		});
		$('#window_networkingethernet_manualdns').on('ifUnchecked', function(event){
			NetworkingEthernetDnsServerSelect.disable();
		});
		$('#window_networkingethernet_manualmss').on('ifChecked', function(event){
			$('#window_networkingethernet_mss').prop("disabled", false);
		});
		$('#window_networkingethernet_manualmss').on('ifUnchecked', function(event){
			$("#window_networkingethernet_mss").val("");
			$('#window_networkingethernet_mss').prop("disabled", true);
		});
    }
};
