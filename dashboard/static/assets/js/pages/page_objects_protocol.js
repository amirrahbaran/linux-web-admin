/*
*  NGFW Admin
*  page_objects_protocol.js (page_objects_protocol.html)
*/

$(function() {
    // protocol crud table
    ngfw_objects_protocol.init();	
});

ngfw_objects_protocol = {
    init: function() {
        $('#protocol_crud').jtable({
            title: '',
            paging: true, //Enable paging
            pageSize: 10, //Set page size (default: 10)
            addRecordButton: $('#protocolAdd'),
            deleteConfirmation: function(data) {
                data.deleteConfirmMessage = 'Are you sure to delete protocol object ' + data.record.Name + '?';
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
                $('.ion-slider').each(function() {
                    $(this).val('').ionRangeSlider();
                });                
                // reinitialize inputs
                data.form.find('.jtable-input').children('input[type="text"],input[type="password"],input[type="number"],textarea').not('.md-input').each(function() {
                    $(this).addClass('md-input');
                    altair_forms.textarea_autosize();
                });
                altair_md.inputs();
            },
            actions: {
                listAction: '/objects/protocol/read',
                createAction: '/objects/protocol/create',
                updateAction: '/objects/protocol/update',
                deleteAction: '/objects/protocol/delete'
            },
            fields: {
                Author: {
                	title: 'Author',
                    width: '23%',
                    create: false,
                    edit: false,
                    list: false
                },
                ProtocolId: {
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
                Group: {
                    title: 'Group',
                    width: '23%'
                },
                Protocol: {
                    title: 'Protocol',
                    width: '13%',
                    options: {'tcp': 'TCP', 'udp': 'UDP'}
                },
                Direction: {
                    title: 'Direction',
                    width: '13%',
                    options: {'src': 'Source', 'dst': 'Destination'}
                },
                Value: {
                    title: 'Value',
                    width: '23%',
                    input: function(data) {
                        if (data.record) {
                            return '<input type="number" id="Value_Field" name="Value" value="' + data.value + '" min="1" max="65535"/>';
                        } else {
                            return '<input type="number" id="Value_Field" name="Value" min="1" max="65535"/>';
                        }
                    },
                    required: true
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