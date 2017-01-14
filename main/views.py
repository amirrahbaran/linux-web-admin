import os
import json
from time import sleep

from main.file import File
from main.networking import Ethernet
from main.nspath import NETWORK_CONF_PATH


def send_request(method_value="POST", url_value="", fields_value=None, headers_value={}):
    import urllib3
    http = urllib3.PoolManager()
    try:
        rest_request = http.request(method=method_value, url=url_value, fields=fields_value, headers=headers_value)
        rest_response = json.loads(rest_request.data.decode('utf-8'))
        return rest_response
    except Exception as e:
        return json.loads(json.dumps({
            'Result': "ERROR",
            'Message': '%s (%s)' % (e.message, type(e)),
            'Status': "danger",
            'Record': None
        }))

def shutdown(TheInterface):
    TheInterfaceName = TheInterface.name
    IPv4AddressList = TheInterface.ipv4address.split(",")
    if len(IPv4AddressList) > 1:
        for IPv4AddressCounter in range(len(IPv4AddressList)):
            if (IPv4AddressCounter > 0):
                TheInterfaceName += (":" + (str(IPv4AddressCounter - 1)))
            ethernet_object = Ethernet(TheInterfaceName)
            ethernet_object.Down()
    else:
        ethernet_object = Ethernet(TheInterfaceName)
        ethernet_object.Down()


def removeNetworkConfigurationOf(TheInterface):
    TheInterfaceName = TheInterface.name
    IPv4AddressList = TheInterface.ipv4address.split(",")
    if len(IPv4AddressList) > 1:
        for IPv4AddressCounter in range(len(IPv4AddressList)):
            if ( IPv4AddressCounter > 0 ):
                TheInterfaceName += (":" + (str(IPv4AddressCounter - 1)))
            ethernet_filename = "ifcfg-" + TheInterfaceName
            ethernet_file_object = File(ethernet_filename, NETWORK_CONF_PATH)
            ethernet_file_object.Remove()
    else:
        ethernet_filename = "ifcfg-" + TheInterfaceName
        ethernet_file_object = File(ethernet_filename, NETWORK_CONF_PATH)
        ethernet_file_object.Remove()


def setNetworkConfigurationOf(TheInterface):
    if not TheInterface.status:
        return False
    TheInterfaceName = TheInterface.name
    if not TheInterface.dhcp:
        IPv4AddressList = TheInterface.ipv4address.split(",")
        IPv4AddressCounter = 0
        for eachIpv4Address in IPv4AddressList:
            isVirtual = False
            ConfigurationsText = ""
            if ( IPv4AddressCounter > 0 ):
                TheInterfaceName += (":" + (str(IPv4AddressCounter - 1)))
                isVirtual = True
            ipv4address_with_cidr = eachIpv4Address.split("/")

            if TheInterface.status:
                ConfigurationsText += "auto " + TheInterfaceName + "\n"

            ConfigurationsText += "iface " + TheInterfaceName + " inet "

            if TheInterface.dhcp:
                ConfigurationsText += "dhcp\n"
            else:
                ConfigurationsText += "static\n"
                ConfigurationsText += "\taddress " + ipv4address_with_cidr[0] + "\n"
                if len(ipv4address_with_cidr) > 1:
                    ConfigurationsText += "\tnetmask " + ipv4address_with_cidr[1] + "\n"
                else:
                    ConfigurationsText += "\tnetmask 32\n"
                if not isVirtual:
                    if TheInterface.gateway != "":
                        ConfigurationsText += "\tgateway " + TheInterface.gateway + "\n"

            if not isVirtual:
                ConfigurationsText += "\thwaddress " + TheInterface.mac + "\n"
                if (TheInterface.mtu != "1500"):
                    ConfigurationsText += "\tmtu " + TheInterface.mtu + "\n"

                if TheInterface.manual_dns:
                    nameservers = TheInterface.dnsserver.replace(",", " ")
                    ConfigurationsText += "\tdns-nameservers " + nameservers
                    ConfigurationsText += "\n"

            ethernet_filename = "ifcfg-" + TheInterfaceName
            ethernet_file_object = File(ethernet_filename, NETWORK_CONF_PATH)
            ethernet_file_object.Write(ConfigurationsText)
            IPv4AddressCounter += 1
            ethernet_object = Ethernet(TheInterfaceName)
            if TheInterface.status:
                ethernet_object.Down()
                sleep(1)
                ethernet_object.Up()
            else:
                ethernet_object.Down()


def removeRoutingConfigurationOf(TheRoute):
    ConfigurationFile = NETWORK_CONF_PATH + "ifcfg-" + TheRoute.name
    try:
        os.remove(ConfigurationFile)
    except Exception as e:
        return '%s (%s)' % (e.message, type(e))


def setRoutingConfigurationOf(TheRoute):
    data = {
        'Name': TheRoute.name,
        'Description': TheRoute.desc,
        'Status': TheRoute.status,
        'IPv4Address': TheRoute.ipv4address,
        'Gateway': TheRoute.gateway,
        'Link': TheRoute.link,
        'Interface': TheRoute.interface,
        'Metric': TheRoute.metric
    }

    url = 'http://localhost:9000/networking/routing/update'
    return send_request('POST', url, data)
