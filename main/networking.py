from main.process import Proc


class Ethernet(object):
    """ Control a network ethernet interface. """
    def __init__(self, TheEtheret, verbose=False):
        """ Initialise the object.

        Keyword arguments:
        TheEtheret -- the name of the interface
        verbose -- whether to print every command run

        """
        self.name = TheEtheret
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

