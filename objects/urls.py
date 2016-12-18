from django.conf.urls import patterns, url
from objects import views


urlpatterns = patterns(
    '',
    url(r'address$', views.address_list, name='address_list'),
    url(r'address/create$', views.address_create, name='address_create'),
    url(r'address/read$', views.address_read, name='address_read'),
    url(r'address/update$', views.address_update, name='address_update'),
    url(r'address/delete$', views.address_delete, name='address_delete'),
    url(r'address/view$', views.address_view, name='address_view'),
    url(r'address/getlist$', views.getAddressList, name='getAddressList'),
    url(r'address/gethostlist$', views.getHostList, name='getHostList'),
    url(r'address/getgroup$', views.getAddressGroupNames, name='getAddressGroupNames'),


    url(r'protocol$', views.protocol_list, name='protocol_list'),
    url(r'protocol/create$', views.protocol_create, name='protocol_create'),
    url(r'protocol/read$', views.protocol_read, name='protocol_read'),
    url(r'protocol/update$', views.protocol_update, name='protocol_update'),
    url(r'protocol/delete$', views.protocol_delete, name='protocol_delete'),
    url(r'protocol/getlist$', views.getProtocolList, name='getProtocolList'),
    url(r'protocol/view$', views.protocol_view, name='protocol_view'),
    url(r'protocol/getgroup$', views.getProtocolGroupNames, name='getProtocolGroupNames'),
    url(r'protocol/getportlist$', views.getPortList, name='getPortList'),

    url(r'schedule$', views.schedule_list, name='schedule_list'),
    url(r'schedule/create$', views.schedule_create, name='schedule_create'),
    url(r'schedule/read$', views.schedule_read, name='schedule_read'),
    url(r'schedule/update$', views.schedule_update, name='schedule_update'),
    url(r'schedule/delete$', views.schedule_delete, name='schedule_delete'),
    url(r'schedule/view$', views.schedule_view, name='schedule_view'),
    url(r'schedule/getlist$', views.getScheduleList, name='getScheduleList'),

    url(r'zone$', views.zone_list, name='zone_list'),
    url(r'zone/create$', views.zone_create, name='zone_create'),
    url(r'zone/read$', views.zone_read, name='zone_read'),
    url(r'zone/update$', views.zone_update, name='zone_update'),
    url(r'zone/delete$', views.zone_delete, name='zone_delete'),
    url(r'zone/view$', views.zone_view, name='zone_view'),
    url(r'zone/getlist$', views.getZoneList, name='getZoneList')
)
