/*
*  NGFW Admin
*  page_policies_add.js (page_policies_add.html)
*/

$(function() {
    // characters/words counter
//    ngfw_policies_add.char_words_counter();
    // ionrangeSlider
//    ngfw_policies_add.rangeSlider();
    // ngfw_policies_add selects
    ngfw_policies_add.init();
//    ngfw_policies_add.adv_selects();
    ngfw_policies_add.addPolicy();
    // masked_inputs
//    ngfw_policies_add.masked_inputs();
//    ngfw_objects.adv_selects();
});

ngfw_policies_add = {
    init: function() {
        var policy_status_box = document.querySelector('.policy-status-change')
          , policy_status_val = policy_status_box.checked;

        var policy_log_box = document.querySelector('.policy-log-change')
          , policy_log_val = policy_log_box.checked;

        var policy_action_box = $('input[name=policy_action]:checked')
          , policy_action_val = policy_action_box.val();
        
        // Source Zone
        var src_zone_selected=[];
         $('select[name=policy_src_zone] option:selected').each(function(){
              src_zone_selected.push($(this).text());
            });
        var policy_src_zone_val = src_zone_selected.join();

        // Source Network
        var src_net_selected=[];
         $('select[name=policy_src_network] option:selected').each(function(){
              src_net_selected.push($(this).text());
            });
        var policy_src_network_val = src_net_selected.join();

        // Source Service
        var src_srv_selected=[];
         $('select[name=policy_src_services] option:selected').each(function(){
              src_srv_selected.push($(this).text());
            });
        var policy_src_services_val = src_srv_selected.join();

        // Destination Zone
        var dst_zone_selected=[];
         $('select[name=policy_dst_zone] option:selected').each(function(){
              dst_zone_selected.push($(this).text());
            });
        var policy_dst_zone_val = dst_zone_selected.join();

//        Identity User And Groups
        var user_groups_selected=[];
         $('select[name=policy_identity_user_group] option:selected').each(function(){
              user_groups_selected.push($(this).text());
            });
        var policy_identity_user_group_val = user_groups_selected.join();

        ngfw_policies_add.write_summary(  policy_status_val,
            policy_log_val,
            policy_action_val,
            policy_src_zone_val,
            policy_src_network_val,
            policy_src_services_val,
            policy_dst_zone_val,
            policy_identity_user_group_val
        );
        
//        var policy_snat_box = document.querySelector('.policy-snat-change')
//          , policy_snat_box_val = policy_snat_box.checked;
//
//         var policy_snat_action_box = $('input[name=policy_nat_snat_action]:checked');
//         policy_snat_action_box_val = policy_snat_action_box.val();
//        
//        var policy_dnat_box = document.querySelector('.policy-dnat-change');
//        policy_dnat_box_val = policy_dnat_box.checked;

        policy_action_box.on('ifChanged', function(){
            policy_action_val = policy_action_box.val();
            ngfw_policies_add.write_summary(  policy_status_val,
                policy_log_val,
                policy_action_val,
                policy_src_zone_val,
                policy_src_network_val,
                policy_src_services_val,
                policy_dst_zone_val,
                policy_identity_user_group_val
            );
        });

        policy_status_box.onchange = function() {
            policy_status_val = policy_status_box.checked;
            ngfw_policies_add.write_summary(  policy_status_val,
                policy_log_val,
                policy_action_val,
                policy_src_zone_val,
                policy_src_network_val,
                policy_src_services_val,
                policy_dst_zone_val,
                policy_identity_user_group_val
            );
        };
        
        $('#user_groups_select').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            options: [
                {id: 0, title: 'Amir'},
                {id: 1, title: 'Sami'},
                {id: 2, title: 'Tom'},
                {id: 3, title: 'Tim'},
                {id: 4, title: 'Suzi'},
                {id: 5, title: 'Jack'},
                {id: 6, title: 'John'},
                {id: 7, title: 'joe'},
                {id: 8, title: 'Alice'},
                {id: 9, title: 'Bob'},
                {id: 10, title: 'Students'},
                {id: 11, title: 'Teachers'},
                {id: 12, title: 'Advisors'},
                {id: 13, title: 'Clarks'},
                {id: 14, title: 'Managers'},
                {id: 15, title: 'Workers'},
                {id: 16, title: 'Accountants'},
                {id: 17, title: 'Sales'}
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
            },
            onChange: function() { 
                var user_groups_selected=[];
                 $('select[name=policy_identity_user_group] option:selected').each(function(){
                      user_groups_selected.push($(this).text());
                    });
                var policy_identity_user_group_val = user_groups_selected.join();

                ngfw_policies_add.write_summary(  policy_status_val,
                    policy_log_val,
                    policy_action_val,
                    policy_src_zone_val,
                    policy_src_network_val,
                    policy_src_services_val,
                    policy_dst_zone_val,
                    policy_identity_user_group_val
                );
            }
        });

        $('#src_zone_select').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            options: [
                {id: 1, title: 'DMZ'},
                {id: 2, title: 'LAN1'},
                {id: 3, title: 'WAN'},
                {id: 4, title: 'MPLS'},
                {id: 5, title: 'Interanet'},
                {id: 6, title: 'Internet'},
                {id: 7, title: 'LAN2'},
                {id: 8, title: 'LAN3'}
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
            },
            onChange: function() {
                src_zone_selected=[];
                $('select[name=policy_src_zone] option:selected').each(function(){
                    src_zone_selected.push($(this).text());
                });
                policy_src_zone_val = src_zone_selected.join();
                ngfw_policies_add.write_summary(  policy_status_val,
                    policy_log_val,
                    policy_action_val,
                    policy_src_zone_val,
                    policy_src_network_val,
                    policy_src_services_val,
                    policy_dst_zone_val,
                    policy_identity_user_group_val
                );
            }
        });

        $('#src_network_select').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            options: [
                {id: 1, title: '192-168-20-0-24'},
                {id: 2, title: '192-168-40-0-24'},
                {id: 3, title: 'DNS-Servers'},
                {id: 4, title: 'Web-Servers'},
                {id: 5, title: 'Gateways'},
                {id: 6, title: '10-16-0-0-16'},
                {id: 7, title: 'Amar-Servers'},
                {id: 8, title: 'Hesabdari-Servers'}
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
            },
            onChange: function() { 
                var src_net_selected=[];
                $('select[name=policy_src_network] option:selected').each(function(){
                      src_net_selected.push($(this).text());
                    });
                var policy_src_network_val = src_net_selected.join();
                ngfw_policies_add.write_summary(  policy_status_val,
                    policy_log_val,
                    policy_action_val,
                    policy_src_zone_val,
                    policy_src_network_val,
                    policy_src_services_val,
                    policy_dst_zone_val,
                    policy_identity_user_group_val
                );
            }
        });

        $('#src_service_select').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            options: [
                {id: 1, title: 'HTTP'},
                {id: 2, title: 'HTTPS'},
                {id: 3, title: 'DNS'},
                {id: 4, title: 'VPN'},
                {id: 5, title: 'RDP'},
                {id: 6, title: 'Telnet'},
                {id: 7, title: 'FTP'},
                {id: 8, title: 'SSH'}
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
            },
            onChange: function() {
                src_zone_selected=[];
                $('select[name=policy_src_zone] option:selected').each(function(){
                    src_zone_selected.push($(this).text());
                });
                policy_src_zone_val = src_zone_selected.join();
                ngfw_policies_add.write_summary(  policy_status_val,
                    policy_log_val,
                    policy_action_val,
                    policy_src_zone_val,
                    policy_src_network_val,
                    policy_src_services_val,
                    policy_dst_zone_val,
                    policy_identity_user_group_val
                );
            }            
        });
        
        $('#dnat_service_select').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            options: [
                {id: 1, title: 'HTTP'},
                {id: 2, title: 'HTTPS'},
                {id: 3, title: 'DNS'},
                {id: 4, title: 'VPN'},
                {id: 5, title: 'RDP'},
                {id: 6, title: 'Telnet'},
                {id: 7, title: 'FTP'},
                {id: 8, title: 'SSH'}
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

        $('#dst_zone_select').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            options: [
                {id: 1, title: 'Interanet'},
                {id: 2, title: 'DMZ'},
                {id: 3, title: 'Internet'},
                {id: 4, title: 'WAN'},
                {id: 5, title: 'LAN1'},
                {id: 6, title: 'LAN3'},
                {id: 7, title: 'MPLS'},
                {id: 8, title: 'LAN2'}
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
            },
            onChange: function() {
                var dst_zone_selected=[];
                 $('select[name=policy_dst_zone] option:selected').each(function(){
                      dst_zone_selected.push($(this).text());
                    });
                var policy_dst_zone_val = dst_zone_selected.join();
                ngfw_policies_add.write_summary(  policy_status_val,
                    policy_log_val,
                    policy_action_val,
                    policy_src_zone_val,
                    policy_src_network_val,
                    policy_src_services_val,
                    policy_dst_zone_val,
                    policy_identity_user_group_val
                );
            }
        });

        $('#dst_network_select').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            options: [
                {id: 1, title: 'Gateways'},
                {id: 2, title: '10-16-0-0-16'},
                {id: 3, title: '192-168-40-0-24'},
                {id: 4, title: 'Hesabdari-Servers'},
                {id: 5, title: 'Web-Servers'},
                {id: 6, title: 'DNS-Servers'},
                {id: 7, title: 'Amar-Servers'},
                {id: 8, title: '192-168-20-0-24'}
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

        $('#dst_service_select').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            options: [
                {id: 1, title: 'SSH'},
                {id: 2, title: 'Telnet'},
                {id: 3, title: 'DNS'},
                {id: 4, title: 'FTP'},
                {id: 5, title: 'VPN'},
                {id: 6, title: 'HTTP'},
                {id: 7, title: 'RDP'},
                {id: 8, title: 'HTTPS'}
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

        $('#snat_select').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            options: [
                {id: 1, title: 'Internet'},
                {id: 4, title: 'MPLS'},
                {id: 3, title: 'WAN'},
                {id: 2, title: 'Intranet'}
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

        $('#dnat_select').selectize({
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            options: [
                {id: 1, title: 'WebServer'},
                {id: 2, title: 'FTPServer'},
                {id: 3, title: 'AD-RDP'},
                {id: 4, title: 'AccessControl1'}
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

        policy_log_box.onchange = function() {
            policy_log_val = policy_log_box.checked;
            ngfw_policies_add.write_summary(  policy_status_val,
                policy_log_val,
                policy_action_val,
                policy_src_zone_val,
                policy_src_network_val,
                policy_src_services_val,
                policy_dst_zone_val,
                policy_identity_user_group_val
            );
        };

//        policy_snat_box.onchange = function() {
//            policy_snat_box_val = policy_snat_box.checked;
//            ngfw_policies_add.write_summary(  policy_status_val,
//                            policy_log_val,
//                            policy_action_val,
//                            policy_snat_box_val,
//                            policy_snat_action_box_val,
//                            policy_dnat_box_val
//                );
//        };
//        
//        policy_snat_action_box.on('ifToggled', function(){
//            policy_snat_action_box_val = policy_snat_action_box.val();
//            ngfw_policies_add.write_summary(  policy_status_val,
//                            policy_log_val,
//                            policy_action_val,
//                            policy_snat_box_val,
//                            policy_snat_action_box_val,
//                            policy_dnat_box_val
//                );
//        });
//
//        policy_dnat_box.onchange = function() {
//            policy_dnat_box_val = policy_dnat_box.checked;
//            ngfw_policies_add.write_summary(  policy_status_val,
//                            policy_log_val,
//                            policy_action_val,
//                            policy_snat_box_val,
//                            policy_snat_action_box_val,
//                            policy_dnat_box_val
//                );
//        };
    },
    // characters/words counter
//    write_summary: function(pol_status, pol_log, pol_action, pol_snat, pol_snat_action, pol_dnat) {
    write_summary: function(pol_status, pol_log, pol_action, pol_src_zon, pol_src_net, pol_srv, pol_dst_zon, pol_usr_grp) {
        var summary_field = document.querySelector('.summary-field')
          , summary_text = "";
        if(pol_status) {
            switch(pol_action){
                case "ACCEPT": summary_text += "Apply ";break;
                case "DROP": summary_text += "Drop ";break;
                case "REJECT": summary_text += "Reject ";break;
            }
//            summary_text += pol_snat_action;
//            summary_text += pol_dnat;
            if(pol_srv)
                summary_text += pol_srv;
            else
                summary_text += "any servises";
            summary_text += " going to ";
            if (pol_dst_zon)
                summary_text += pol_dst_zon;
            else
                summary_text += "any zone";
            summary_text += ", for ";
            if (pol_usr_grp)
                summary_text += pol_usr_grp;
            else
                summary_text += "any user and group";
            summary_text += ", when in ";
            if (pol_src_zon)
                summary_text += pol_src_zon;
            else
                summary_text += "any zone";
            summary_text += ", and coming from ";
            if (pol_src_net)
                summary_text += pol_src_net;
            else
                summary_text += "any network";
        } else {
            summary_text = "This policy is disabled.";
        }
        summary_field.innerHTML = summary_text;
    },
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
    // addPolicy
    addPolicy: function() {
        $(document).ready(function(){
            $("#policies_add_submit").click(function(){
                
/************************************************************************************/
/********************                 About                  ************************/
/************************************************************************************/
                var policy_status_val = ($('input[name=policy_status]:checked').val() === "on" ) ? "1" : "0";
                var policy_log_val = ($('input[name=policy_log]:checked').val() === "on" ) ? "1" : "0";
                var policy_name_val = $('input[name=policy_name]').val();
                var policy_desc_val = $('input[name=policy_desc]').val();
                
/************************************************************************************/
/*******************                 Action                  ************************/
/************************************************************************************/
                var policy_action_val = $('input[name=policy_action]:checked').val();

/************************************************************************************/
/*******************                 Identity                  **********************/
/************************************************************************************/
                var policy_identity_match_val = ($('input[name=policy_identity_match]:checked').val() === "on" ) ? "1" : "0";
                var user_groups_selected=[];
                 $('select[name=policy_identity_user_group] option:selected').each(function(){
                      user_groups_selected.push($(this).text());
                    });
//                var policy_identity_user_group_val = JSON.stringify(user_groups_selected);
                var policy_identity_user_group_val = user_groups_selected.join();
                var policy_identity_exclude_accounting_val = ($('input[name=policy_identity_exclude_accounting]:checked').val() === "on" ) ? "1" : "0";

/************************************************************************************/
/*******************                 Source                  ************************/
/************************************************************************************/
                // Zone
                var src_zone_selected=[];
                 $('select[name=policy_src_zone] option:selected').each(function(){
                      src_zone_selected.push($(this).text());
                    });
                var policy_src_zone_val = src_zone_selected.join();

                // Network
                var src_net_selected=[];
                 $('select[name=policy_src_network] option:selected').each(function(){
                      src_net_selected.push($(this).text());
                    });
                var policy_src_network_val = src_net_selected.join();

                // Service
                var src_srv_selected=[];
                 $('select[name=policy_src_services] option:selected').each(function(){
                      src_srv_selected.push($(this).text());
                    });
                var policy_src_services_val = src_srv_selected.join();

/************************************************************************************/
/*******************                 Destination                  *******************/
/************************************************************************************/
                // Zone
                var dst_zone_selected=[];
                 $('select[name=policy_dst_zone] option:selected').each(function(){
                      dst_zone_selected.push($(this).text());
                    });
                var policy_dst_zone_val = dst_zone_selected.join();

                // Network
                var dst_net_selected=[];
                 $('select[name=policy_dst_network] option:selected').each(function(){
                      dst_net_selected.push($(this).text());
                    });
                var policy_dst_network_val = dst_net_selected.join();

                // Service
                var dst_srv_selected=[];
                 $('select[name=policy_dst_services] option:selected').each(function(){
                      dst_srv_selected.push($(this).text());
                    });
                var policy_dst_services_val = dst_srv_selected.join();

/************************************************************************************/
/*******************                 Routing                  ***********************/
/************************************************************************************/
                 var policy_routing_primary_gateway_val = $('select[name=policy_routing_primary_gateway] option:selected').text();

/************************************************************************************/
/*******************                 NAT                  ***************************/
/************************************************************************************/
                // SNAT
                var policy_nat_snat_status_val = ($('input[name=policy_nat_snat_status]:checked').val() === "on" ) ? "1" : "0";
                
                var policy_nat_snat_action_val = $('input[name=policy_nat_snat_action]:checked').val();
                
                var snat_pool_selected=[];
                $('select[name=policy_nat_snat_pool] option:selected').each(function(){
                    snat_pool_selected.push($(this).text());
                });
                var policy_nat_snat_pool_val = snat_pool_selected.join();
                
                // DNAT
                var policy_nat_dnat_status_val = ($('input[name=policy_nat_dnat_status]:checked').val() === "on" ) ? "1" : "0";
                var policy_nat_dnat_action_val = "DNAT";
                
                var dnat_services_selected=[];
                $('select[name=policy_dnat_services] option:selected').each(function(){
                    dnat_services_selected.push($(this).text());
                });
                var policy_dnat_services_val = dnat_services_selected.join();
                
                var dnat_target_selected=[];
                $('select[name=policy_nat_dnat_target] option:selected').each(function(){
                    dnat_target_selected.push($(this).text());
                });
                var policy_nat_dnat_target_val = dnat_target_selected.join();

                /*     Debugging Segment    */
//                console.log(policy_routing_primary_gateway_val);
//                UIkit.notify(policy_nat_dnat_target_val);
//                return ;

                $.post("php/views/page_policies_add_backend.php",
                {
                  policy_status: policy_status_val,
                  policy_log: policy_log_val,
                  policy_name: policy_name_val,
                  policy_desc: policy_desc_val,
                  policy_action: policy_action_val,
                  policy_identity_match: policy_identity_match_val,
                  policy_identity_user_group: policy_identity_user_group_val,
                  policy_identity_exclude_accounting: policy_identity_exclude_accounting_val,
                  policy_src_zone: policy_src_zone_val,
                  policy_src_network: policy_src_network_val,
                  policy_src_services: policy_src_services_val,
                  policy_dst_zone: policy_dst_zone_val,
                  policy_dst_network: policy_dst_network_val,
                  policy_dst_services: policy_dst_services_val,
                  policy_routing_primary_gateway: policy_routing_primary_gateway_val,
                  policy_nat_snat_status: policy_nat_snat_status_val,
                  policy_nat_snat_action: policy_nat_snat_action_val,
                  policy_nat_snat_pool: policy_nat_snat_pool_val,
                  policy_nat_dnat_status: policy_nat_dnat_status_val,
                  policy_nat_dnat_action: policy_nat_dnat_action_val,
                  policy_dnat_services: policy_dnat_services_val,
                  policy_nat_dnat_target: policy_nat_dnat_target_val
                },
                function(data,status){
                    var message = data.split(",");
                    UIkit.notify({
                        message : message[1],
                        status  : message[0],
                        timeout : 1000,
                        pos     : 'top-center'
                    });
                });                
            });
        });
    },
    // advanced selects (selectizejs)
    adv_selects: function() {
//        $('#user_groups_select').selectize({
//            plugins: {
//                'remove_button': {
//                    label     : ''
//                }
//            },
//            options: [
//                {id: 0, title: 'Amir'},
//                {id: 1, title: 'Sami'},
//                {id: 2, title: 'Tom'},
//                {id: 3, title: 'Tim'},
//                {id: 4, title: 'Suzi'},
//                {id: 5, title: 'Jack'},
//                {id: 6, title: 'John'},
//                {id: 7, title: 'joe'},
//                {id: 8, title: 'Alice'},
//                {id: 9, title: 'Bob'},
//                {id: 10, title: 'Students'},
//                {id: 11, title: 'Teachers'},
//                {id: 12, title: 'Advisors'},
//                {id: 13, title: 'Clarks'},
//                {id: 14, title: 'Managers'},
//                {id: 15, title: 'Workers'},
//                {id: 16, title: 'Accountants'},
//                {id: 17, title: 'Sales'}
//            ],
//            maxItems: null,
//            valueField: 'id',
//            labelField: 'title',
//            searchField: 'title',
//            create: false,
//            render: {
//                option: function(data, escape) {
//                    return  '<div class="option">' +
//                            '<span class="title">' + escape(data.title) + '</span>' +
//                            '</div>';
//                },
//                item: function(data, escape) {
//                    return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
//                }
//            },
//            onDropdownOpen: function($dropdown) {
//                $dropdown
//                    .hide()
//                    .velocity('slideDown', {
//                        begin: function() {
//                            $dropdown.css({'margin-top':'0'})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            },
//            onDropdownClose: function($dropdown) {
//                $dropdown
//                    .show()
//                    .velocity('slideUp', {
//                        complete: function() {
//                            $dropdown.css({'margin-top':''})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            }
//        });
//
////        $('#src_zone_select').selectize({
////            plugins: {
////                'remove_button': {
////                    label     : ''
////                }
////            },
////            options: [
////                {id: 1, title: 'DMZ'},
////                {id: 2, title: 'LAN1'},
////                {id: 3, title: 'WAN'},
////                {id: 4, title: 'MPLS'},
////                {id: 5, title: 'Interanet'},
////                {id: 6, title: 'Internet'},
////                {id: 7, title: 'LAN2'},
////                {id: 8, title: 'LAN3'}
////            ],
////            maxItems: null,
////            valueField: 'id',
////            labelField: 'title',
////            searchField: 'title',
////            create: false,
////            render: {
////                option: function(data, escape) {
////                    return  '<div class="option">' +
////                            '<span class="title">' + escape(data.title) + '</span>' +
////                            '</div>';
////                },
////                item: function(data, escape) {
////                    return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
////                }
////            },
////            onDropdownOpen: function($dropdown) {
////                $dropdown
////                    .hide()
////                    .velocity('slideDown', {
////                        begin: function() {
////                            $dropdown.css({'margin-top':'0'})
////                        },
////                        duration: 200,
////                        easing: easing_swiftOut
////                    })
////            },
////            onDropdownClose: function($dropdown) {
////                $dropdown
////                    .show()
////                    .velocity('slideUp', {
////                        complete: function() {
////                            $dropdown.css({'margin-top':''})
////                        },
////                        duration: 200,
////                        easing: easing_swiftOut
////                    })
////            }
////        });
//
//        $('#src_network_select').selectize({
//            plugins: {
//                'remove_button': {
//                    label     : ''
//                }
//            },
//            options: [
//                {id: 1, title: '192-168-20-0-24'},
//                {id: 2, title: '192-168-40-0-24'},
//                {id: 3, title: 'DNS-Servers'},
//                {id: 4, title: 'Web-Servers'},
//                {id: 5, title: 'Gateways'},
//                {id: 6, title: '10-16-0-0-16'},
//                {id: 7, title: 'Amar-Servers'},
//                {id: 8, title: 'Hesabdari-Servers'}
//            ],
//            maxItems: null,
//            valueField: 'id',
//            labelField: 'title',
//            searchField: 'title',
//            create: false,
//            render: {
//                option: function(data, escape) {
//                    return  '<div class="option">' +
//                            '<span class="title">' + escape(data.title) + '</span>' +
//                            '</div>';
//                },
//                item: function(data, escape) {
//                    return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
//                }
//            },
//            onDropdownOpen: function($dropdown) {
//                $dropdown
//                    .hide()
//                    .velocity('slideDown', {
//                        begin: function() {
//                            $dropdown.css({'margin-top':'0'})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            },
//            onDropdownClose: function($dropdown) {
//                $dropdown
//                    .show()
//                    .velocity('slideUp', {
//                        complete: function() {
//                            $dropdown.css({'margin-top':''})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            }
//        });
//
//        $('#src_service_select').selectize({
//            plugins: {
//                'remove_button': {
//                    label     : ''
//                }
//            },
//            options: [
//                {id: 1, title: 'HTTP'},
//                {id: 2, title: 'HTTPS'},
//                {id: 3, title: 'DNS'},
//                {id: 4, title: 'VPN'},
//                {id: 5, title: 'RDP'},
//                {id: 6, title: 'Telnet'},
//                {id: 7, title: 'FTP'},
//                {id: 8, title: 'SSH'}
//            ],
//            maxItems: null,
//            valueField: 'id',
//            labelField: 'title',
//            searchField: 'title',
//            create: false,
//            render: {
//                option: function(data, escape) {
//                    return  '<div class="option">' +
//                            '<span class="title">' + escape(data.title) + '</span>' +
//                            '</div>';
//                },
//                item: function(data, escape) {
//                    return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
//                }
//            },
//            onDropdownOpen: function($dropdown) {
//                $dropdown
//                    .hide()
//                    .velocity('slideDown', {
//                        begin: function() {
//                            $dropdown.css({'margin-top':'0'})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            },
//            onDropdownClose: function($dropdown) {
//                $dropdown
//                    .show()
//                    .velocity('slideUp', {
//                        complete: function() {
//                            $dropdown.css({'margin-top':''})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            }
//        });
//        $('#dnat_service_select').selectize({
//            plugins: {
//                'remove_button': {
//                    label     : ''
//                }
//            },
//            options: [
//                {id: 1, title: 'HTTP'},
//                {id: 2, title: 'HTTPS'},
//                {id: 3, title: 'DNS'},
//                {id: 4, title: 'VPN'},
//                {id: 5, title: 'RDP'},
//                {id: 6, title: 'Telnet'},
//                {id: 7, title: 'FTP'},
//                {id: 8, title: 'SSH'}
//            ],
//            maxItems: null,
//            valueField: 'id',
//            labelField: 'title',
//            searchField: 'title',
//            create: false,
//            render: {
//                option: function(data, escape) {
//                    return  '<div class="option">' +
//                            '<span class="title">' + escape(data.title) + '</span>' +
//                            '</div>';
//                },
//                item: function(data, escape) {
//                    return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
//                }
//            },
//            onDropdownOpen: function($dropdown) {
//                $dropdown
//                    .hide()
//                    .velocity('slideDown', {
//                        begin: function() {
//                            $dropdown.css({'margin-top':'0'})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            },
//            onDropdownClose: function($dropdown) {
//                $dropdown
//                    .show()
//                    .velocity('slideUp', {
//                        complete: function() {
//                            $dropdown.css({'margin-top':''})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            }
//        });
//
//        $('#dst_zone_select').selectize({
//            plugins: {
//                'remove_button': {
//                    label     : ''
//                }
//            },
//            options: [
//                {id: 1, title: 'Interanet'},
//                {id: 2, title: 'DMZ'},
//                {id: 3, title: 'Internet'},
//                {id: 4, title: 'WAN'},
//                {id: 5, title: 'LAN1'},
//                {id: 6, title: 'LAN3'},
//                {id: 7, title: 'MPLS'},
//                {id: 8, title: 'LAN2'}
//            ],
//            maxItems: null,
//            valueField: 'id',
//            labelField: 'title',
//            searchField: 'title',
//            create: false,
//            render: {
//                option: function(data, escape) {
//                    return  '<div class="option">' +
//                            '<span class="title">' + escape(data.title) + '</span>' +
//                            '</div>';
//                },
//                item: function(data, escape) {
//                    return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
//                }
//            },
//            onDropdownOpen: function($dropdown) {
//                $dropdown
//                    .hide()
//                    .velocity('slideDown', {
//                        begin: function() {
//                            $dropdown.css({'margin-top':'0'})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            },
//            onDropdownClose: function($dropdown) {
//                $dropdown
//                    .show()
//                    .velocity('slideUp', {
//                        complete: function() {
//                            $dropdown.css({'margin-top':''})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            }
//        });
//
//        $('#dst_network_select').selectize({
//            plugins: {
//                'remove_button': {
//                    label     : ''
//                }
//            },
//            options: [
//                {id: 1, title: 'Gateways'},
//                {id: 2, title: '10-16-0-0-16'},
//                {id: 3, title: '192-168-40-0-24'},
//                {id: 4, title: 'Hesabdari-Servers'},
//                {id: 5, title: 'Web-Servers'},
//                {id: 6, title: 'DNS-Servers'},
//                {id: 7, title: 'Amar-Servers'},
//                {id: 8, title: '192-168-20-0-24'}
//            ],
//            maxItems: null,
//            valueField: 'id',
//            labelField: 'title',
//            searchField: 'title',
//            create: false,
//            render: {
//                option: function(data, escape) {
//                    return  '<div class="option">' +
//                            '<span class="title">' + escape(data.title) + '</span>' +
//                            '</div>';
//                },
//                item: function(data, escape) {
//                    return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
//                }
//            },
//            onDropdownOpen: function($dropdown) {
//                $dropdown
//                    .hide()
//                    .velocity('slideDown', {
//                        begin: function() {
//                            $dropdown.css({'margin-top':'0'})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            },
//            onDropdownClose: function($dropdown) {
//                $dropdown
//                    .show()
//                    .velocity('slideUp', {
//                        complete: function() {
//                            $dropdown.css({'margin-top':''})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            }
//        });
//
//        $('#dst_service_select').selectize({
//            plugins: {
//                'remove_button': {
//                    label     : ''
//                }
//            },
//            options: [
//                {id: 1, title: 'SSH'},
//                {id: 2, title: 'Telnet'},
//                {id: 3, title: 'DNS'},
//                {id: 4, title: 'FTP'},
//                {id: 5, title: 'VPN'},
//                {id: 6, title: 'HTTP'},
//                {id: 7, title: 'RDP'},
//                {id: 8, title: 'HTTPS'}
//            ],
//            maxItems: null,
//            valueField: 'id',
//            labelField: 'title',
//            searchField: 'title',
//            create: false,
//            render: {
//                option: function(data, escape) {
//                    return  '<div class="option">' +
//                            '<span class="title">' + escape(data.title) + '</span>' +
//                            '</div>';
//                },
//                item: function(data, escape) {
//                    return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
//                }
//            },
//            onDropdownOpen: function($dropdown) {
//                $dropdown
//                    .hide()
//                    .velocity('slideDown', {
//                        begin: function() {
//                            $dropdown.css({'margin-top':'0'})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            },
//            onDropdownClose: function($dropdown) {
//                $dropdown
//                    .show()
//                    .velocity('slideUp', {
//                        complete: function() {
//                            $dropdown.css({'margin-top':''})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            }
//        });
//
//        $('#snat_select').selectize({
//            plugins: {
//                'remove_button': {
//                    label     : ''
//                }
//            },
//            options: [
//                {id: 1, title: 'Internet'},
//                {id: 4, title: 'MPLS'},
//                {id: 3, title: 'WAN'},
//                {id: 2, title: 'Intranet'}
//            ],
//            maxItems: null,
//            valueField: 'id',
//            labelField: 'title',
//            searchField: 'title',
//            create: false,
//            render: {
//                option: function(data, escape) {
//                    return  '<div class="option">' +
//                            '<span class="title">' + escape(data.title) + '</span>' +
//                            '</div>';
//                },
//                item: function(data, escape) {
//                    return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
//                }
//            },
//            onDropdownOpen: function($dropdown) {
//                $dropdown
//                    .hide()
//                    .velocity('slideDown', {
//                        begin: function() {
//                            $dropdown.css({'margin-top':'0'})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            },
//            onDropdownClose: function($dropdown) {
//                $dropdown
//                    .show()
//                    .velocity('slideUp', {
//                        complete: function() {
//                            $dropdown.css({'margin-top':''})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            }
//        });
//
//        $('#dnat_select').selectize({
//            plugins: {
//                'remove_button': {
//                    label     : ''
//                }
//            },
//            options: [
//                {id: 1, title: 'WebServer'},
//                {id: 2, title: 'FTPServer'},
//                {id: 3, title: 'AD-RDP'},
//                {id: 4, title: 'AccessControl1'}
//            ],
//            maxItems: null,
//            valueField: 'id',
//            labelField: 'title',
//            searchField: 'title',
//            create: false,
//            render: {
//                option: function(data, escape) {
//                    return  '<div class="option">' +
//                            '<span class="title">' + escape(data.title) + '</span>' +
//                            '</div>';
//                },
//                item: function(data, escape) {
//                    return '<div class="item"><a href="' + escape(data.url) + '" target="_blank">' + escape(data.title) + '</a></div>';
//                }
//            },
//            onDropdownOpen: function($dropdown) {
//                $dropdown
//                    .hide()
//                    .velocity('slideDown', {
//                        begin: function() {
//                            $dropdown.css({'margin-top':'0'})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            },
//            onDropdownClose: function($dropdown) {
//                $dropdown
//                    .show()
//                    .velocity('slideUp', {
//                        complete: function() {
//                            $dropdown.css({'margin-top':''})
//                        },
//                        duration: 200,
//                        easing: easing_swiftOut
//                    })
//            }
//        });
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