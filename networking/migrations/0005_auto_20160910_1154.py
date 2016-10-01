# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('networking', '0004_auto_20160910_1142'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ethernet',
            name='gateway',
            field=models.GenericIPAddressField(null=True, protocol=b'IPv4', default=None, blank=True, unique=True),
        ),
    ]
