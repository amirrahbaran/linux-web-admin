from django.conf.urls import patterns, include, url
from objects import views
from networking import views as netviews
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^networking/ethernet/add_virtual$', netviews.add_virtual, name='add_virtual'),
    url(r'^networking/ethernet/ethernet_update$', netviews.ethernet_update, name='ethernet_update'),
    url(r'^networking/ethernet/get_edit$', netviews.ethernet_view, name='ethernet_view'),
    url(r'^networking/ethernet/read$', netviews.ethernet_read, name='ethernet_read'),
    url(r'^networking$', include('networking.urls')),
    url(r'^objects/zone/create$', views.zone_create, name='zone_create'),
    url(r'^objects/zone/read$', views.zone_read, name='zone_read'),
    url(r'^objects/zone/update$', views.zone_update, name='zone_update'),
    url(r'^objects/zone/delete$', views.zone_delete, name='zone_delete'),
    url(r'^objects/zone/ethernet$', views.ethernet_list, name='ethernet_list'),    
    url(r'^objects/schedule/create$', views.schedule_create, name='schedule_create'),
    url(r'^objects/schedule/read$', views.schedule_read, name='schedule_read'),
    url(r'^objects/schedule/update$', views.schedule_update, name='schedule_update'),
    url(r'^objects/schedule/delete$', views.schedule_delete, name='schedule_delete'),
    url(r'^objects/protocol/create$', views.protocol_create, name='protocol_create'),
    url(r'^objects/protocol/read$', views.protocol_read, name='protocol_read'),
    url(r'^objects/protocol/update$', views.protocol_update, name='protocol_update'),
    url(r'^objects/protocol/delete$', views.protocol_delete, name='protocol_delete'),
    url(r'^objects/address/create$', views.address_create, name='address_create'),
    url(r'^objects/address/read$', views.address_read, name='address_read'),
    url(r'^objects/address/update$', views.address_update, name='address_update'),
    url(r'^objects/address/delete$', views.address_delete, name='address_delete'),
    url(r'^objects/address/type$', views.type_list, name='type_list'),
    url(r'^objects/zone$', views.zone_list, name='zone_list'),
    url(r'^objects/schedule$', views.schedule_list, name='schedule_list'),
    url(r'^objects/protocol$', views.protocol_list, name='protocol_list'),
    url(r'^objects/address$', views.address_list, name='address_list'),
    url(r'^objects$', include('objects.urls')),
    url(r'^dashboard$', include('dashboard.urls')),
    url(r'^$', include('dashboard.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
