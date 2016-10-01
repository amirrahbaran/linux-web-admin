/*
*  NGFW Admin
*  page_objects_zone.js (page_objects_zone.html)
*/
var network_interfaces = [ "ETH0", "ETH1", "ETH2", "ETH4", "ETH5"]; 

$(function() {
    // zone crud table
    ngfw_objects_zone.init();	
});

ngfw_objects_zone = {
	init: function() {
        $('#zone_crud').jtable({
            title: '',
            paging: true, //Enable paging
            pageSize: 10, //Set page size (default: 10)
            addRecordButton: $('#zoneAdd'),
            deleteConfirmation: function(data) {
                data.deleteConfirmMessage = 'Are you sure to delete zone object ' + data.record.Name + '?';
            },
            formCreated: function(event, data) {
                // replace click event on some clickable elements
                // to make icheck label works
                data.form.find('.jtable-option-text-clickable').each(function() {
                    var $thisTarget = $(this).prev().attr('id');
                    $(this)
                        .attr('data-click-target',$thisTarget)
                        .off('click')
                        .on('click',function(e) {
                            e.preventDefault();
                            $('#'+$(this).attr('data-click-target')).iCheck('toggle');
                        })
                });
                $('#Members').selectize({
                    plugins: {
                        'remove_button': {
                            label     : ''
                        }
                    },
                    options: [
                          {id: "ETH0", title: 'ETH0'},
                          {id: "ETH1", title: 'ETH1'},
                          {id: "ETH2", title: 'ETH2'},
                          {id: "ETH3", title: 'ETH3'},
                          {id: "ETH4", title: 'ETH4'},
                          {id: "ETH5", title: 'ETH5'}
                    ],                    
                    maxItems: null,
                    valueField: 'id',
                    labelField: 'title',
                    searchField: 'title',
                    create: false,
                    render: {
                        option: function(data, escape) {
                            return  '<div class="option">' +
                                    '<span class="title">' + escape(data.title) + '</span>' +
                                    '</div>';
                        },
                        item: function(data, escape) {
                            return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
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
                // create selectize
                data.form.find('select').each(function() {
                    var $this = $(this);
                    $this.after('<div class="selectize_fix"></div>')
                    .selectize({
                        dropdownParent: 'body',
                        placeholder: 'Click here to select ...',
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
                });
                // create icheck
                data.form
                    .find('input[type="checkbox"],input[type="radio"]')
                    .each(function() {
                        var $this = $(this);
                        $this.iCheck({
                            checkboxClass: 'icheckbox_md',
                            radioClass: 'iradio_md',
                            increaseArea: '20%'
                        })
                        .on('ifChecked', function(event){
                            $this.parent('div.icheckbox_md').next('span').text('Active');
                        })
                        .on('ifUnchecked', function(event){
                            $this.parent('div.icheckbox_md').next('span').text('Passive');
                        })
                    });
                // reinitialize inputs
                data.form.find('.jtable-input').children('input[type="text"],input[type="password"],textarea').not('.md-input').each(function() {
                    $(this).addClass('md-input');
                    altair_forms.textarea_autosize();
                });
                altair_md.inputs();
            },
            actions: {
                listAction: '/objects/zone/read',
                createAction: '/objects/zone/create',
                updateAction: '/objects/zone/update',
                deleteAction: '/objects/zone/delete'
            },
            fields: {
                Author: {
                	title: 'Author',
                    width: '23%',
                    create: false,
                    edit: false,
                    list: false
                },
                ZoneId: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Name: {
                	title: 'Name',
                    width: '23%',
                    unique: true,
                    required: true
                 },
                Description: {
                    title: 'Description',
                    type: 'textarea',
                    list: false
                },
                Members: {
                    title: 'Members',
                    width: '23%',
//                    options: '/objects/zone/ethernet',
                    input: function(data) {
                    	if (data.record) {
                    		var membersOptions = [];
                        	try {
                        		membersOptions = data.value.split(",");
                        	}
                        	catch (e) {
                        	    for (var i = 0 ; i < network_interfaces.length ; i++) {
                        	      if ( data.value.indexOf(network_interfaces[i]) !== -1 ) {
                        	    	  membersOptions.push(network_interfaces[i]);
                        	      }
                        	    }
                    	    }
                        	
                        	var optionsElement = "";
                        	for (var optionIndex = 0; optionIndex < membersOptions.length; optionIndex++) {
                        		optionsElement += '<option value="'+membersOptions[optionIndex]+'" selected>'+membersOptions[optionIndex]+'</option>';                        		
                        	}                    		
                    		return '<select id="Members" name="Members" multiple>'+optionsElement+'</select>';
                    	}
                    	else {
                    		return '<select id="Members" name="Members" multiple></select>';
                    	}
                    }
                },
                AddedDate: {
                    title: 'Added Date',
                    width: '15%',
                    type: 'date',
                    displayFormat: 'yy-mm-dd',
                    create: false,
                    edit: false
                },
                EditedDate: {
                    title: 'Edited Date',
                    width: '15%',
                    type: 'date',
                    displayFormat: 'yy-mm-dd',
                    create: false,
                    edit: false
                }                
            }
        }).jtable('load');

        // change buttons visual style in ui-dialog
        $('.ui-dialog-buttonset')
            .children('button')
            .attr('class','')
            .addClass('md-btn md-btn-flat')
            .off('mouseenter focus');
        $('#AddRecordDialogSaveButton,#EditDialogSaveButton,#DeleteDialogButton').addClass('md-btn-flat-primary');
    }
};