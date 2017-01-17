from django.db import models

from main.policies import Policy


class Policies(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    status = models.BooleanField(default=True)
    log = models.BooleanField(default=False)
    name = models.CharField(max_length=30, unique=True, blank=False, null=False, default=None)
    desc = models.CharField(max_length=80, blank=True, null=True, default=None)
    action = models.CharField(max_length=6, blank=True, null=True, default=None)
    schedule = models.CharField(max_length=30, blank=True, null=True, default=None)
    source_zone = models.CharField(max_length=30, blank=True, null=True, default=None)
    destination_zone = models.CharField(max_length=30, blank=True, null=True, default=None)
    source_network = models.CharField(max_length=30, blank=True, null=True, default=None)
    destination_network = models.CharField(max_length=30, blank=True, null=True, default=None)
    source_service = models.CharField(max_length=30, blank=True, null=True, default=None)
    destination_service = models.CharField(max_length=30, blank=True, null=True, default=None)
    snat_enabled = models.BooleanField(default=False)
    snat_policy = models.CharField(max_length=4, blank=True, null=True, default=None)
    snat_to = models.CharField(max_length=255, blank=True, null=True, default=None)
    dnat_enabled = models.BooleanField(default=False)
    dnat_to = models.CharField(max_length=255, blank=True, null=True, default=None)
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25, blank=True, null=True, default=None)

    def edit(self):
        self.save()

    def __str__(self):
        return self.desc

    def __unicode__(self):
        return self.desc

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        models.Model.save(self, force_insert=force_insert, force_update=force_update, using=using, update_fields=update_fields)
        ThePolicy = Policy(self)
        self.source_service.split("-")
        ThePolicy.Add()

    def delete(self, using=None):

        models.Model.delete(self, using=using)
