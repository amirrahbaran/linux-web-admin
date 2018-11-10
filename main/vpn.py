from main.file import File
from main.nspath import IPSEC_ETC_CONF, IPSEC_PREFIX, IPSEC_SECRETS
from main.process import Proc
# from vpn.models import Tunnel, Profile


class IPSecVPN(object):
    """ Control a IPSec VPN tunnel. """
    def __init__(self, tunnel_name=None, verbose=False):
        """ Initialise the object.

        Keyword arguments:
        tunnel_name -- the name of the tunnel
        verbose -- whether to print every command run

        """
        self.name = tunnel_name
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

    def setConfigurationOf(self, TheTunnel, TheProfile):
        auth_by = "psk"
        if TheTunnel.auth_method == "RSA":
            auth_by = "rsasig"
        dhg_trans = {
            '1': 'modp768',
            '2': 'modp1024',
            '5': 'modp1536',
            '14': 'modp2048',
            '15': 'modp3072',
            '16': 'modp4096'
        }
        ike = TheProfile.phase1_algo + "-" + TheProfile.phase1_auth + "-" + dhg_trans[TheProfile.phase1_dhg] + "!"
        esp = TheProfile.phase2_algo + "-" + TheProfile.phase2_auth + "-" + dhg_trans[TheProfile.phase2_dhg] + "!"
        tunnel_conf_text = "conn " + TheTunnel.name + "\n"
        tunnel_conf_text += "\tauthby=\"" + auth_by + "\"\n"
        if TheTunnel.status:
            tunnel_conf_text += "\tauto=\"start\"\n"
        tunnel_conf_text += "\tauto=\"add\"\n"
        tunnel_conf_text += "\ttype=\"tunnel\"\n"
        tunnel_conf_text += "\tcompress=\"no\"\n"
        tunnel_conf_text += "\trekeymargin=\"540s\"\n"
        tunnel_conf_text += "\tleft=\"" + TheTunnel.local_endpoint + "\"\n"
        tunnel_conf_text += "\tleftid=\"" + TheTunnel.local_id + "\"\n"
        tunnel_conf_text += "\tleftsubnet=\"" + TheTunnel.local_network + "\"\n"
        tunnel_conf_text += "\tright=\"" + TheTunnel.remote_endpoint + "\"\n"
        tunnel_conf_text += "\trightid=\"" + TheTunnel.peer_id + "\"\n"
        tunnel_conf_text += "\trightsubnet=\"" + TheTunnel.remote_network + "\"\n"
        tunnel_conf_text += "\tike=\"" + ike + "\"\n"
        tunnel_conf_text += "\tesp=\"" + esp + "\"\n"
        tunnel_conf_text += "\tikelifetime=\"" + TheProfile.phase1_lifetime + "\"\n"
        tunnel_conf_text += "\tkeylife=\"" + TheProfile.phase2_lifetime + "\"\n"
        if TheTunnel.auth_method == "RSA":
            tunnel_conf_text += "\tleftrsasigkey=" + Local_pub_key_path + "\n"
            tunnel_conf_text += "\trightrsasigkey=" + Peer_pub_key + "\n"
        tunnel_conf_text += "\tkeyexchange=\"ikev2\"\n"
        if TheTunnel.dpd:
            dpd_timeout = "900"
            tunnel_conf_text += "\tdpdaction = \"restart\"\n"
            tunnel_conf_text += "\tdpddelay = \"30s\"\n"
            tunnel_conf_text += "\tdpdtimeout = \"" + dpd_timeout + "s\"\n";

        return tunnel_conf_text

    def setSecretOf(slef, TheTunnel):
        tunnel_secrets_text = TheTunnel.local_id + " " + TheTunnel.peer_id + " PSK \"" + TheTunnel.pre_key + "\"\n"
        return tunnel_secrets_text

    def reconstructConfurations(self):
        ipsec_conf_main = File(IPSEC_ETC_CONF, IPSEC_PREFIX)
        ipsec_secrets_main = File(IPSEC_SECRETS, IPSEC_PREFIX)
        IPSEC_MainConfigurationsText = """config setup
    uniqueids="no"
    strictcrlpolicy="no"

conn %default
    mobike="no"
    keyingtries="%forever"
    leftsendcert="always"
    #forceencaps="yes"\n\n
    """
        IPSEC_MainSecretsText = ""
        tunnels = Tunnel.objects.all()
        for eachTunnel in tunnels:
            requested_profile = Profile.objects.get(name=eachTunnel.profile)
            IPSEC_MainConfigurationsText += self.setConfigurationOf(eachTunnel, requested_profile)
            IPSEC_MainSecretsText += self.setSecretOf(eachTunnel)
        ipsec_conf_main.Write(IPSEC_MainConfigurationsText)
        ipsec_secrets_main.Write(IPSEC_MainSecretsText)
