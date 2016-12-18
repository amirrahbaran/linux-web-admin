from django.conf.urls import patterns, include, url
from vpn import views

urlpatterns = patterns('',
    url(r'profile$', views.profile_list, name='profile_list'),
    url(r'profile/update$', views.profile_update, name='profile_update'),
    url(r'profile/create$', views.profile_create, name='profile_create'),
    url(r'profile/read$', views.profile_read, name='profile_read'),
    url(r'profile/update$', views.profile_update, name='profile_update'),
    url(r'profile/view$', views.profile_view, name='profile_view'),

    url(r'tunnel$', views.tunnel_list, name='tunnel_list'),
    url(r'tunnel/update$', views.tunnel_update, name='tunnel_update'),
    url(r'tunnel/create$', views.tunnel_create, name='tunnel_create'),
    url(r'tunnel/read$', views.tunnel_read, name='tunnel_read'),
    url(r'tunnel/update$', views.tunnel_update, name='tunnel_update'),
    url(r'tunnel/view$', views.tunnel_view, name='tunnel_view')
)
