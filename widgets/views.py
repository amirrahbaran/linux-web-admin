from main.networking import NetworkInterface

def getEthernetHwAddress(interface):
    ethernet_object = NetworkInterface(interface)
    return ethernet_object.List().mac

def getEthernetLink(interface):
    ethernet_object = NetworkInterface(interface)
    return ethernet_object.getLink()

def getEthernetRealInterfaces():
    EthernetObject = NetworkInterface()
    result = []
    for iface in EthernetObject.List():
        result.append(iface.name)
    return result