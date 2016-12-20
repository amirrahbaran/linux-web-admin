from django.conf.urls import patterns, url
from policies import views


urlpatterns = patterns(
    '',
    url(r'list$', views.policies_list, name='policies_list'),
    url(r'create$', views.policies_create, name='policies_create'),
    url(r'read$', views.policies_read, name='policies_read'),
    url(r'update$', views.policies_update, name='policies_update'),
    url(r'view$', views.policies_view, name='policies_view'),
    url(r'delete$', views.policies_delete, name='policies_delete'),
)
