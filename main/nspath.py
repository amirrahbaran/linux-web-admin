import os
from main.directory import Directory
from main.file import File

current = os.path.dirname(os.path.realpath(__file__)) + '/'

# DIRECTORIES

NETWORK_CONF_PATH = '/etc/network/interfaces.d/'
ethernet_conf_object = Directory(NETWORK_CONF_PATH)
if not ethernet_conf_object.Existed():
    ethernet_conf_object.Make()

ROUTE_CONF_PATH = '/etc/network/if-up.d/'
route_conf_object = Directory(ROUTE_CONF_PATH)
if not route_conf_object.Existed():
    route_conf_object.Make()

# FILES
NETWORK_CONF_MAIN = '/etc/network/'
NETWORK_CONF_IFACE = 'interfaces'
ethernet_conf_main = File(NETWORK_CONF_IFACE, NETWORK_CONF_MAIN)
MainConfigurationsText = """# interfaces(5) file used by ifup(8) and ifdown(8)
auto lo
iface lo inet loopback

source /etc/network/interfaces.d/ifcfg-*
"""
ethernet_conf_main.Write(MainConfigurationsText)

ROUTE_CONF_FILE = 'routes'
route_conf_main = File(ROUTE_CONF_FILE, ROUTE_CONF_PATH)
if route_conf_main.Existed():
    route_conf_main.MakeExec()

# python begins the file section
python = '/usr/bin/python'

# BOOLEANS
no_use_notifications = False

