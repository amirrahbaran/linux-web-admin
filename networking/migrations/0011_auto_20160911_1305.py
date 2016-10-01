# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('networking', '0010_auto_20160910_1227'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ethernet',
            name='override_mss_value',
            field=models.PositiveSmallIntegerField(default=b'1460', null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='routing',
            name='interface',
            field=models.CharField(default=None, max_length=10, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='routing',
            name='metric',
            field=models.PositiveSmallIntegerField(default=b'0', null=True, blank=True),
        ),
    ]
