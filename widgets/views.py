import os, subprocess, re, shutil

class NetInterface :
    """A network interface, like eth1 or wlan0."""

    def __init__(self, name) :
        self.name = name
        self.ip = ''
        self.broadcast = ''
        self.netmask = ''
        self.essid = ''
        self.encryption = None
        self.up = False
        self.wireless = False

    def __repr__(self) :
        """Prettyprint a NetInterface instance"""
        s = 'NetInterface ' + self.name
        if self.wireless :
            if self.essid :
                if self.encryption :
                    s += ' (wireless, essid=%s, %s)' % \
                        (self.essid, self.encryption)
                else :
                    s += ' (wireless, essid=%s, open)' % self.essid
            else :
                s += ' (wireless)'
        if self.mac :
            s += ' mac=' + self.mac
        if self.up :
            s += ' UP'
        if self.ip :
            s += ' ip=' + self.ip
        if self.broadcast :
            s += ' broadcast=' + self.broadcast
        if self.netmask :
            s += ' netmask=' + self.netmask
        if self.mtu :
            s += ' mtu=' + self.mtu
        if self.metric :
            s += ' metric=' + self.metric

        return s

    def ifconfig_up(self) :
        """Mark the interface UP with ifconfig"""
        subprocess.call(["ifconfig", self.name, "up"])

    def ifconfig_down(self) :
        """Mark the interface DOWN with ifconfig"""
        subprocess.call(["ifconfig", self.name, "down"])


class Connection :
    """Make a connection. Subclass this with details of how the
       connection will actually be made.
    """
    def __init__(self, iface=None) :
        if iface :
            self.iface = iface
        else :
            self.iface = get_first_wireless_interface().name

        self.essid = "unknown"

class ManualConnection(Connection) :
    """Make a connection by calling explicit programs like ifconfig,
       iwconfig, wpasupplicant, etc. In theory should work on any
       Linux machine, but some distros (especially Ubuntu derivatives)
       may not work well and may need their own connection type.
    """
    def __init__(self, iface=None):
        Connection.__init__(self, iface)
  
    def connect(self, essid):
        """Connect to a particular essid doing all the steps manually.
           Pass essid=None to de-associate the interface from any essid.
        """
        self.ifdown_all()
  
        iface.ifconfig_up()
  
        iwargs = ["iwconfig", iface.name ]
        if essid :
            iwargs.append("essid")
            iwargs.append(essid)
        #iwargs.append("mode")
        #iwargs.append("managed")
  
        iwargs.append("key")
        iwargs.append("off")
        iwargs.append("enc")
        iwargs.append("off")
  
        subprocess.call(iwargs)
  
        try :
            # Ubuntu uses different args for DHCP clients than anyone else
            if os.access("/sbin/dhcpcd", os.R_OK):
                subprocess.check_call(["dhcpcd", "-G", "-C", "resolv.conf",
                                 iface.name])
            else:
                subprocess.check_call(["dhclient", iface.name])
        except subprocess.CalledProcessError, e :
            print "DHCP failed, error", e.returncode
            iface.ifconfig_down()
  
            # Mark the interface up (and call ifup too, if applicable)
            subprocess.call(["ifconfig", iface.name, "up"])
  
        self.essid = essid
  
    def reset(self):
        print "Sorry, manual reset isn't defined yet! Please implement me!"
        self.essid = None

class UbuntuConnection(Connection) :
    """Make a connection on a Ubuntu system, using /etc/network/interfaces
       and service network restart (along with other helpers).
    """
    def __init__(self, iface=None) :
        Connection.__init__(self, iface)
        self.interfaces = "/etc/network/interfaces"
        self.interfaces_bak = "/etc/network/interfaces.bak"

        print "Initialized Ubuntu connection, iface = ", self.iface

        # Save off the old /etc/network/interfaces,
        # since we'll be replacing it:
        try :
            shutil.copy2(self.interfaces, self.interfaces_bak)
        except :
            print "Couldn't back up interfaces file"

    # Ubuntu doesn't work well with manual networking tools --
    # DHCP, in particular, works a lot less reliably on Ubuntu than
    # on other distros unless it's called automatically from the
    # networking service.
    def connect(self, essid) :
        """Connect to a particular essid using /etc/network/interfaces.
           Pass essid=None to de-associate the interface from any essid.
        """

        # If we're connected when we start, try to zero out networking first.
        if self.essid :
            subprocess.call(["ifconfig", self.iface, "down"])
            fp = open(self.interfaces, "w")
            print >>fp, """auto lo
iface lo inet loopback
"""
            fp.close()
            self.essid = None
            subprocess.call(["service", "networking", "restart"])

        # Okay, now it's reset, so specify the new network:
        subprocess.call(["ifconfig", self.iface, "down"])
        subprocess.call(["ifdown", self.iface])
        fp = open(self.interfaces, "w")
        print >>fp, """auto lo
iface lo inet loopback

auto %s
iface %s inet dhcp
wireless-essid %s
""" % (self.iface, self.iface, essid)
        fp.close()

        # Mark the interface up (and call ifup too, if applicable).
        # The difference among all these isn't documented, and in theory
        # you should be able to call just ifup, but empirically this is
        # the most reliable sequence:
        subprocess.call(["ifconfig", self.iface, "up"])
        subprocess.call(["ifup", self.iface])
        subprocess.call(["service", "networking", "restart"])

        self.essid = essid

    def reset(self ):
        """Reset everything back to working the way it was before you started"""
        subprocess.call(["service", "networking", "stop"])
        shutil.copy2(self.interfaces_bak, self.interfaces)
        subprocess.call(["ifconfig", self.iface, "up"])
        subprocess.call(["ifup", self.iface])
        subprocess.call(["service", "networking", "start"])

        self.essid = "unknown"

