import re
import os
import json

from main.file import File
from main.networking import NetworkInterface, NetworkRoute
from main.nspath import NETWORK_CONF_PATH, ROUTE_CONF_PATH, ROUTE_CONF_FILE, IPSEC_KEYDB
from main.vpn import IPSecVPN


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


def startup(TheInterface):
    if not TheInterface.status:
        return False
    TheInterfaceMainName = TheInterface.name
    ethernet_filename = "ifcfg-" + TheInterfaceMainName
    ethernet_file_object = File(ethernet_filename, NETWORK_CONF_PATH)
    if not ethernet_file_object.Existed():
        return False
    for line in ethernet_file_object.Read().split("\n"):
        match = re.search('^iface\s+(\S+)\s+inet', line)
        if match:
            TheInterfaceName = match.group(1)
            ethernet_object = NetworkInterface(TheInterfaceName)
            ethernet_object.Up()
            ethernet_object.ifUp()
    return True


def shutdown(TheInterface):
    TheInterfaceMainName = TheInterface.name
    ethernet_filename = "ifcfg-" + TheInterfaceMainName
    ethernet_file_object = File(ethernet_filename, NETWORK_CONF_PATH)
    if not ethernet_file_object.Existed():
        return False
    for line in ethernet_file_object.Read().split("\n"):
        match = re.search('^iface\s+(\S+)\s+inet', line)
        if match:
            TheInterfaceName = match.group(1)
            ethernet_object = NetworkInterface(TheInterfaceName)
            ethernet_object.ifDown()
            ethernet_object.Down()
    return True


def removeNetworkConfigurationOf(TheInterface):
    TheInterfaceMainName = TheInterface.name
    ethernet_filename = "ifcfg-" + TheInterfaceMainName
    ethernet_file_object = File(ethernet_filename, NETWORK_CONF_PATH)
    ethernet_file_object.Remove()


def setNetworkConfigurationOf(TheInterface):
    if not TheInterface.status:
        return False
    TheInterfaceMainName = TheInterface.name
    IPv4AddressList = TheInterface.ipv4address.split(",")
    IPv4AddressCounter = 0
    ConfigurationsText = ""
    for eachIpv4Address in IPv4AddressList:
        isVirtual = False
        if IPv4AddressCounter > 0 :
            TheInterfaceName = TheInterfaceMainName + (":" + (str(IPv4AddressCounter - 1)))
            isVirtual = True
        else:
            TheInterfaceName = TheInterfaceMainName
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
                ConfigurationsText += "\tnetmask 24\n"
            if not isVirtual:
                if TheInterface.gateway != "":
                    ConfigurationsText += "\tgateway " + TheInterface.gateway + "\n"

        if not isVirtual:
            if TheInterface.mtu != "1500":
                ConfigurationsText += "\tmtu " + TheInterface.mtu + "\n"

            if TheInterface.manual_dns:
                nameservers = TheInterface.dnsserver.replace(",", " ")
                ConfigurationsText += "\tdns-nameservers " + nameservers
                ConfigurationsText += "\n"
        ConfigurationsText += "\n"
        IPv4AddressCounter += 1
    ethernet_filename = "ifcfg-" + TheInterfaceMainName
    ethernet_file_object = File(ethernet_filename, NETWORK_CONF_PATH)
    return ethernet_file_object.Write(ConfigurationsText)


def removeRoutingConfigurationOf(TheRoute):
    ethernet_object = NetworkRoute(TheRoute)
    ethernet_object.Delete()


def setRoutingConfigurationOf(TheRoute):
    ethernet_object = NetworkRoute(TheRoute)
    ethernet_object.Add()


def setPermanentRouteTable(TheRoutes):
    route_conf_main = File(ROUTE_CONF_FILE, ROUTE_CONF_PATH)
    route_conf_main.Remove()

    if len(TheRoutes) < 1:
        return False
    ConfigurationsText = "#!/bin/sh\n"
    for eachRoute in TheRoutes:
        if eachRoute.status:
            Ipv4List = eachRoute.ipv4address.split(",")
            for eachIpv4Address in Ipv4List:
                ConfigurationsText += "route add "
                ConfigurationsText += " -net " + eachIpv4Address
                ConfigurationsText += " gw " + eachRoute.gateway
                if eachRoute.interface != "":
                    ConfigurationsText += " dev " + eachRoute.interface
                if eachRoute.metric != 0:
                    ConfigurationsText += " metric " + str(eachRoute.metric)
                ConfigurationsText += " || true \n"

    route_conf_main.Write(ConfigurationsText)
    route_conf_main.MakeExec()


def removeVpnTunnelConfigurationOf(TheTunnel):
    if TheTunnel.status:
        tunnel_object = IPSecVPN(TheTunnel.name)
        tunnel_object.Down()
    tunnel_conf_object = File(TheTunnel.name+".conf", IPSEC_KEYDB)
    tunnel_conf_object.Delete()


def setVpnTunnelConfigurationOf(TheTunnel):
    tunnel_conf_text = "conn " + TheTunnel.name + "\n"
    tunnel_conf_text += "\tleft" + TheTunnel.local_endpoint + "\n"
    tunnel_conf_text += "\tleftsubnet" + TheTunnel.local_network + "\n"
    tunnel_conf_text += "\tleftid" + TheTunnel.local_id + "\n"
    tunnel_conf_text += "\tright" + TheTunnel.remote_endpoint + "\n"
    tunnel_conf_text += "\trightsubnet" + TheTunnel.remote_network + "\n"
    tunnel_conf_text += "\trightid" + TheTunnel.peer_id + "\n"

    tunnel_conf_object = File(TheTunnel.name+".conf", IPSEC_KEYDB)
    tunnel_conf_object.Write(tunnel_conf_text)

    tunnel_object = IPSecVPN(TheTunnel.name)
    if TheTunnel.status:
        tunnel_object.Down()
    tunnel_object.Up()
