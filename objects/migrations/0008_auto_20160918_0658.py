# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0007_auto_20160917_1352'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='id',
            field=models.AutoField(serialize=False, primary_key=True),
        ),
    ]
