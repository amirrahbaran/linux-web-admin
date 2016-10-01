# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('networking', '0009_auto_20160910_1225'),
    ]

    operations = [
        migrations.RenameField(
            model_name='routing',
            old_name='destination_entity',
            new_name='destination',
        ),
        migrations.RenameField(
            model_name='routing',
            old_name='gateway_entity',
            new_name='gateway',
        ),
    ]
