# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('policies', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='policies',
            name='action',
            field=models.CharField(default=None, max_length=6, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='policies',
            name='destination_network',
            field=models.CharField(default=None, max_length=30, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='policies',
            name='destination_service',
            field=models.CharField(default=None, max_length=30, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='policies',
            name='destination_zone',
            field=models.CharField(default=None, max_length=30, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='policies',
            name='dnat_to',
            field=models.CharField(default=None, max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='policies',
            name='snat_policy',
            field=models.CharField(default=None, max_length=4, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='policies',
            name='snat_to',
            field=models.CharField(default=None, max_length=255, null=True, blank=True),
        ),
    ]
