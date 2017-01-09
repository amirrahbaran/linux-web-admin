from main.process import Proc


class Ethernet(object):
    """ Control a network ethernet interface. """
    def __init__(self, TheEtheret, verbose=False):
        """ Initialise the object.

        Keyword arguments:
        TheEtheret -- the name of the interface
        verbose -- whether to print every command run

        """
        self.name = TheEtheret.name
        self.desc = TheEtheret.desc
        self.status = TheEtheret.status
        self.link = TheEtheret.link
        self.mac = TheEtheret.mac
        self.dhcp = TheEtheret.dhcp
        self.ipv4address = TheEtheret.ipv4address
        self.gateway = TheEtheret.gateway
        self.manual_dns = TheEtheret.manual_dns
        self.dnsserver = TheEtheret.dnsserver
        self.mtu = TheEtheret.mtu
        self.manual_mss = TheEtheret.manual_mss
        self.mss = TheEtheret.mss
        self.verbose = verbose

    def Up(self):
        cmd = 'ifconfig ' + self.name + ' up'
        if self.verbose:
            print cmd
        process_run = Proc(cmd)
        return process_run.Run()


    def Down(self):
        cmd = 'ifconfig ' + self.name + ' down'
        if self.verbose:
            print cmd
        process_run = Proc(cmd)
        return process_run.Run()

    def Save(self):
        ConfigurationsText = ""
        ipv4address_with_cidr = self.ipv4address.split("/")

        if self.status:
            ConfigurationsText += "auto " + self.name + "\n"

        ConfigurationsText += "iface " + self.name + " inet "

        if self.dhcp:
            ConfigurationsText += "dhcp\n"
        else:
            ConfigurationsText += "static\n"
            ConfigurationsText += "\taddress " + ipv4address_with_cidr[0] + "\n"
            ConfigurationsText += "\tnetmask " + ipv4address_with_cidr[1] + "\n"
            if self.gateway != "":
                ConfigurationsText += "\tgateway " + self.gateway + "\n"

        if self.manual_dns:
            nameservers = self.dnsserver.replace(",", " ")
            ConfigurationsText += "\tdns-nameservers " + nameservers
            ConfigurationsText += "\n"

        return ConfigurationsText

class Routing(object):
    """ Control a network static routing table. """
    def __init__(self, TheRoute, verbose=False):
        """ Initialise the object.

        Keyword arguments:
        TheRoute -- the name of the route rule
        verbose -- whether to print every command run

        """
        self.TheRoute = TheRoute
        self.verbose = verbose


    def Save(TheRoute):
        ConfigurationFile = NetworkConfigurationPath + "ifcfg-" + TheRoute.name
        ConfigurationsText = ""

        if (TheRoute.status):
            ConfigurationsText += "auto " + TheRoute.name + "\n"

        ConfigurationsText += "TheRoute " + TheRoute.name + " inet "

        if (TheRoute.dhcp):
            ConfigurationsText += "dhcp\n"
        else:
            ConfigurationsText += "static\n"
            ConfigurationsText += "\taddress " + TheRoute.ipv4address + "\n"
            ConfigurationsText += "\tnetmask " + TheRoute.netmask + "\n"
            if (TheRoute.gateway != "0.0.0.0"):
                ConfigurationsText += "\tgateway " + TheRoute.gateway + "\n"

        if (TheRoute.primary_dns or TheRoute.secondary_dns):
            ConfigurationsText += "\tdns-nameservers " + TheRoute.primary_dns + " " + TheRoute.secondary_dns + "\n"

        writeTextToFile(ConfigurationsText, ConfigurationFile)

