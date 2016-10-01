# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0021_auto_20160924_0737'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='added_date',
            field=models.CharField(max_length=25),
        ),
        migrations.AlterField(
            model_name='address',
            name='edited_date',
            field=models.CharField(default=None, max_length=25, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='protocol',
            name='added_date',
            field=models.CharField(max_length=25),
        ),
        migrations.AlterField(
            model_name='protocol',
            name='edited_date',
            field=models.CharField(default=None, max_length=25, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='added_date',
            field=models.CharField(max_length=25),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='edited_date',
            field=models.CharField(default=None, max_length=25, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='start_time',
            field=models.CharField(default=None, max_length=16, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='stop_time',
            field=models.CharField(default=None, max_length=16, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='zone',
            name='added_date',
            field=models.CharField(max_length=25),
        ),
        migrations.AlterField(
            model_name='zone',
            name='edited_date',
            field=models.CharField(default=None, max_length=25, null=True, blank=True),
        ),
    ]
