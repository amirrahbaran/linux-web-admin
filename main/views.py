import re
import json

from main.file import File
from main.networking import NetworkInterface, NetworkRoute
from main.nspath import NETWORK_CONF_PATH, ROUTE_CONF_PATH, ROUTE_CONF_FILE
    # , IPSEC_ETC_CONF, IPSEC_PREFIX, IPSEC_SECRETS
# from main.vpn import IPSecVPN
# from vpn.models import Tunnel, Profile


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
        if IPv4AddressCounter > 0:
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


# def reconstructIpsecConfurations():
#     ipsec_conf_main = File(IPSEC_ETC_CONF, IPSEC_PREFIX)
#     ipsec_secrets_main = File(IPSEC_SECRETS, IPSEC_PREFIX)
#     IPSEC_MainConfigurationsText = """config setup
#     uniqueids="no"
#     strictcrlpolicy="no"
#
# conn %default
#     mobike="no"
#     keyingtries="%forever"
#     leftsendcert="always"
#     #forceencaps="yes"\n\n
#     """
#     IPSEC_MainSecretsText = ""
#     tunnels = Tunnel.objects.all()
#     for eachTunnel in tunnels:
#         requested_profile = Profile.objects.get(name=eachTunnel.profile)
#         IPSEC_MainConfigurationsText += setVpnTunnelConfigurationOf(eachTunnel, requested_profile)
#         IPSEC_MainSecretsText += setVpnTunnelSecretOf(eachTunnel)
#     ipsec_conf_main.Write(IPSEC_MainConfigurationsText)
#     ipsec_secrets_main.Write(IPSEC_MainSecretsText)


# def setVpnTunnelConfigurationOf(TheTunnel, TheProfile):
#     auth_by = "psk"
#     if TheTunnel.auth_method == "RSA":
#         auth_by = "rsasig"
#     dhg_trans = {
#         '1': 'modp768',
#         '2': 'modp1024',
#         '5': 'modp1536',
#         '14': 'modp2048',
#         '15': 'modp3072',
#         '16': 'modp4096'
#     }
#     ike = TheProfile.phase1_algo + "-" + TheProfile.phase1_auth + "-" + dhg_trans[TheProfile.phase1_dhg] + "!"
#     esp = TheProfile.phase2_algo + "-" + TheProfile.phase2_auth + "-" + dhg_trans[TheProfile.phase2_dhg] + "!"
#     tunnel_conf_text = "conn " + TheTunnel.name + "\n"
#     tunnel_conf_text += "\tauthby=\"" + auth_by + "\"\n"
#     if TheTunnel.status:
#         tunnel_conf_text += "\tauto=\"start\"\n"
#     tunnel_conf_text += "\tauto=\"add\"\n"
#     tunnel_conf_text += "\ttype=\"tunnel\"\n"
#     tunnel_conf_text += "\tcompress=\"no\"\n"
#     tunnel_conf_text += "\trekeymargin=\"540s\"\n"
#     tunnel_conf_text += "\tleft=\"" + TheTunnel.local_endpoint + "\"\n"
#     tunnel_conf_text += "\tleftid=\"" + TheTunnel.local_id + "\"\n"
#     tunnel_conf_text += "\tleftsubnet=\"" + TheTunnel.local_network + "\"\n"
#     tunnel_conf_text += "\tright=\"" + TheTunnel.remote_endpoint + "\"\n"
#     tunnel_conf_text += "\trightid=\"" + TheTunnel.peer_id + "\"\n"
#     tunnel_conf_text += "\trightsubnet=\"" + TheTunnel.remote_network + "\"\n"
#     tunnel_conf_text += "\tike=\"" + ike + "\"\n"
#     tunnel_conf_text += "\tesp=\"" + esp + "\"\n"
#     tunnel_conf_text += "\tikelifetime=\"" + TheProfile.phase1_lifetime + "\"\n"
#     tunnel_conf_text += "\tkeylife=\"" + TheProfile.phase2_lifetime + "\"\n"
#     if TheTunnel.auth_method == "RSA":
#         tunnel_conf_text += "\tleftrsasigkey=" + Local_pub_key_path + "\n"
#         tunnel_conf_text += "\trightrsasigkey=" + Peer_pub_key + "\n"
#     tunnel_conf_text += "\tkeyexchange=\"ikev2\"\n"
#     if TheTunnel.dpd:
#         dpd_timeout = "900"
#         tunnel_conf_text += "\tdpdaction = \"restart\"\n"
#         tunnel_conf_text += "\tdpddelay = \"30s\"\n"
#         tunnel_conf_text += "\tdpdtimeout = \"" + dpd_timeout + "s\"\n";
#
#     return tunnel_conf_text
#
#
# def setVpnTunnelSecretOf(TheTunnel):
#     tunnel_secrets_text = TheTunnel.local_id + " " + TheTunnel.peer_id + " PSK \"" + TheTunnel.pre_key + "\"\n"
#     return tunnel_secrets_text


# def applyVpnTunnelOf(TheTunnel):
#     tunnel_object = IPSecVPN(TheTunnel.name)
#     tunnel_object.Down()
#     if TheTunnel.status:
#         tunnel_object.Up()
#
#
# def downVpnTunnelOf(TheTunnel):
#     tunnel_object = IPSecVPN(TheTunnel.name)
#     tunnel_object.Down()
