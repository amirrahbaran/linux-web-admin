# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0017_auto_20160919_0552'),
    ]

    operations = [
        migrations.AlterField(
            model_name='protocol',
            name='group_name',
            field=models.CharField(default=None, max_length=50, null=True, blank=True),
        ),
    ]
