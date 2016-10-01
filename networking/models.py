from django.db import models
from django.utils import timezone
from django.db.models.fields import PositiveSmallIntegerField

class Ethernet(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True,blank=False, null=False, default=None)
    desc = models.CharField(max_length=255,blank=True, null=True, default=None)
    status = models.BooleanField(default=True)
    dhcp = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(protocol='IPv4',blank=False, null=False, default=None)
    netmask = models.GenericIPAddressField(protocol='IPv4',blank=False, null=False, default="255.255.255.0")
    gateway = models.GenericIPAddressField(protocol='IPv4',blank=True, null=True, default=None)
    primary_dns = models.GenericIPAddressField(protocol='IPv4',blank=True, null=True, default=None)
    secondary_dns = models.GenericIPAddressField(protocol='IPv4',blank=True, null=True, default=None)
    mtu = PositiveSmallIntegerField(blank=False, null=False, default="1500")
    override_mss_flag = models.BooleanField(default=False)
    override_mss_value = PositiveSmallIntegerField(blank=True, null=True, default="1460")
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25,blank=True, null=True, default=None)
    
    def edit(self):
#        self.edited_date = timezone.now()
        self.save()
        
    def __str__(self):
        return self.name

class Routing(models.Model):
    author = models.ForeignKey('auth.User')
    status = models.BooleanField(default=True)
    name = models.CharField(max_length=50,unique=True,blank=False, null=False)
    desc = models.CharField(max_length=255,blank=True, null=True, default=None)
    destination = models.CharField(max_length=255,blank=False, null=False, default=None)
    gateway = models.CharField(max_length=255,blank=False, null=False, default=None)
    interface = models.CharField(max_length=10,blank=True, null=True, default=None)
    metric = PositiveSmallIntegerField(blank=True, null=True, default="0")
    added_date = models.DateTimeField(default=timezone.now)
    edited_date = models.DateTimeField(blank=True, null=True)
    
    def edit(self):
        self.edited_date = timezone.now()
        self.save()
        
    def __str__(self):
        return self.name
