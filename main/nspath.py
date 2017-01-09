import os
from main.directory import Directory

current = os.path.dirname(os.path.realpath(__file__)) + '/'

# DIRECTORIES

NETWORK_CONF_PATH = '/etc/network/interfaces.d/test/'
ethernet_conf_object = Directory(NETWORK_CONF_PATH)
if not ethernet_conf_object.Existed():
    ethernet_conf_object.Make()

# FILES

# python begins the file section
python = '/usr/bin/python'

# BOOLEANS
no_use_notifications = False

