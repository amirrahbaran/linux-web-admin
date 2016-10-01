# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('networking', '0008_auto_20160910_1215'),
    ]

    operations = [
        migrations.CreateModel(
            name='Routing',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.BooleanField(default=True)),
                ('name', models.CharField(unique=True, max_length=50)),
                ('desc', models.CharField(default=None, max_length=200, null=True, blank=True)),
                ('destination_entity', models.CharField(default=None, max_length=255)),
                ('gateway_entity', models.CharField(default=None, max_length=255)),
                ('interface', models.CharField(default=None, max_length=10)),
                ('metric', models.PositiveSmallIntegerField(default=b'0')),
                ('added_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('edited_date', models.DateTimeField(null=True, blank=True)),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='name',
            field=models.CharField(unique=True, max_length=10),
        ),
    ]
