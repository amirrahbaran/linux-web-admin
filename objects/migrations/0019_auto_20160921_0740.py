# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0018_auto_20160919_0559'),
    ]

    operations = [
        migrations.AddField(
            model_name='schedule',
            name='day_of_week',
            field=models.CharField(default=None, max_length=1, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='schedule',
            name='group_name',
            field=models.CharField(default=None, max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='added_date',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='edited_date',
            field=models.CharField(default=None, max_length=20, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='id',
            field=models.AutoField(serialize=False, primary_key=True),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='name',
            field=models.CharField(default=None, unique=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='start_time',
            field=models.CharField(default=None, max_length=20, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='stop_time',
            field=models.CharField(default=None, max_length=20, null=True, blank=True),
        ),
    ]
