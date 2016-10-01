# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0005_auto_20160910_0831'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='desc',
            field=models.CharField(default=None, max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='address',
            name='name',
            field=models.CharField(unique=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='address',
            name='version',
            field=models.CharField(default=b'IPv4', max_length=2, choices=[(b'IPv4', b'IPv4'), (b'IPv6', b'IPv6')]),
        ),
        migrations.AlterField(
            model_name='protocol',
            name='desc',
            field=models.CharField(default=None, max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='protocol',
            name='name',
            field=models.CharField(unique=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='desc',
            field=models.CharField(default=None, max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='name',
            field=models.CharField(unique=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='zone',
            name='desc',
            field=models.CharField(default=None, max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='zone',
            name='name',
            field=models.CharField(unique=True, max_length=50),
        ),
    ]
