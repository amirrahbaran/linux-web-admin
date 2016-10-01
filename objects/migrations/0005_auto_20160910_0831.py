# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('objects', '0004_protocol'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='type',
            field=models.CharField(default=b'SUBNET', max_length=7, choices=[(b'SUBNET', b'Subnet'), (b'MAC', b'MAC'), (b'IPRANGE', b'IP Range'), (b'FQDN', b'FQDN'), (b'DOMAIN', b'Domain')]),
        ),
        migrations.AlterField(
            model_name='address',
            name='value',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='address',
            name='version',
            field=models.CharField(default=b'v4', max_length=2, choices=[(b'v4', b'IPv4'), (b'v6', b'IPv6')]),
        ),
        migrations.AlterField(
            model_name='protocol',
            name='direction',
            field=models.CharField(default=b'src', max_length=3, choices=[(b'src', b'Source'), (b'dst', b'Destination')]),
        ),
        migrations.AlterField(
            model_name='protocol',
            name='protocol',
            field=models.CharField(default=b'tcp', max_length=3, choices=[(b'tcp', b'TCP'), (b'udp', b'UDP')]),
        ),
    ]
