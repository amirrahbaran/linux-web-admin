# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('objects', '0003_zone'),
    ]

    operations = [
        migrations.CreateModel(
            name='Protocol',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('desc', models.CharField(max_length=200)),
                ('protocol', models.CharField(max_length=5)),
                ('direction', models.CharField(default=b'src', max_length=2, choices=[(b'src', b'Source'), (b'dst', b'Destination')])),
                ('ports', models.CharField(max_length=11)),
                ('added_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('edited_date', models.DateTimeField(null=True, blank=True)),
                ('author', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
