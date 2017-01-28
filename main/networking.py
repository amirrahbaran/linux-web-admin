import fcntl
import socket
import struct
import re
from main.process import Proc


class NetworkInterface(object):
    """ Control a network interface. """
    def __init__(self, TheEthernet=None, verbose=False, only_up=False):
        """ Initialise the object.

        Keyword arguments:
        TheEtheret -- the name of the interface
        verbose -- whether to print every command run

        """
        self.name = TheEthernet
        self.verbose = verbose
        self.only_up = only_up

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

    def ifUp(self):
        cmd = 'ifup ' + self.name
        if self.verbose:
            print cmd
        process_run = Proc(cmd)
        process_run.Run()

    def ifDown(self):
        cmd = 'ifdown ' + self.name
        if self.verbose:
            print cmd
        process_run = Proc(cmd)
        process_run.Run()

    def getHwAddress(self):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        info = fcntl.ioctl(s.fileno(), 0x8927, struct.pack('256s', self.name[:15]))
        return ':'.join(['%02x' % ord(char) for char in info[18:24]])

    def getEthtool(self):
        cmd = 'ethtool ' + self.name
        if self.verbose:
            print cmd
        process_run = Proc(cmd, True)
        return process_run.Run()

    def getLink(self):
        fat = self.getEthtool()
        fat = fat.split('\n')
        for line in fat:
            line = line.strip()
            if line[0:13] == "Link detected":
                try:
                    link = line[15:]
                except:
                    link = None
                return True if link == "yes" else False

    def List(self):
        """Returns a list of NetInterfaces for all eth*
           interfaces visible from ifconfig.
           Omit lo, vpn, ipv6 and other non-physical interfaces.
           If only_up is true, use ifconfig instead if ifconfig -a.
           If name is specified, return only the first matching that name.
        """
        if self.name:
            cmd = "ifconfig " + self.name
        elif self.only_up:
            cmd = 'ifconfig'
        else:
            cmd = '/sbin/ifconfig -a'
        if self.verbose:
            print cmd
        process_run = Proc(cmd, True)
        stdout_str = process_run.Run()
        stdout_list = stdout_str.split('\n')
        ifaces = []
        cur_iface = None
        for line in stdout_list:
            if len(line) == 0:
                continue
            words = line.split()
            if line[0] != ' ':
                if words[2] == 'encap:Ethernet' or \
                                words[1].startswith('flags') and not 'LOOPBACK' in words[1]:
                    if words[0].endswith(':'):
                        words[0] = words[0][0:-1]
                    cur_iface = NetworkInterface(words[0])
                    ifaces.append(cur_iface)

                    cur_iface.ip = ""
                    cur_iface.broadcast = ""
                    cur_iface.netmask = ""
                    cur_iface.mac = ""
                    cur_iface.mtu = ""
                    cur_iface.metric = ""
                    cur_iface.up = ""

                    match = re.search('HWaddr (..:..:..:..:..:..)', line)
                    if match:
                        cur_iface.mac = match.group(1)

                    if words[2].startswith('flags'):
                        cur_iface.up = ('UP' in words[2])

                else:
                    cur_iface = None
            else:
                if not cur_iface:
                    continue
                if words[0] == 'inet':
                    match = re.search('addr:(\d+\.\d+\.\d+\.\d+)', line)
                    if match:
                        cur_iface.ip = match.group(1)
                    match = re.search('Bcast:(\d+\.\d+\.\d+\.\d+)', line)
                    if match:
                        cur_iface.broadcast = match.group(1)
                    match = re.search('Mask:(\d+\.\d+\.\d+\.\d+)', line)
                    if match:
                        cur_iface.netmask = match.group(1)
                    match = re.search('inet (\d+\.\d+\.\d+\.\d+)', line)
                    if match:
                        cur_iface.ip = match.group(1)
                    match = re.search('netmask (\d+\.\d+\.\d+\.\d+)', line)
                    if match:
                        cur_iface.netmask = match.group(1)
                    match = re.search('ether (..:..:..:..:..:..)', line)
                    if match:
                        cur_iface.mac = match.group(1)
                elif words[0] == 'UP':
                    cur_iface.up = True
                    match = re.search('MTU:(\d+)', line)
                    if match:
                        cur_iface.mtu = match.group(1)
                    match = re.search('Metric:(\d+)', line)
                    if match:
                        cur_iface.metric = match.group(1)
        if self.name:
            if len(ifaces) <= 0 or ifaces[0].name != self.name:
                return None
            return ifaces[0]

        return ifaces


class NetworkRoute(object):
    """ Control a network routing table. """
    def __init__(self, TheRoute, verbose=False):
        """ Initialise the object.

        Keyword arguments:
        TheRoute -- the name of the route rule
        verbose -- whether to print every command run

        """
        self.TheRoute = TheRoute
        self.verbose = verbose

    def Add(self):
        if not self.TheRoute.status:
            return False
        Ipv4List = self.TheRoute.ipv4address.split(",")
        for eachIpv4Address in Ipv4List:
            cmd = "route add"
            cmd += " -net " + eachIpv4Address
            cmd += " gw " + self.TheRoute.gateway
            if self.TheRoute.interface != "":
                cmd += " dev " + self.TheRoute.interface
            if self.TheRoute.metric != 0:
                cmd += " metric " + str(self.TheRoute.metric)
            if self.verbose:
                print cmd
            process_run = Proc(cmd)
            process_run.Run()

    def Delete(self):
        if not self.TheRoute.status:
            return False
        Ipv4List = self.TheRoute.ipv4address.split(",")
        for eachIpv4Address in Ipv4List:
            cmd = "route del"
            cmd += " -net " + eachIpv4Address
            cmd += " gw " + self.TheRoute.gateway
            if self.TheRoute.interface != "":
                cmd += " dev " + self.TheRoute.interface
            if self.TheRoute.metric != 0:
                cmd += " metric " + str(self.TheRoute.metric)
            if self.verbose:
                print cmd
            process_run = Proc(cmd)
            process_run.Run()
