# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('networking', '0003_auto_20160910_1138'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ethernet',
            name='gateway',
            field=models.GenericIPAddressField(default=b'', null=True, protocol=b'IPv4'),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='netmask',
            field=models.GenericIPAddressField(default=b'255.255.255.0', protocol=b'IPv4'),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='primary_dns',
            field=models.GenericIPAddressField(default=b'', null=True, protocol=b'IPv4'),
        ),
        migrations.AlterField(
            model_name='ethernet',
            name='secondary_dns',
            field=models.GenericIPAddressField(default=b'', null=True, protocol=b'IPv4'),
        ),
    ]
