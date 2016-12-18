from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.auth import views as auth_views
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^vpn', include('vpn.urls')),
    url(r'^policies', include('policies.urls')),
    url(r'^networking', include('networking.urls')),
    url(r'^objects', include('objects.urls')),
    url(r'^login/$', auth_views.login, {'template_name': 'dashboard/login.html'}, name='login'),
    url(r'^logout/$', auth_views.logout, {'template_name': 'dashboard/logout.html','next_page': '/'}, name='logout'),
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
    url(r'^dashboard$', 'dashboard.views.getall', name='dashboard'),
    url(r'^$', 'dashboard.views.getall', name='dashboard'),
    url(r'^admin/', include(admin.site.urls)),
)
