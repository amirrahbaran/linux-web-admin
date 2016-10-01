# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0006_auto_20160917_1257'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='version',
            field=models.CharField(default=b'4', max_length=2, choices=[(b'4', b'IPv4'), (b'6', b'IPv6')]),
        ),
    ]
