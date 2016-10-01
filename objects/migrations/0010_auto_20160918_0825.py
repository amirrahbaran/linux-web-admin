# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0009_auto_20160918_0813'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='name',
            field=models.CharField(default=None, max_length=50, null=True, blank=True),
        ),
    ]