class AccessPoint :
    """ One Cell or wireless access point from iwlist output"""

    def __init__(self) :
        self.clear()

    def clear(self) :
        """Clear all parameters"""
        self.address = ""
        self.essid = ""
        self.encryption = ""
        self.quality = ""
        self.interface = ""
        self.mode = ""

class Route :
    """Network routing table entry: one line from route -n"""

    # Route(line)
    # Route(dest, gateway, iface, mask=None) :
    def __init__(self, *args) :
        if len(args) == 1 :
            self.init_from_line(args[0])
            return

        (self.dest, self.gateway, self.iface) = args
        if len(args) > 3 :
            self.mask = args[3]

    def init_from_line(self, line) :
        """init from a line from route -n, such as:
192.168.1.0     *               255.255.255.0   U         0 0          0 eth0
default         192.168.1.1     0.0.0.0         UG        0 0          0 wlan0
        """
        # Another place to get this is /proc/net/route.

        words = line.split()
        if len(words) < 8 :
            self.dest = None
            return
        self.dest = words[0]
        if self.dest == 'Destination' :
            self.dest = None
            return
        self.gateway = words[1]
        self.mask = words[2]
        self.iface = words[7]
        self.metric = words[4]

    def __repr__(self) :
        """Return a string representing the route"""
        return "dest=%-16s gw=%-16s mask=%-16s iface=%-16s metric=%s" % (self.dest,
                                                            self.gateway,
                                                            self.mask,
                                                            self.iface,
                                                            self.metric)

    def call_route(self, cmd) :
        """Backend routine to call the system route command.
           cmd is either "add" or "delete".
           Users should normally call add() or delete() instead."""
        args = [ "route", cmd ]

        # Syntax seems to be different depending whether dest is "default"
        # or not. The man page is clear as mud and explains nothing.
        if self.dest == 'default' or self.dest == '0.0.0.0' :
            # route add default gw 192.168.1.1
            # route del default gw 192.168.160.1
            # Must use "default" rather than "0.0.0.0" --
            # the numeric version results in "SIOCDELRT: No such process"
            args.append("default")
            if self.gateway :
                args.append("gw")
                args.append(self.gateway)
        else :
            # route add -net 192.168.1.0 netmask 255.255.255.0 dev wlan0
            args.append('-net')
            args.append(self.dest)
            if self.gateway :
                args.append("gw")
                args.append(self.gateway)
            if self.mask :
                args.append("mask")
                args.append(self.mask)
        args.append("dev")
        args.append(self.iface)

        print "Calling:", args
        subprocess.call(args)

    def add(self) :
        """Add this route to the routing tables."""
        self.call_route("add")

    def delete(self) :
        """Remove this route from the routing tables."""
        # route del -net 192.168.1.0 netmask 255.255.255.0 dev wlan0
        self.call_route("del")

    @staticmethod
    def read_route_table() :
        """Read the system routing table, returning a list of Routes."""
        proc = subprocess.Popen('route -n', shell=True, stdout=subprocess.PIPE)
        stdout_str = proc.communicate()[0]
        stdout_list = stdout_str.split('\n')

        rtable = []
        for line in stdout_list :
            r = Route(line)
            if r.dest :
                rtable.append(r)

        return rtable

