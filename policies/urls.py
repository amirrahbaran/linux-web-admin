from django.conf.urls import patterns, url
from . import views

urlpatterns = patterns(
    '',
    url(r'^policies$', views.policies_list, name='policies_list'),
    url(r'^policies/create$', views.policies_create, name='policies_create'),
    url(r'^policies/read$', views.policies_read, name='policies_read'),
    url(r'^policies/update$', views.policies_update, name='policies_update'),
    url(r'^policies/view$', views.policies_view, name='policies_view'),
    url(r'^policies/delete$', views.policies_delete, name='policies_delete'),
)
