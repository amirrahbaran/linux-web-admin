from django.conf.urls import patterns, url
from networking import views

urlpatterns = patterns(
    '',
    url(r'ethernet$', views.ethernet_list, name='ethernet_list'),
    url(r'ethernet/create$', views.ethernet_create, name='ethernet_create'),
    url(r'ethernet/read$', views.ethernet_read, name='ethernet_read'),
    url(r'ethernet/update$', views.ethernet_update, name='ethernet_update'),
    url(r'ethernet/delete$', views.ethernet_delete, name='ethernet_delete'),
    url(r'ethernet/view$', views.ethernet_view, name='ethernet_view'),
    url(r'ethernet/getlist$', views.getEthernetList, name='getEthernetList'),
    url(r'ethernet/getrealethernets$', views.getRealEthernets, name='getRealEthernets'),
    url(r'ethernet/getethernetlink$', views.getEthernetLinkStatus, name='getEthernetLinkStatus'),

    url(r'routing$', views.routing_list, name='routing_list'),
    url(r'routing/create$', views.routing_create, name='routing_create'),
    url(r'routing/read$', views.routing_read, name='routing_read'),
    url(r'routing/update$', views.routing_update, name='routing_update'),
    url(r'routing/delete$', views.routing_delete, name='routing_delete'),
    url(r'routing/view$', views.routing_view, name='routing_view')
)
