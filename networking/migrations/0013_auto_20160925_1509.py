# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('networking', '0012_auto_20160917_1257'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ethernet',
            name='added_date',
            field=models.CharField(max_length=25),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='edited_date',
            field=models.CharField(default=None, max_length=25, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='id',
            field=models.AutoField(serialize=False, primary_key=True),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='name',
            field=models.CharField(default=None, unique=True, max_length=50),
        ),
    ]
