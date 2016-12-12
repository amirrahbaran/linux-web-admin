# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('name', models.CharField(default=None, unique=True, max_length=30)),
                ('desc', models.CharField(default=None, max_length=80, null=True, blank=True)),
                ('phase1_algo', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('phase1_auth', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('phase1_dhg', models.CharField(default=None, max_length=2, null=True, blank=True)),
                ('phase1_lifetime', models.CharField(default=None, max_length=10, null=True, blank=True)),
                ('phase2_algo', models.CharField(default=None, max_length=10, null=True, blank=True)),
                ('phase2_auth', models.CharField(default=None, max_length=5, null=True, blank=True)),
                ('phase2_dhg', models.CharField(default=None, max_length=2, null=True, blank=True)),
                ('phase2_lifetime', models.CharField(default=None, max_length=10, null=True, blank=True)),
                ('encap_type', models.CharField(default=None, max_length=20, null=True, blank=True)),
                ('encap_local_endpoint', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('encap_remote_endpoint', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('encap_service', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('added_date', models.CharField(max_length=25)),
                ('edited_date', models.CharField(default=None, max_length=25, null=True, blank=True)),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Tunnel',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('status', models.BooleanField(default=True)),
                ('dpd', models.BooleanField(default=True)),
                ('name', models.CharField(default=None, unique=True, max_length=30)),
                ('desc', models.CharField(default=None, max_length=80, null=True, blank=True)),
                ('profile', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('local_network', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('local_endpoint', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('local_id', models.CharField(default=None, max_length=255, null=True, blank=True)),
                ('remote_network', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('remote_endpoint', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('peer_id', models.CharField(default=None, max_length=255, null=True, blank=True)),
                ('auth_type', models.CharField(default=None, max_length=15, null=True, blank=True)),
                ('pre_key', models.CharField(default=None, max_length=255, null=True, blank=True)),
                ('pri_key', models.CharField(default=None, max_length=255, null=True, blank=True)),
                ('pub_key', models.CharField(default=None, max_length=255, null=True, blank=True)),
                ('preshared_key', models.CharField(default=None, max_length=255, null=True, blank=True)),
                ('added_date', models.CharField(max_length=25)),
                ('edited_date', models.CharField(default=None, max_length=25, null=True, blank=True)),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
