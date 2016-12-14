from django.conf.urls import patterns, url
from networking import views

urlpatterns = patterns('',
    url(r'routing/view$', views.routing_view, name='routing_view'),
    url(r'ethernet/get_edit$', views.ethernet_view, name='ethernet_view'),
    url(r'routing/delete$', views.routing_delete, name='routing_delete'),
    url(r'routing/update$', views.routing_update, name='routing_update'),
    url(r'ethernet/ethernet_update$', views.ethernet_update, name='ethernet_update'),
    url(r'routing/read$', views.routing_read, name='routing_read'),
    url(r'ethernet/read$', views.networking_read, name='networking_read'),
    url(r'routing/create$', views.routing_create, name='routing_create'),
    url(r'routing$', views.routing, name='routing'),
    url(r'ethernet/getlist$', views.getEthernetList, name='getEthernetList'),
)
