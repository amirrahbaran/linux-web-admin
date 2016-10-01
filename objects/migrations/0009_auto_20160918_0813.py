# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0008_auto_20160918_0658'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='added_date',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='address',
            name='edited_date',
            field=models.CharField(default=None, max_length=20, null=True, blank=True),
        ),
    ]
