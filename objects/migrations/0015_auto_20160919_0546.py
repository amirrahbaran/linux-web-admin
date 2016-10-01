# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0014_auto_20160919_0535'),
    ]

    operations = [
        migrations.AlterField(
            model_name='protocol',
            name='group_name',
            field=models.CharField(default=b'', max_length=30, null=True, blank=True),
        ),
    ]
