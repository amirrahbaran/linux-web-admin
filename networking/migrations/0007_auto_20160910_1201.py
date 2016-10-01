# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('networking', '0006_auto_20160910_1158'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ethernet',
            name='desc',
            field=models.CharField(default=None, max_length=200, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='dhcp',
            field=models.BooleanField(default=False),
        ),
    ]
