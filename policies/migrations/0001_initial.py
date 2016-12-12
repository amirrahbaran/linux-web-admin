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
            name='Policies',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True)),
                ('status', models.BooleanField(default=True)),
                ('log', models.BooleanField(default=False)),
                ('name', models.CharField(default=None, unique=True, max_length=30)),
                ('desc', models.CharField(default=None, max_length=80, null=True, blank=True)),
                ('action', models.CharField(default=None, max_length=6)),
                ('schedule', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('source_zone', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('destination_zone', models.CharField(default=None, max_length=30)),
                ('source_network', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('destination_network', models.CharField(default=None, max_length=30)),
                ('source_service', models.CharField(default=None, max_length=30, null=True, blank=True)),
                ('destination_service', models.CharField(default=None, max_length=30)),
                ('snat_enabled', models.BooleanField(default=False)),
                ('snat_policy', models.CharField(default=None, max_length=4)),
                ('snat_to', models.CharField(default=None, max_length=255)),
                ('dnat_enabled', models.BooleanField(default=False)),
                ('dnat_to', models.CharField(default=None, max_length=255)),
                ('added_date', models.CharField(max_length=25)),
                ('edited_date', models.CharField(default=None, max_length=25, null=True, blank=True)),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
