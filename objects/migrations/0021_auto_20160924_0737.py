# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0020_auto_20160921_0824'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schedule',
            name='day_of_week',
            field=models.CharField(default=None, max_length=255, null=True, blank=True),
        ),
    ]
