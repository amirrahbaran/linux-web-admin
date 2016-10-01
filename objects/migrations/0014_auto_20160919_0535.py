# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0013_auto_20160919_0521'),
    ]

    operations = [
        migrations.RenameField(
            model_name='protocol',
            old_name='ports',
            new_name='value',
        ),
    ]
