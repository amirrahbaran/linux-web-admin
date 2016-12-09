/*
*  NGFW Admin
*  page_objects.js (page_objects.html)
*/

$(function() {
    // address crud table
    ngfw_objects_address.init();	
    // protocol crud table
    ngfw_objects_protocol.init();	
	
    // characters/words counter
//    ngfw_objects.char_words_counter();
    // advanced selects
//    ngfw_objects.adv_selects();
    // masked_inputs
    // ngfw_objects.masked_inputs();
});

ngfw_objects_address = {
    init: function() {
    	$(document).ready(function () {	    	
	        $('#addresss_crud').jtable({
	            title: 'The Address Object List',
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
	    });
    }
};

ngfw_objects_protocol = {
    init: function() {
    	$(document).ready(function () {
	        $('#protocol_crud').jtable({
	            title: 'The Address Object List',
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
	                // reinitialize inputs
	                data.form.find('.jtable-input').children('input[type="text"],input[type="password"],textarea').not('.md-input').each(function() {
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
	    });
    }
};

ngfw_objects = {
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
    // advanced selects (selectizejs)
    adv_selects: function() {
        $('#selec_adv_3').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
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
        // application
          $('#selec_adv_4').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
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
        
        
        
        

        var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
            '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';
        $('#selec_adv_2').selectize({
            persist: false,
            maxItems: null,
            valueField: 'email',
            labelField: 'name',
            searchField: ['name', 'email'],
            options: [
                {email: 'brian@thirdroute.com', name: 'Brian Reavis'},
                {email: 'nikola@tesla.com', name: 'Nikola Tesla'},
                {email: 'someone@gmail.com'}
            ],
            render: {
                item: function(item, escape) {
                    return '<div>' +
                        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
                        (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
                        '</div>';
                },
                option: function(item, escape) {
                    var label = item.name || item.email;
                    var caption = item.name ? item.email : null;
                    return '<div>' +
                        '<span class="label">' + escape(label) + '</span>' +
                        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                        '</div>';
                }
            },
            createFilter: function(input) {
                var match, regex;

                // email@address.com
                regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[0]);

                // name <email@address.com>
                regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
                match = input.match(regex);
                if (match) return !this.options.hasOwnProperty(match[2]);

                return false;
            },
            create: function(input) {
                if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
                    return {email: input};
                }
                var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
                if (match) {
                    return {
                        email : match[2],
                        name  : $.trim(match[1])
                    };
                }
                alert('Invalid email address.');
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

    },
    // masked_inputs
    masked_inputs: function() {
        $maskedInput = $('.masked_input');
        if($maskedInput.length) {
            $maskedInput.inputmask();
        }
    }
};