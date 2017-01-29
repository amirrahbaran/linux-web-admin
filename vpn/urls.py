from django.conf.urls import patterns, url
from vpn import views

urlpatterns = patterns(
    '',
    url(r'profile$', views.profile_list, name='profile_list'),
    url(r'profile/update$', views.profile_update, name='profile_update'),
    url(r'profile/create$', views.profile_create, name='profile_create'),
    url(r'profile/read$', views.profile_read, name='profile_read'),
    url(r'profile/update$', views.profile_update, name='profile_update'),
    url(r'profile/delete$', views.profile_delete, name='profile_delete'),
    url(r'profile/view$', views.profile_view, name='profile_view'),
    url(r'profile/getlist$', views.profile_getlist, name='profile_getlist'),

    url(r'tunnel$', views.tunnel_list, name='tunnel_list'),
    url(r'tunnel/update$', views.tunnel_update, name='tunnel_update'),
    url(r'tunnel/create$', views.tunnel_create, name='tunnel_create'),
    url(r'tunnel/read$', views.tunnel_read, name='tunnel_read'),
    url(r'tunnel/update$', views.tunnel_update, name='tunnel_update'),
    url(r'tunnel/delete$', views.tunnel_delete, name='tunnel_delete'),
    url(r'tunnel/view$', views.tunnel_view, name='tunnel_view')
)
