# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('networking', '0005_auto_20160910_1154'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ethernet',
            name='gateway',
            field=models.GenericIPAddressField(default=None, null=True, protocol=b'IPv4', blank=True),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='ip_address',
            field=models.GenericIPAddressField(default=None, protocol=b'IPv4'),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='name',
            field=models.CharField(unique=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='primary_dns',
            field=models.GenericIPAddressField(default=None, null=True, protocol=b'IPv4', blank=True),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='secondary_dns',
            field=models.GenericIPAddressField(default=None, null=True, protocol=b'IPv4', blank=True),
        ),
    ]
