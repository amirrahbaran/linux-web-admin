from django.db import models

class Address(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30,unique=True,blank=False, null=False, default=None)
    desc = models.CharField(max_length=80,blank=True, null=True, default=None)
    group_name = models.CharField(max_length=30,blank=False, null=False, default=None)
    version = models.CharField(max_length=30,blank=True, null=True, default="ipv4")
    type = models.CharField(max_length=30,blank=True, null=True, default="subnet")
    value = models.CharField(max_length=255,blank=False, null=False, default=None)
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25,blank=True, null=True, default=None)
    
    def edit(self):
        self.save()
        
    def __str__(self):
        return self.desc

    def __unicode__(self):
        return self.desc


class Protocol(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True,blank=False, null=False, default=None)
    desc = models.CharField(max_length=255,blank=True, null=True, default=None)
    group_name = models.CharField(max_length=50,blank=True, null=True, default=None)
    TCP = 'tcp'
    UDP = 'udp'    
    PROTO_CHOICES = (
            (TCP, 'TCP'),
            (UDP, 'UDP'),
        )    
    protocol = models.CharField(max_length=3,
                                    choices=PROTO_CHOICES,
                                    default=TCP)
    SRC = 'src'
    DST = 'dst'    
    DIR_CHOICES = (
            (SRC, 'Source'),
            (DST, 'Destination'),
        )    
    direction = models.CharField(max_length=3,
                                    choices=DIR_CHOICES,
                                    default=SRC)
    value = models.CharField(max_length=11)
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25,blank=True, null=True, default=None)
    
    def edit(self):
#         self.edited_date = timezone.now()
        self.save()
        
    def __str__(self):
        return self.name

class Schedule(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True,blank=False, null=False, default=None)
    desc = models.CharField(max_length=255,blank=True, null=True, default=None)
    day_of_week = models.CharField(max_length=255,blank=True, null=True, default=None)
    start_time = models.CharField(max_length=22,blank=True, null=True, default=None)
    stop_time = models.CharField(max_length=22,blank=True, null=True, default=None)
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25,blank=True, null=True, default=None)
    
    def edit(self):
#         self.edited_date = timezone.now()
        self.save()
        
    def __str__(self):
        return self.name
    
class Zone(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50,unique=True,blank=False, null=False, default=None)
    desc = models.CharField(max_length=255,blank=True, null=True, default=None)
    members = models.CharField(max_length=255)
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25,blank=True, null=True, default=None)
    
    def edit(self):
#         self.edited_date = timezone.now()
        self.save()
        
    def __str__(self):
        return self.name
