from django.db import models
from django.db.models.fields import PositiveSmallIntegerField

from main.views import setNetworkConfigurationOf, removeRoutingConfigurationOf, \
    removeNetworkConfigurationOf, shutdown, startup, setRoutingConfigurationOf, setPermanentRouteTable


class Ethernet(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=10, unique=True, blank=False, null=False, default=None)
    desc = models.CharField(max_length=80, blank=True, null=True, default=None)
    status = models.BooleanField(default=True)
    dhcp = models.BooleanField(default=False)
    link = models.BooleanField(default=True)
    mac = models.CharField(max_length=17, blank=True, null=True, default=None)
    ipv4address = models.CharField(max_length=240, blank=True, null=True, default=None)
    gateway = models.CharField(max_length=255, blank=True, null=True, default=None)
    manual_dns = models.BooleanField(default=True)
    dnsserver = models.CharField(max_length=32, blank=True, null=True, default=None)
    mtu = PositiveSmallIntegerField(blank=False, null=False, default="1500")
    manual_mss = models.BooleanField(default=False)
    mss = PositiveSmallIntegerField(blank=True, null=True, default="1460")
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25, blank=True, null=True, default=None)

    def edit(self):
        self.save()

    def __str__(self):
        return self.desc

    def __unicode__(self):
        return self.desc

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        shutdown(self)
        removeNetworkConfigurationOf(self)
        models.Model.save(self, force_insert=force_insert, force_update=force_update, using=using,
                          update_fields=update_fields)
        setNetworkConfigurationOf(self)
        startup(self)

    def delete(self, using=None):
        shutdown(self)
        removeNetworkConfigurationOf(self)
        models.Model.delete(self, using=using)


class Routing(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    status = models.BooleanField(default=True)
    name = models.CharField(max_length=30, unique=True, blank=False, null=False)
    desc = models.CharField(max_length=80, blank=True, null=True, default=None)
    ipv4address = models.CharField(max_length=240, blank=True, null=True, default=None)
    gateway = models.CharField(max_length=30, blank=True, null=True, default=None)
    link = models.BooleanField(default=False)
    interface = models.CharField(max_length=10, blank=True, null=True, default=None)
    metric = PositiveSmallIntegerField(blank=True, null=True, default="0")
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25, blank=True, null=True, default=None)

    def edit(self):
        self.save()

    def __str__(self):
        return self.desc

    def __unicode__(self):
        return self.desc

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        models.Model.save(self, force_insert=force_insert, force_update=force_update, using=using,
                          update_fields=update_fields)
        setRoutingConfigurationOf(self)
        routes = Routing.objects.all()
        setPermanentRouteTable(routes)

    def delete(self, using=None):
        removeRoutingConfigurationOf(self)
        models.Model.delete(self, using=using)
        routes = Routing.objects.all()
        setPermanentRouteTable(routes)
