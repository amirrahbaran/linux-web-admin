from django.conf.urls import patterns, include, url
from objects import views
from networking import views as netviews
from policies import views as polviews
from vpn import views as vpnviews
from django.contrib import admin
from django.contrib.auth import views as auth_views
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^policies$', polviews.policies_list, name='policies_list'),
    url(r'^policies/create$', polviews.policies_create, name='policies_create'),
    url(r'^policies/read$', polviews.policies_read, name='policies_read'),
    url(r'^policies/update$', polviews.policies_update, name='policies_update'),
    url(r'^policies/view$', polviews.policies_view, name='policies_view'),
    url(r'^policies/delete$', polviews.policies_delete, name='policies_delete'),

    url(r'^networking/routing/view$', netviews.routing_view, name='routing_view'),
    url(r'^networking/ethernet/get_virtual', netviews.virtual_view, name='virtual_view'),
    url(r'^networking/ethernet/get_edit$', netviews.ethernet_view, name='ethernet_view'),


    url(r'^networking/routing/delete$', netviews.routing_delete, name='routing_delete'),


    url(r'^networking/routing/update$', netviews.routing_update, name='routing_update'),
    url(r'^networking/ethernet/ethernet_update$', netviews.ethernet_update, name='ethernet_update'),


    url(r'^networking/routing/read$', netviews.routing_read, name='routing_read'),
    url(r'^networking/ethernet/read$', netviews.networking_read, name='networking_read'),


    url(r'^networking/routing/create$', netviews.routing_create, name='routing_create'),
    url(r'^networking/ethernet/add_virtual$', netviews.add_virtual, name='add_virtual'),


    url(r'^routing$', netviews.routing, name='routing'),
    url(r'^networking$', include('networking.urls')),


    url(r'^objects/zone/delete$', views.zone_delete, name='zone_delete'),
    url(r'^objects/schedule/delete$', views.schedule_delete, name='schedule_delete'),
    url(r'^objects/protocol/delete$', views.protocol_delete, name='protocol_delete'),
    url(r'^objects/address/delete$', views.address_delete, name='address_delete'),


    url(r'^networking/ethernet/getlist$', netviews.getEthernetList, name='getEthernetList'),
    url(r'^objects/zone/getlist$', views.getZoneList, name='getZoneList'),
    url(r'^objects/schedule/getlist$', views.getScheduleList, name='getScheduleList'),
    url(r'^objects/protocol/getlist$', views.getProtocolList, name='getProtocolList'),
    url(r'^objects/protocol/getportlist$', views.getPortList, name='getPortList'),
    url(r'^objects/address/getlist$', views.getAddressList, name='getAddressList'),


    url(r'^objects/protocol/getgroup$', views.getProtocolGroupNames, name='getProtocolGroupNames'),
    url(r'^objects/address/getgroup$', views.getAddressGroupNames, name='getAddressGroupNames'),


    url(r'^objects/zone/view$', views.zone_view, name='zone_view'),
    url(r'^objects/schedule/view$', views.schedule_view, name='schedule_view'),
    url(r'^objects/protocol/view$', views.protocol_view, name='protocol_view'),
    url(r'^objects/address/view$', views.address_view, name='address_view'),


    url(r'^objects/zone/update$', views.zone_update, name='zone_update'),
    url(r'^objects/schedule/update$', views.schedule_update, name='schedule_update'),
    url(r'^objects/protocol/update$', views.protocol_update, name='protocol_update'),
    url(r'^objects/address/update$', views.address_update, name='address_update'),


    url(r'^objects/zone/read$', views.zone_read, name='zone_read'),
    url(r'^objects/schedule/read$', views.schedule_read, name='schedule_read'),
    url(r'^objects/protocol/read$', views.protocol_read, name='protocol_read'),
    url(r'^objects/address/read$', views.address_read, name='address_read'),


    url(r'^objects/zone/create$', views.zone_create, name='zone_create'),
    url(r'^objects/schedule/create$', views.schedule_create, name='schedule_create'),
    url(r'^objects/protocol/create$', views.protocol_create, name='protocol_create'),
    url(r'^objects/address/create$', views.address_create, name='address_create'),


    url(r'^objects/zone$', views.zone_list, name='zone_list'),
    url(r'^objects/schedule$', views.schedule_list, name='schedule_list'),
    url(r'^objects/protocol$', views.protocol_list, name='protocol_list'),
    url(r'^objects/address$', views.address_list, name='address_list'),

    url(r'^vpn/profile$', vpnviews.profile_list, name='profile_list'),
    url(r'^vpn/profile/update$', vpnviews.profile_update, name='profile_update'),
    url(r'^vpn/profile/create$', vpnviews.profile_create, name='profile_create'),
    url(r'^vpn/profile/read$', vpnviews.profile_read, name='profile_read'),
    url(r'^vpn/profile/update$', vpnviews.profile_update, name='profile_update'),
    url(r'^vpn/profile/view$', vpnviews.profile_view, name='profile_view'),


    url(r'^vpn/tunnel$', vpnviews.tunnel_list, name='tunnel_list'),
    url(r'^vpn/tunnel/update$', vpnviews.tunnel_update, name='tunnel_update'),
    url(r'^vpn/tunnel/create$', vpnviews.tunnel_create, name='tunnel_create'),
    url(r'^vpn/tunnel/read$', vpnviews.tunnel_read, name='tunnel_read'),
    url(r'^vpn/tunnel/update$', vpnviews.tunnel_update, name='tunnel_update'),
    url(r'^vpn/tunnel/view$', vpnviews.tunnel_view, name='tunnel_view'),


    url(r'^login/$', auth_views.login, {'template_name': 'dashboard/login.html'}, name='login'),
    url(r'^logout/$', auth_views.logout, {'template_name': 'dashboard/logout.html','next_page': '/'}, name='logout'),
    # url(r'^main/$', 'main.views.getall', name='main'),
    url(r'^info/uptime/$', 'usage.views.uptime', name='uptime'),
    url(r'^info/memory/$', 'usage.views.memusage', name='memusage'),
    url(r'^info/cpuusage/$', 'usage.views.cpuusage', name='cpuusage'),
    url(r'^info/getdisk/$', 'usage.views.getdisk', name='getdisk'),
    url(r'^info/getusers/$', 'usage.views.getusers', name='getusers'),
    url(r'^info/getips/$', 'usage.views.getips', name='getips'),
    url(r'^info/gettraffic/$', 'usage.views.gettraffic', name='gettraffic'),
    url(r'^info/proc/$', 'usage.views.getproc', name='getproc'),
    url(r'^info/getdiskio/$', 'usage.views.getdiskio', name='getdiskio'),
    url(r'^info/loadaverage/$', 'usage.views.loadaverage', name='loadaverage'),
    url(r'^info/platform/([\w\-\.]+)/$', 'usage.views.platform', name='platform'),
    url(r'^info/getcpus/([\w\-\.]+)/$', 'usage.views.getcpus', name='getcpus'),
    url(r'^info/getnetstat/$', 'usage.views.getnetstat', name='getnetstat'),


    # url(r'^objects$', include('objects.urls')),
    url(r'^dashboard$', 'dashboard.views.getall', name='dashboard'),
    url(r'^$', 'dashboard.views.getall', name='dashboard'),
    url(r'^admin/', include(admin.site.urls)),
)
