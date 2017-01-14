from main.networking import Ethernet

def getEthernetHwAddress(interface):
    ethernet_object = Ethernet(interface)
    return ethernet_object.List().mac

def getEthernetLink(interface):
    ethernet_object = Ethernet(interface)
    return ethernet_object.getLink()

def getEthernetRealInterfaces():
    EthernetObject = Ethernet()
    result = []
    for iface in EthernetObject.List():
        result.append(iface.name)
    return result