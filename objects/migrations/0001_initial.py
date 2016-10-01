# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('desc', models.CharField(max_length=200)),
                ('group_name', models.CharField(max_length=50)),
                ('version', models.CharField(max_length=2)),
                ('type', models.CharField(max_length=10)),
                ('value', models.CharField(max_length=52)),
                ('added_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('edited_date', models.DateTimeField(null=True, blank=True)),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
