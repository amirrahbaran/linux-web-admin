var AddressObjectModalWindow;
var $AddressObjectTypeSelect, AddressObjectTypeSelect;
var $AddressObjectNetmaskSelect, AddressObjectNetmaskSelect, netmask_xhr;
var $AddressObjectGroupSelect, AddressObjectGroupSelect, group_xhr;
var CurrentPage = 1;

$(function() {
    AddressObject.loadTable();
    AddressObject.init();
    AddressObject.save();
    AddressObject.char_words_counter();
    AddressObject.form_validator();
});

AddressObject = {
	init: function() {
    	$(document).ready(function () {
        	AddressObjectModalWindow = UIkit.modal("#window_AddressObject");
        	AddressObject.initTypeSelect();
            AddressObject.initNetmaskSelect();
    	});
    },
    add: function(){
    	if ( AddressObjectModalWindow.isActive() ) {
			AddressObjectModalWindow.hide();
		} else {
			AddressObjectModalWindow.show();
		}
		AddressObject.clearValidationErrors();
		AddressObject.initGroupSelect();

		$("#window_addressobject_title").text(" Add new address ");
		$("#window_addressobject_id").val("0");
		$("#window_addressobject_row").val(parseInt($("#records_number").val())+1);
		$("#window_addressobject_name").val("");
		$("#window_addressobject_desc").val("");
		AddressObjectGroupSelect.setValue();
		if ($('#window_addressobject_version').length)
			$('#window_addressobject_version').selectize();
		$('.ipv4').hide();
		$('#subnet').show();
		AddressObjectTypeSelect.setValue(['subnet']);
		$("#window_addressobject_ipv4addr").val("");
		AddressObjectNetmaskSelect.setValue();
		$("#window_addressobject_name").focus();
    },
    edit: function(obj){
		var $eventTargetId = obj.id.split("-");
		if ( AddressObjectModalWindow.isActive() ) {
			AddressObjectModalWindow.hide();
		} else {
			AddressObjectModalWindow.show();
		}
		AddressObject.clearValidationErrors();
		AddressObject.initGroupSelect();

		$.getJSON( "/objects/address/view", {
    		AddressObjectId: $eventTargetId[2]
    	}, function(record) {
			$("#window_addressobject_title").text(" Edit address object ( "+record[0].Name+" ) ");
    		$("#window_addressobject_id").val(record[0].AddressObjectId);
			$("#window_addressobject_row").val($eventTargetId[1]);
			$("#window_addressobject_name").val(record[0].Name);
			$("#window_addressobject_desc").val(record[0].Description);
            AddressObjectGroupSelect.setValue([record[0].Group]);
            AddressObjectTypeSelect.setValue([record[0].Type]);
            switch (record[0].Type) {
                case "subnet":
                    ipv4_segments = record[0].Value.split("/");
                    $("#window_addressobject_ipv4addr").val(ipv4_segments[0]);
                    AddressObjectNetmaskSelect.setValue("/"+ipv4_segments[1]);
                    break;
                case "mac":
                    $("#window_addressobject_mac").val(record[0].Value);
                    break;
                case "iprange":
                    ipv4range = record[0].Value.split("-");
                    $("#window_addressobject_ipv4rangefrom").val(ipv4range[0]);
                    $("#window_addressobject_ipv4rangeto").val(ipv4range[1]);
                    break;
                case "fqdn":
                    $("#window_addressobject_fqdn").val(record[0].Value);
                    break;
            }
		});
		$("#window_addressobject_name").focus();
    },
    remove: function(obj){
    	var $eventTarget = obj;
    	var $eventTargetId = obj.id.split("-");
    	UIkit.modal.confirm('Are you sure you want to delete this item?', function(){
        	$.ajax({
        		type: 'POST',
        		url: "/objects/address/delete",
        		data: {
        			AddressObjectId: $eventTargetId[2],
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
            			AddressObject.reloadTable(CurrentPage);
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
        $("#window_addressobject_save").click( function() {
        	var row_number = $('#window_addressobject_row').val();
        	var AddressObject_id = $('#window_addressobject_id').val();

			var $FieldName = "";
			$FieldName = $('#window_addressobject_name');
			if (AddressObject.isNotValid($FieldName)) return;
			var AddressObject_name = $FieldName.val();

			$FieldName = $('#window_addressobject_desc');
			if (AddressObject.isNotValid($FieldName)) return;
			var AddressObject_desc = $FieldName.val();

			$FieldName = $('#window_addressobject_group');
			if (AddressObject.isNotValid($FieldName)) return;
			var AddressObject_group = AddressObjectGroupSelect.getValue();

			$FieldName = $('#window_addressobject_type');
			if (AddressObject.isNotValid($FieldName)) return;
			var AddressObject_type = AddressObjectTypeSelect.getValue();

        	var AddressObject_value = "";
        	switch ( AddressObject_type ) {
				case "subnet":
					$FieldName = $('#window_addressobject_ipv4addr');
					if (AddressObject.isNotValid($FieldName)) return;
					AddressObject_value = $FieldName.val();
        	        var netmask_val = "/32";
					if ( AddressObjectNetmaskSelect.getValue() !== "" )
						netmask_val = AddressObjectNetmaskSelect.getValue();
					AddressObject_value += netmask_val;
					break;
				case "mac":
					$FieldName = $('#window_addressobject_mac');
					if (AddressObject.isNotValid($FieldName)) return;
					AddressObject_value = $FieldName.val();
					break;
				case "iprange":
					$FieldName = $('#window_addressobject_ipv4rangefrom');
					if (AddressObject.isNotValid($FieldName)) return;
					AddressObject_value = $FieldName.val();
					AddressObject_value += "-";
					$FieldName = $('#window_addressobject_ipv4rangeto');
					if (AddressObject.isNotValid($FieldName)) return;
					AddressObject_value += $FieldName.val();
					break;
				case "fqdn":
					$FieldName = $('#window_addressobject_fqdn');
					if (AddressObject.isNotValid($FieldName)) return;
					AddressObject_value = $FieldName.val();
					break;
			}

            $('#window_addressobject_save').addClass("disabled");

        	var target_url = '';
        	if ( AddressObject_id === "0" ) {
        		target_url = '/objects/address/create';
        	} else {
        		target_url = '/objects/address/update';
        	}

        	$.ajax({
        		type: 'POST',
        		url: target_url,
        		data: {
        			AddressObjectId: AddressObject_id,
            		Name: AddressObject_name,
            		Description: AddressObject_desc,
            		Group: AddressObject_group,
					Version: "ipv4",
					Type: AddressObject_type,
            		Value: AddressObject_value
            		},
        		dataType: 'json',
        		success: function(json) {
    				$('#window_addressobject_save').removeClass("disabled");
        			if (json.Result == "OK") {
						AddressObjectGroupSelect.destroy();
        				AddressObjectModalWindow.hide();
                        AddressObject.reloadTable(CurrentPage);
            			setTimeout(UIkit.notify({
                            message : json.Message,
                            status  : json.Status,
                            timeout : 2000,
                            pos     : 'top-center'
                        }), 5000);
        			} else {
        				if (json.Result == "DUP"){
        					$("#invalid-form-error-message").text(json.Message);
        					$("#window_addressobject_name").select();
        					AddressObject.fadeInvalidFormErrorMessage();
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
						.attr({'href':'#','onclick':'AddressObject.reloadTable( 1,' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-left')
						)
					)
				)
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'AddressObject.reloadTable('+ previous_page + ',' + page_size + ')'})
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
							.attr({'href':'#','onclick':'AddressObject.reloadTable('+index_page+','+page_size+')'})
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
						.attr({'href':'#','onclick':'AddressObject.reloadTable('+ next_page + ',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-right')
						)
					)
				)
				.append($('<li>')
					.append($('<a>')
						.attr({'href':'#','onclick':'AddressObject.reloadTable( '+ total_pages +',' + page_size + ')'})
						.append($('<i>')
							.attr('class', 'uk-icon-angle-double-right')
						)
					)
				);
		}
		CurrentPage = current_page;
    },
	reloadTable: function (page_number,page_size) {
    	AddressObject.clearTable();
		AddressObject.loadTable(page_number,page_size);
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
					AddressObject.reloadTable(CurrentPage);
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
    		url: "/objects/address/read",
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
    			    AddressObject.loadTable(--page_number,page_size);
                } else {
                    AddressObject.perform(json.Records,"drawTable");
                    AddressObject.loadPagination(page_number,page_size,total_record_count);
                }
    		}
		});
    },
    perform: function (recordList,what) {
    	var row_number = $('#window_addressobject_row').val(); // for addRow and editRow
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
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'group-'+row_number})
	    			        				.text("Group: "+eachRecord.Group)
				        				)
			        				)
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'version-'+row_number})
	    			        				.text("Version: "+eachRecord.Version)
				        				)
			        				)
		        				)
	        				)
	        				.append($('<div>')
				        		.attr('class','uk-width-4-10')
				        		.append($('<div>')
	    			        		.attr('class','uk-grid')
	    			        		.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-middle','id':'value-'+row_number})
	    			        				.text(eachRecord.Value)
				        				)
			        				)
									.append($('<div>')
				        				.attr('class','uk-width-1-1')
		    			        		.append($('<span>')
	    			        				.attr({'class':'uk-text-muted uk-text-small','id':'type-'+row_number})
	    			        				.text("Type: "+eachRecord.Type)
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
				        						'onclick':'AddressObject.remove(this)',
				        						'href': '#',
				        						'id':'delete_AddressObject-'+row_number+'-'+eachRecord.AddressObjectId
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
				        						'onclick':'AddressObject.edit(this)',
				        						'href': '#',
				        						'id':'edit_AddressObject-'+row_number+'-'+eachRecord.AddressObjectId
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
		AddressObject.refreshTable();
    },
    initTypeSelect: function() {
    	$AddressObjectTypeSelect = $('#window_addressobject_type').selectize({
    		options: [
                {value: 'subnet', title: 'Subnet'},
                {value: 'mac', title: 'MAC'},
                {value: 'iprange', title: 'IP Range'},
                {value: 'fqdn', title: 'FQDN'}
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
				$('.ipv4').hide();
				$('#' + $dropdown).show();
            }
    	});
    	AddressObjectTypeSelect = $AddressObjectTypeSelect[0].selectize;
    },
    initNetmaskSelect: function() {
		var REGEX_IPV4 = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    	$AddressObjectNetmaskSelect = $('#window_addressobject_netmask').selectize({
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
		AddressObjectNetmaskSelect = $AddressObjectNetmaskSelect[0].selectize;
        AddressObjectNetmaskSelect.load(function(callback) {
            netmask_xhr && netmask_xhr.abort();
            netmask_xhr = $.ajax({
                url: '/static/data/netmask.json',
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
    initGroupSelect: function() {
    	var REGEX_ObjectGroup = '[a-zA-Z][a-zA-Z0-9-_\.\s]{2,30}';
    	$AddressObjectGroupSelect = $('#window_addressobject_group').selectize({
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

                regex = new RegExp('^' + REGEX_ObjectGroup + '$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[0]);

                regex = new RegExp('^([^<]*)\<' + REGEX_ObjectGroup + '\>$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[2]);

                return false;
            },
            create: function(input) {
                if ((new RegExp('^' + REGEX_ObjectGroup + '$', 'i')).test(input)) {
                    return {value: input};
                }
                var match = input.match(new RegExp('^([^<]*)\<' + REGEX_ObjectGroup + '\>$', 'i'));
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
		AddressObjectGroupSelect = $AddressObjectGroupSelect[0].selectize;
		AddressObjectGroupSelect.load(function(callback) {
			group_xhr && group_xhr.abort();
			group_xhr = $.ajax({
                url: '/objects/address/getgroup',
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
        var $formValidate = $('#window_addressobject_form');

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
		var $formValidate = $('#window_addressobject_form');
		var FormInstance = $formValidate.parsley();
    	FormInstance.reset();
    }
};