def get_interfaces(only_up=False, name=None) :
    """Returns a list of NetInterfaces for all eth*, wlan* or mlan*
       interfaces visible from ifconfig.
       Omit lo, vpn, ipv6 and other non-physical interfaces.
       If only_up is true, use ifconfig instead if ifconfig -a.
       If name is specified, return only the first matching that name.
    """
    if name :
        ifcfg = "ifconfig " + name
    elif only_up :
        ifcfg = 'ifconfig'
    else :
        ifcfg = '/sbin/ifconfig -a'
    proc = subprocess.Popen(ifcfg, shell=True, stdout=subprocess.PIPE)
    stdout_str = proc.communicate()[0]
    stdout_list = stdout_str.split('\n')
    ifaces = []
    cur_iface = None
    for line in stdout_list :
        if len(line) == 0 :
            continue
        words = line.split()
        if line[0] != ' ' :
            # It's a new interface. Should have a line like:
            # eth0      Link encap:Ethernet  HWaddr 00:01:4A:98:F1:51
            # or else a line line:
            # flags=4098<BROADCAST,MULTICAST>
            # with no LOOPBACK flag.
            # We only want the encap:Ethernet lines, not others like
            # loopback, vpn, ipv6 etc.
            if words[2] == 'encap:Ethernet' or \
                    words[1].startswith('flags') and not 'LOOPBACK' in words[1]:
                if words[0].endswith(':') :
                    words[0] = words[0][0:-1]
                cur_iface = NetInterface(words[0])
                ifaces.append(cur_iface)
                
                cur_iface.mac = ""
                match = re.search('HWaddr (..:..:..:..:..:..)', line)
                if match :
                    cur_iface.mac = match.group(1)

                if words[2].startswith('flags') :  # new format
                    cur_iface.up = ('UP' in words[2])
                        
            else :
                cur_iface = None
        else :
            if not cur_iface :
                continue
            if words[0] == 'inet' :
                # Old format:
                # inet addr:192.168.1.6  Bcast:192.168.1.255  Mask:255.255.255.0
                match = re.search('addr:(\d+\.\d+\.\d+\.\d+)', line)
                if match :
                    cur_iface.ip = match.group(1)
                match = re.search('Bcast:(\d+\.\d+\.\d+\.\d+)', line)
                if match :
                    cur_iface.broadcast = match.group(1)
                match = re.search('Mask:(\d+\.\d+\.\d+\.\d+)', line)
                if match :
                    cur_iface.netmask = match.group(1)
                # New format:
                # inet 127.0.0.1  netmask 255.0.0.0
                match = re.search('inet (\d+\.\d+\.\d+\.\d+)', line)
                if match :
                    cur_iface.ip = match.group(1)
                match = re.search('netmask (\d+\.\d+\.\d+\.\d+)', line)
                if match :
                    cur_iface.netmask = match.group(1)
                match = re.search('ether (..:..:..:..:..:..)', line)
                if match :
                    cur_iface.mac = match.group(1)
            elif words[0] == 'UP' :
                cur_iface.up = True
                match = re.search('MTU:(\d+)', line)
                if match :
                    cur_iface.mtu = match.group(1)
                match = re.search('Metric:(\d+)', line)
                if match :
                    cur_iface.metric = match.group(1)

    # Now we have the list of all interfaces. Find out which are wireless:
    proc = subprocess.Popen('iwconfig', shell=False,
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout_str = proc.communicate()[0]
    stdout_list = stdout_str.split('\n')
    cur_iface = None
    for line in stdout_list :
        if len(line) == 0 :
            continue
        if line[0] != ' ' :
            words = line.split()
            #print "Wireless interface", words[0]
            for iface in ifaces :
                #print "Checking", words[0], "against", iface.name
                if iface.name == words[0] :
                    #print "It's in the list"
                    cur_iface = iface
                    cur_iface.wireless = True
                    match = re.search('ESSID:"(.*)"', line)
                    if match :
                        cur_iface.essid = match.group(1)
                        # print "And it has essid", iface.essid

    # If name was specified, return only that single interface:
    if name:
        if len(ifaces) <= 0 or ifaces[0].name != name:
            return None
        return ifaces[0]

    return ifaces

def get_wireless_interfaces() :
    """Returns a list of wireless interfaces available.
    """
    wifaces = []
    for iface in get_interfaces() :
        if iface.wireless :
            wifaces.append(iface)
    return wifaces

def get_first_wireless_interface():
    """Returns the first available wireless interface
    """
    for iface in get_interfaces() :
        if iface.wireless :
            return iface
    return None

def get_accesspoints() :
    """Return a list of visible wireless accesspoints."""

    # We can only get accesspoints if a wifi interface is up.
    wiface = None
    ifaces = get_interfaces()
    for iface in ifaces :
        if iface.wireless and iface.up :
            wiface = iface
            break
        if not wiface and iface.wireless :
            wiface = iface
    if not wiface :    # No wireless interface on this system
        return None
    if not wiface.up :
        wiface.ifconfig_up()
    else :
        wiface = None     # nothing to take down later

    proc = subprocess.Popen('iwlist scan 2>/dev/null',
                            shell=True, stdout=subprocess.PIPE)
    #proc = subprocess.Popen('cat /home/akkana/iwlist.out 2>/dev/null',
    #                        shell=True, stdout=subprocess.PIPE, )
    stdout_str = proc.communicate()[0]
    stdout_list = stdout_str.split('\n')

    iface = None
    ap = None
    aplist=[]

    for line in stdout_list :
        if len(line) == 0 :
            continue
        if not line[0].isspace() :
            sp = line.find(' ')
            if sp > 0 :
                iface = line[:sp]
            else :
                iface = line
            continue

        line=line.strip()

        match = re.search('Cell ', line)
        if match :
            ap = AccessPoint()
            aplist.append(ap)
            if iface :
                ap.interface = iface

        match = re.search('ESSID:"(.+)"', line)
        if match :
            if match.group(1) == "<hidden>":
                ap.essid = ''
            # I have no idea what these \x00\x00\x00\x00\x00 essids are,
            # but they're quite common, and annoying to see in a UI:
            elif match.group(1) == "\\x00\\x00\\x00\\x00\\x00":
                ap.essid = "[null]"
            else :
                ap.essid = match.group(1)

        match = re.search('Address: (\S+)', line)
        if match:
            ap.address = match.group(1)

        match = re.search('Encryption key:([onf]+)', line)
        if match:
            if match.group(1) == "off" :
                ap.encryption = "open"
            else :
                ap.encryption = "WEP"   # change later if WPA

        # match = re.search('Protocol:IEEE(.+)', line)
        # if match:
        #     ap.protocol = match.group(1)

        match = re.search('WPA', line)
        if match:
            ap.encryption = "WPA"

        match = re.search('Mode:(.+)', line)
        if match :
            ap.mode = match.group(1)

        match = re.search('Quality=([^ ]+) ', line)
        if match :
            ap.quality = match.group(1)

    # If we marked an interface up just for this, mark it down again:
    if wiface :
        wiface.ifconfig_down()

    return aplist

def ifdown_all() :
    """Take all current interfaces down.
    """

    up_ifaces = get_interfaces(True)

    # Kill DHCP and wpa_supplicant.
    # In theory apparently it's better to stop wpa_supplicant with
    #os.system('wpa_cli -i %s terminate' % up_iface)
    # except for the minor problem that it fails because
    # it can't communicate with wpa_supplicant.
    print "Killing dhcp processes"
    kill_by_name(['dhcpcd', 'dhclient'])

    # Kill wpa_supplicant in a separate step,
    # to make it easier to tell whether it was actually running:
    print "Killing wpa processes"
    killed = kill_by_name(['wpa_supplicant'])

    # If wpa_supplicant was one of the killed processes,
    # then our wireless interface is all messed up now,
    # and we'll never be able to connect to an open or WEP
    # network with that interface again.
    # The only way to fix it seems to be to unload and reload
    # the wireless card's module. If it's not a module ... oops.
    # First find the module:
    if len(killed) >= 1 and len(up_ifaces) > 0 :
        # Get the first wireless one. Hope there's only one.
        iface = None
        for i in up_ifaces :
            if i.wireless :
                iface = i
                break
        if iface :
            fp = open("/sys/class/net/" + iface.name + "/device/uevent")
            # Another way to get this: ethtool -i iface.name
            line = fp.readline()
            fp.close()
            if line[0:7] == "DRIVER=" :
                module = line[7:].strip()
                print "Unloading", module, "module"
                subprocess.call(["modprobe", "-r", module])
                print "Re-loading", module, "module"
                subprocess.call(["modprobe", module])
        else :
            print "Confusion! Can't find the old wireless interface to reload"

    elif len(killed) == 0 :
        print "Didn't kill wpa, no no need to reload modules"
    else :
        print "Didn't have any UP interfaces"

    # It's apparently better to kill wpa_supplicant while the
    # interface is still up (which takes it down).
    # So now, finally, we can take everything down:
    for iface in up_ifaces :
        print "Marking", iface.name, "down"
        iface.ifconfig_down()

def kill_by_name(namelist) :
    """Kills all running processes that start with any of the
        strings in the given name list.
    """
    PROCDIR = '/proc'
    killed = []
    for proc in os.listdir(PROCDIR) :
        if not proc[0].isdigit() :
            continue
        # Race condition: processes can come and go, so we may not be
        # able to open something just because it was there when we
        # did the listdir.
        try :
            procfp = open(os.path.join(PROCDIR, proc, 'cmdline'))
            for line in procfp :
                cmd = os.path.basename(line.split('\0')[0])
                for name in namelist :
                    if name == cmd[0:len(name)] :
                        killed.append(name)
                        os.kill(int(proc), 9)
                break    # There's only one line anyway
            procfp.close()
        except :
            pass
    return killed

# main
if __name__ == "__main__" :
    print "All interfaces:"
    for iface in get_interfaces() :
        print iface
    print "Wireless interfaces:"
    for iface in get_wireless_interfaces() :
        print iface

