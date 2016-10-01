/*
*  NGFW Admin
*  page_objects_address.js (page_objects_address.html)
*/

$(function() {
    // address crud table
    ngfw_objects_address.init();	
});

ngfw_objects_address = {
	init: function() {
        $('#address_crud').jtable({
            title: '',
            paging: true, //Enable paging
            pageSize: 10, //Set page size (default: 10)
            addRecordButton: $('#addressAdd'),
            deleteConfirmation: function(data) {
                data.deleteConfirmMessage = 'Are you sure to delete address object ' + data.record.Name + '?';
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
                // reinitialize inputs
                data.form.find('.jtable-input').children('input[type="text"],input[type="password"],textarea').not('.md-input').each(function() {
                    $(this).addClass('md-input');
                    altair_forms.textarea_autosize();
                });
                altair_md.inputs();
            },
            actions: {
                listAction: '/objects/address/read',
                createAction: '/objects/address/create',
                updateAction: '/objects/address/update',
                deleteAction: '/objects/address/delete'
            },
            fields: {
                Author: {
                	title: 'Author',
                    width: '23%',
                    create: false,
                    edit: false,
                    list: false
                },
                AddressId: {
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
                Version: {
                    title: 'Version',
                    width: '13%',
                    options: {'4': 'IPv4', '6': 'IPv6'}
                },
                Type: {
                    title: 'Type',
                    width: '12%',
                    options: '/objects/address/type'
                },
                Value: {
                    title: 'Value',
                    width: '23%',
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