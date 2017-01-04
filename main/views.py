import json
import urllib3


def send_request(method_value="POST", url_value="", fields_value=None, headers_value={}):
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


def removeNetworkConfigurationOf(TheInterface):
    data = {
        'Name': TheInterface.name
    }

    url = 'http://localhost:9000/networking/ethernet/delete'
    return send_request('POST', url, data)


def setNetworkConfigurationOf(TheInterface):
    data = {
        'Name': TheInterface.name,
        'Description': TheInterface.desc,
        'Status': TheInterface.status,
        'Link': TheInterface.link,
        'Mac': TheInterface.mac,
        'Dhcp': TheInterface.dhcp,
        'IPv4Address': TheInterface.ipv4address,
        'Gateway': TheInterface.gateway,
        'ManualDns': TheInterface.manual_dns,
        'DnsServer': TheInterface.dnsserver,
        'Mtu': TheInterface.mtu,
        'ManualMss': TheInterface.manual_mss,
        'Mss': TheInterface.mss
    }

    url = 'http://localhost:9000/networking/ethernet/update'
    return send_request('POST', url, data)


def removeRoutingConfigurationOf(TheRoute):
    data = {
        'Name': TheRoute.name
    }

    url = 'http://localhost:9000/networking/routing/delete'
    return send_request('POST', url, data)


def setRoutingConfigurationOf(TheRoute):
    data = {
        'Name': TheRoute.name,
        'Description': TheRoute.desc,
        'Status': TheRoute.status,
        'IPv4Address': TheRoute.ipv4address,
        'Gateway': TheRoute.gateway,
        'Link': TheRoute.link,
        'Interface': TheRoute.interface,
        'Metric': TheRoute.metric
    }

    url = 'http://localhost:9000/networking/routing/update'
    return send_request('POST', url, data)
