# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('networking', '0002_remove_ethernet_group_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='ethernet',
            name='dhcp',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='ethernet',
            name='gateway',
            field=models.GenericIPAddressField(default=b'', protocol=b'IPv4'),
        ),
        migrations.AddField(
            model_name='ethernet',
            name='ip_address',
            field=models.GenericIPAddressField(default=b'', protocol=b'IPv4'),
        ),
        migrations.AddField(
            model_name='ethernet',
            name='netmask',
            field=models.GenericIPAddressField(default=b'', protocol=b'IPv4'),
        ),
        migrations.AddField(
            model_name='ethernet',
            name='primary_dns',
            field=models.GenericIPAddressField(default=b'', protocol=b'IPv4'),
        ),
        migrations.AddField(
            model_name='ethernet',
            name='secondary_dns',
            field=models.GenericIPAddressField(default=b'', protocol=b'IPv4'),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='status',
            field=models.BooleanField(default=True),
        ),
    ]
