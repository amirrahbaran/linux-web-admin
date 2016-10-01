# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0011_auto_20160918_0827'),
    ]

    operations = [
        migrations.AddField(
            model_name='protocol',
            name='group_name',
            field=models.CharField(default=None, max_length=50),
        ),
        migrations.AlterField(
            model_name='address',
            name='group_name',
            field=models.CharField(default=None, max_length=50),
        ),
        migrations.AlterField(
            model_name='protocol',
            name='added_date',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='protocol',
            name='edited_date',
            field=models.CharField(default=None, max_length=20, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='protocol',
            name='id',
            field=models.AutoField(serialize=False, primary_key=True),
        ),
        migrations.AlterField(
            model_name='protocol',
            name='name',
            field=models.CharField(default=None, unique=True, max_length=50),
        ),
    ]
