# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0023_auto_20160925_1331'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule',
            name='start_time',
            field=models.CharField(default=None, max_length=22, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='stop_time',
            field=models.CharField(default=None, max_length=22, null=True, blank=True),
        ),
    ]
