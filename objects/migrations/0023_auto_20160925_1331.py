# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0022_auto_20160924_0916'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule',
            name='start_time',
            field=models.CharField(default=None, max_length=20, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='stop_time',
            field=models.CharField(default=None, max_length=20, null=True, blank=True),
        ),
    ]
