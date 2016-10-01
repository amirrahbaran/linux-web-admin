# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0019_auto_20160921_0740'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedule',
            name='group_name',
        ),
        migrations.AlterField(
            model_name='zone',
            name='added_date',
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name='zone',
            name='edited_date',
            field=models.CharField(default=None, max_length=20, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='zone',
            name='id',
            field=models.AutoField(serialize=False, primary_key=True),
        ),
        migrations.AlterField(
            model_name='zone',
            name='name',
            field=models.CharField(default=None, unique=True, max_length=50),
        ),
    ]
