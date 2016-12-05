from django.db import models
from django.db.models.fields import PositiveSmallIntegerField
from netsecui.settings import NETWORK_PATH
# from main.views import removeNetworkConfigurationOf, setNetworkConfigurationOf, removeRoutingConfigurationOf, setRoutingConfigurationOf
# from django.core.validators import MinValueValidator, MaxValueValidator

NetworkConfigurationPath = NETWORK_PATH

class Ethernet(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=10,unique=True,blank=False, null=False, default=None)
    desc = models.CharField(max_length=255,blank=True, null=True, default=None)
    status = models.BooleanField(default=True)
    dhcp = models.BooleanField(default=False)
    link = models.BooleanField(default=False)
    mac = models.CharField(max_length=17,blank=True, null=True, default=None)
    # ipv4address = models.GenericIPAddressField(protocol='IPv4',blank=False, null=False, default=None)
    # netmask = models.GenericIPAddressField(protocol='IPv4',blank=False, null=False, default="255.255.255.0")
    # netmask = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(32)])
    gateway = models.GenericIPAddressField(protocol='IPv4',blank=True, null=True, default=None)
    manual_dns = models.BooleanField(default=True)
    primary_dns = models.GenericIPAddressField(protocol='IPv4',blank=True, null=True, default=None)
    secondary_dns = models.GenericIPAddressField(protocol='IPv4',blank=True, null=True, default=None)
    mtu = PositiveSmallIntegerField(blank=False, null=False, default="1500")
    manual_mss = models.BooleanField(default=False)
    mss = PositiveSmallIntegerField(blank=True, null=True, default="1460")
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25,blank=True, null=True, default=None)
    
    def edit(self):
#        self.edited_date = timezone.now()
        self.save()
    
    def __str__(self):
        return self.desc
    
    def __unicode__(self):
        return self.desc
    
    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        models.Model.save(self, force_insert=force_insert, force_update=force_update, using=using, update_fields=update_fields)
#         removeNetworkConfigurationOf(self)
#         setNetworkConfigurationOf(self)

class Virtual(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    # desc = models.CharField(max_length=255,blank=True, null=True, default=None)
    parent = models.CharField(max_length=10,blank=True, null=True, default=None)
    ipv4address = models.GenericIPAddressField(protocol='IPv4',blank=False, null=False, default=None)
    netmask = models.GenericIPAddressField(protocol='IPv4',blank=False, null=False, default="255.255.255.0")
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25,blank=True, null=True, default=None)
    
    def edit(self):
#        self.edited_date = timezone.now()
        self.save()
        
    # def __str__(self):
    #     return self.desc
    #
    # def __unicode__(self):
    #     return self.desc
    
class Routing(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    status = models.BooleanField(default=True)
    name = models.CharField(max_length=50,unique=True,blank=False, null=False)
    desc = models.CharField(max_length=255,blank=True, null=True, default=None)
    ipv4address = models.GenericIPAddressField(protocol='IPv4',blank=False, null=False, default=None)
    netmask = models.GenericIPAddressField(protocol='IPv4',blank=False, null=False, default="255.255.255.0")
    gateway = models.CharField(max_length=255,blank=False, null=False, default=None)
    link = models.BooleanField(default=False)
    interface = models.CharField(max_length=10,blank=True, null=True, default=None)
    metric = PositiveSmallIntegerField(blank=True, null=True, default="0")
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25,blank=True, null=True, default=None)
    
    def edit(self):
#         self.edited_date = timezone.now()
        self.save()
        
    def __str__(self):
        return self.desc

    def __unicode__(self):
        return self.desc
    
    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        models.Model.save(self, force_insert=force_insert, force_update=force_update, using=using, update_fields=update_fields)
#         setRoutingConfigurationOf(self)
         
    def delete(self, using=None):
        models.Model.delete(self, using=using)
#         removeRoutingConfigurationOf(self.interface)
        