# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('networking', '0011_auto_20160911_1305'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ethernet',
            name='desc',
            field=models.CharField(default=None, max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='routing',
            name='desc',
            field=models.CharField(default=None, max_length=255, null=True, blank=True),
        ),
    ]
