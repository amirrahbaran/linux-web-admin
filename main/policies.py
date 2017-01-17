class Policy(object):
    """ Control a firewall rules. """
    def __init__(self, ThePolicy=None, verbose=False):
        """ Initialise the object.

        Keyword arguments:
        ThePolicy -- the name of the firewall rule
        verbose -- whether to print every command run

        """
        self.policy = ThePolicy
        self.verbose = verbose


    def setService(self, service):
        proto_ports = service.split("-")
        self.proto = proto_ports[0]
        self.ports = proto_ports[1].split(",")

    def Add(self):
        if not self.policy.status:
            return False

        # TheRule =
        cmd = "iptables -A"
        if self.policy.source_service != "":
            self.setService(self.policy.source_service)
            cmd += " -p " + self.proto
            cmd += " --dport " + self.ports

        cmd += " -j " + self.policy.action
        if self.verbose:
            print cmd
        process_run = Proc(cmd)
        process_run.Run()


    def Delete(self):
        pass
