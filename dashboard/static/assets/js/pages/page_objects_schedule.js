/*
*  NGFW Admin
*  page_objects_schedule.js (page_objects_schedule.html)
*/
var week_days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

$(function() {
    // schedule crud table
    ngfw_objects_schedule.init();	
});

ngfw_objects_schedule = {
    init: function() {
        $('#schedule_crud').jtable({
            title: '',
            paging: true, //Enable paging
            pageSize: 10, //Set page size (default: 10)
            addRecordButton: $('#scheduleAdd'),
            deleteConfirmation: function(data) {
                data.deleteConfirmMessage = 'Are you sure to delete schedule object ' + data.record.Name + '?';
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
                $('#Weekday').selectize({
                    plugins: {
                        'remove_button': {
                            label     : ''
                        }
                    },
                    options: [
                        {id: "Monday", title: 'Monday'},
                        {id: "Tuesday", title: 'Tuesday'},
                        {id: "Wednesday", title: 'Wednesday'},
                        {id: "Thursday", title: 'Thursday'},
                        {id: "Friday", title: 'Friday'},
                        {id: "Saturday", title: 'Saturday'},
                        {id: "Sunday", title: 'Sunday'}
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
                data.form.find('#datetimepicker_range_start,#datetimepicker_range_end').each(function() {
	        		var $kUI_datetimepicker_range_start = $('#datetimepicker_range_start');
	                var $kUI_datetimepicker_range_end = $('#datetimepicker_range_end');
	                if($kUI_datetimepicker_range_start.length && $kUI_datetimepicker_range_end.length) {
	                    function startChange() {
	                        var startDate = start.value(),
	                            endDate = end.value();
	
	                        if (startDate) {
	                            startDate = new Date(startDate);
	                            startDate.setDate(startDate.getDate());
	                            end.min(startDate);
	                        } else if (endDate) {
	                            start.max(new Date(endDate));
	                        } else {
	                            endDate = new Date();
	                            start.max(endDate);
	                            end.min(endDate);
	                        }
	                    }
	
	                    function endChange() {
	                        var endDate = end.value(),
	                            startDate = start.value();
	
	                        if (endDate) {
	                            endDate = new Date(endDate);
	                            endDate.setDate(endDate.getDate());
	                            start.max(endDate);
	                        } else if (startDate) {
	                            end.min(new Date(startDate));
	                        } else {
	                            endDate = new Date();
	                            start.max(endDate);
	                            end.min(endDate);
	                        }
	                    }
	
//	                    var today = kendo.date.today();

	                    var start = $kUI_datetimepicker_range_start.kendoDateTimePicker({
	                    	height:300,
//	                    	value: today,
	                        change: startChange,
	                        format: "yyyy/MM/dd hh:mm:ss tt",
	                        parseFormats: ["yyyy/MM/dd hh:mm:ss tt"]
	                    }).data("kendoDateTimePicker");
	
	                    var end = $kUI_datetimepicker_range_end.kendoDateTimePicker({
	                    	height:50,
//	                        value: today,
	                        change: endChange,
	                        format: "yyyy/MM/dd hh:mm:ss tt",
	                        parseFormats: ["yyyy/MM/dd hh:mm:ss tt"]
	                    }).data("kendoDateTimePicker");
	
	                    start.max(end.value());
	                    end.min(start.value());
	                }
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
                
                data.form.validationEngine();
            },
            //Validate form when it is being submitted
            formSubmitting: function (event, data) {
                return data.form.validationEngine('validate');
            },
            //Dispose validation logic when form is closed
            formClosed: function (event, data) {
                data.form.validationEngine('hide');
                data.form.validationEngine('detach');
            },
            actions: {
                listAction: '/objects/schedule/read',
                createAction: '/objects/schedule/create',
                updateAction: '/objects/schedule/update',
                deleteAction: '/objects/schedule/delete'
            },
            fields: {
                Author: {
                	title: 'Author',
                    width: '23%',
                    create: false,
                    edit: false,
                    list: false
                },
                ScheduleId: {
                    key: true,
                    create: false,
                    edit: false,
                    list: false
                },
                Name: {
                	title: 'Name',
                    width: '23%',
                    inputClass: 'validate[required]'
                 },
                Description: {
                    title: 'Description',
                    type: 'textarea',
                    list: false
                },
                Weekday: {
                    title: 'Day of week',
                    width: '13%',
                    input: function(data) {
                        if (data.record) {
                        	var weekdaysOptions = [];
                        	try {
                        		weekdaysOptions = data.value.split(",");
                        	}
                        	catch (e) {
                        	    for (var i = 0 ; i < week_days.length ; i++) {
                        	      if ( data.value.indexOf(week_days[i]) !== -1 ) {
                        	    	  weekdaysOptions.push(week_days[i]);
                        	      }
                        	    }
                    	    }
                        	
                        	var optionsElement = "";
                        	for (var optionIndex = 0; optionIndex < weekdaysOptions.length; optionIndex++) {
                        		optionsElement += '<option value="'+weekdaysOptions[optionIndex]+'" selected>'+weekdaysOptions[optionIndex]+'</option>';                        		
                        	}
                            return '<select id="Weekday" name="Weekday" multiple>'+optionsElement+'</select>';
                        }
                        else {
                            return '<select id="Weekday" name="Weekday" multiple></select>';
                        }
                    },
                    inputClass: 'validate[required]'                    
                },
                StartTime: {
                    title: 'Start',
                    width: '23%',
                    height:'50px',
                    input: function(data) {
                        if (data.record) {
                            return '<input id="datetimepicker_range_start" class="md-input" type="text" name="StartTime" style="height:40px !important;" value="' + data.value + '"/>';
                        } else {
                            return '<input id="datetimepicker_range_start" class="md-input" type="text" name="StartTime" style="height:40px !important;" value="" />';
                        }
                    },
                    inputClass: 'validate[required]'
                },
                StopTime: {
                    title: 'End',
                    width: '23%',
                    height:'50px',
                    input: function(data) {
                        if (data.record) {
                            return '<input id="datetimepicker_range_end" class="md-input" type="text" name="StopTime" style="height:40px !important;" value="' + data.value + '" />';
                        } else {
                            return '<input id="datetimepicker_range_end" class="md-input" type="text" name="StopTime" style="height:40px !important;" value="" />';
                        }
                    },
                    inputClass: 'validate[required]'
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
        });

      //Load schedule list from server
        $('#schedule_crud').jtable('load');
        
        // change buttons visual style in ui-dialog
        $('.ui-dialog-buttonset')
            .children('button')
            .attr('class','')
            .addClass('md-btn md-btn-flat')
            .off('mouseenter focus');
        $('#AddRecordDialogSaveButton,#EditDialogSaveButton,#DeleteDialogButton').addClass('md-btn-flat-primary');
    }
};