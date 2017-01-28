from main.process import Proc


class IPSecVPN(object):
    """ Control a IPSec VPN tunnel. """
    def __init__(self, TheTunnel=None, verbose=False):
        """ Initialise the object.

        Keyword arguments:
        TheTunnel -- the name of the tunnel
        verbose -- whether to print every command run

        """
        self.name = TheTunnel
        self.verbose = verbose

    def Up(self):
        cmd = 'ipsec ' + self.name + ' up'
        if self.verbose:
            print cmd
        process_run = Proc(cmd)
        return process_run.Run()

    def Down(self):
        cmd = 'ipsec ' + self.name + ' down'
        if self.verbose:
            print cmd
        process_run = Proc(cmd)
        return process_run.Run()
