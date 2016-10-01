# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('networking', '0007_auto_20160910_1201'),
    ]

    operations = [
        migrations.AddField(
            model_name='ethernet',
            name='mtu',
            field=models.PositiveSmallIntegerField(default=b'1500'),
        ),
        migrations.AddField(
            model_name='ethernet',
            name='override_mss_flag',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='ethernet',
            name='override_mss_value',
            field=models.PositiveSmallIntegerField(default=b'1460'),
        ),
    ]
