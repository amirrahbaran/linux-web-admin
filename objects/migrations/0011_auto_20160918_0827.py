# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0010_auto_20160918_0825'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='name',
            field=models.CharField(default=None, unique=True, max_length=50),
        ),
    ]
