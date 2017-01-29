from django.db import models


class Profile(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30, unique=True, blank=False, null=False, default=None)
    desc = models.CharField(max_length=80, blank=True, null=True, default=None)
    phase1_algo = models.CharField(max_length=30, blank=True, null=True, default=None)
    phase1_auth = models.CharField(max_length=30, blank=True, null=True, default=None)
    phase1_dhg = models.CharField(max_length=2, blank=True, null=True, default=None)
    phase1_lifetime = models.CharField(max_length=10, blank=True, null=True, default=None)
    phase2_algo = models.CharField(max_length=10, blank=True, null=True, default=None)
    phase2_auth = models.CharField(max_length=5, blank=True, null=True, default=None)
    phase2_dhg = models.CharField(max_length=2, blank=True, null=True, default=None)
    phase2_lifetime = models.CharField(max_length=10, blank=True, null=True, default=None)
    encap_type = models.CharField(max_length=20, blank=True, null=True, default=None)
    encap_local_endpoint = models.CharField(max_length=30, blank=True, null=True, default=None)
    encap_remote_endpoint = models.CharField(max_length=30, blank=True, null=True, default=None)
    encap_service = models.CharField(max_length=30, blank=True, null=True, default=None)
    added_date = models.CharField(max_length=25)
    edited_date = models.CharField(max_length=25, blank=True, null=True, default=None)

    def edit(self):
        self.save()

    def __str__(self):
        return self.desc

    def __unicode__(self):
        return self.desc


class Tunnel(models.Model):
    author = models.ForeignKey('auth.User')
    id = models.AutoField(primary_key=True)
    status = models.BooleanField(default=True)
    dpd = models.BooleanField(default=True)
    name = models.CharField(max_length=30, unique=True, blank=False, null=False, default=None)
    desc = models.CharField(max_length=80, blank=True, null=True, default=None)
    profile = models.CharField(max_length=30, blank=True, null=True, default=None)
    local_network = models.CharField(max_length=30, blank=True, null=True, default=None)
    local_endpoint = models.CharField(max_length=30, blank=True, null=True, default=None)
    local_id = models.CharField(max_length=255, blank=True, null=True, default=None)
    remote_network = models.CharField(max_length=30, blank=True, null=True, default=None)
    remote_endpoint = models.CharField(max_length=30, blank=True, null=True, default=None)
    peer_id = models.CharField(max_length=255, blank=True, null=True, default=None)
    auth_method = models.CharField(max_length=15, blank=True, null=True, default=None)
    pre_key = models.CharField(max_length=255, blank=True, null=True, default=None)
    pri_key = models.CharField(max_length=255, blank=True, null=True, default=None)
    pub_key = models.CharField(max_length=255, blank=True, null=True, default=None)
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
        requested_profile = Profile.objects.get(name=self.profile)
        setVpnTunnelConfigurationOf(self, requested_profile)

    def delete(self, using=None):
        removeVpnTunnelConfigurationOf(self)
        models.Model.delete(self, using=using)
