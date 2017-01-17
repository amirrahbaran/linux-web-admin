from django.shortcuts import render

from main.networking import NetworkInterface
from networking.models import Ethernet, Routing
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse
from time import time
from django.db.utils import IntegrityError

from netsecui.settings import RELEASE
from widgets.views import getEthernetHwAddress, getEthernetRealInterfaces

release = RELEASE

def ethernet_list(request):
    return render(request, 'networking/ethernet_main.html', {'release':release})


@csrf_exempt
def ethernet_create(request):
    try:
        new_ethernet = Ethernet(
            author=request.user,
            name=request.POST["Name"],
            desc=request.POST["Description"],
            status=True if request.POST["Status"] == "on" else False,
            mac=getEthernetHwAddress(request.POST["Name"]),
            dhcp=True if request.POST["Dhcp"] == "on" else False,
            ipv4address=request.POST["IPv4Address"],
            gateway=request.POST["Gateway"],
            manual_dns=True if request.POST["ManualDns"] == "on" else False,
            dnsserver=request.POST["DnsServer"],
            mtu=request.POST["Mtu"],
            manual_mss=True if request.POST["ManualMss"] == "on" else False,
            mss=request.POST["Mss"],
            added_date="/Date(%s)/" % str(int(time() * 1000)),
            edited_date="/Date(%s)/" % str(int(time() * 1000))
        )
        new_ethernet.save()
        ethernet_object_id = Ethernet.objects.get(name=request.POST["Name"]).id
        record = [{
            'Author': str(request.user),
            "EthernetId": ethernet_object_id,
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Status': request.POST["Status"],
            'Mac': getEthernetHwAddress(request.POST["Name"]),
            'Dhcp': request.POST["Dhcp"],
            'IPv4Address': request.POST["IPv4Address"],
            'Gateway': request.POST["Gateway"],
            'ManualDns': request.POST["ManualDns"],
            'DnsServer': request.POST["DnsServer"],
            'Mtu': request.POST["Mtu"],
            'ManualMss': request.POST["ManualMss"],
            'Mss': request.POST["Mss"],
            'AddedDate': "/Date(%s)/" % str(int(time() * 1000)),
            'EditedDate': "/Date(%s)/" % str(int(time() * 1000))
        }]

        parsed_json = {
            'Result': "OK",
            'Message': "Added Successfully.",
            'Status': "success",
            'Record': record
        }
    except IntegrityError:
        parsed_json = {
            'Result': "DUP",
            'Message': 'This name was used once, please try again!',
            'Status': "danger"
        }
    except Exception as e:
        parsed_json = {
            'Result': "ERROR",
            'Message': '%s (%s)' % (e.message, type(e)),
            'Status': "danger"
        }

    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def ethernet_read(request):
    ethernets = Ethernet.objects.all().order_by("name")
    records = []
    for each_ethernet in ethernets:
        if each_ethernet.dhcp:
            ethernet_object = NetworkInterface(each_ethernet.name)
            IPv4Addresses = ethernet_object.List().ip
        else:
            IPv4Addresses = each_ethernet.ipv4address
        records.append({
            "Author": each_ethernet.author.username,
            "EthernetId": each_ethernet.id,
            "Name": each_ethernet.name,
            "Description": each_ethernet.desc,
            "Status": each_ethernet.status,
            "Link": each_ethernet.link,
            "Mac": each_ethernet.mac,
            "Dhcp": each_ethernet.dhcp,
            'IPv4Address': IPv4Addresses,
            'Gateway': each_ethernet.gateway,
            'ManualDns': each_ethernet.manual_dns,
            'DnsServer': each_ethernet.dnsserver,
            'Mtu': each_ethernet.mtu,
            'ManualMss': each_ethernet.manual_mss,
            'Mss': each_ethernet.mss,
            "AddedDate": each_ethernet.added_date,
            "EditedDate": each_ethernet.edited_date
        })

    parsed_json = records
    json_length = len(parsed_json)

    start = int(request.GET["StartIndex"])
    pageSize = int(request.GET["PageSize"])
    page_length = (start + pageSize) if (start + pageSize < json_length) else json_length
    parsed_json = parsed_json[start:page_length]
    parsed_json = {
        'Result': "OK",
        'TotalRecordCount': json_length,
        'Records': parsed_json
    }

    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def ethernet_update(request):
    try:
        requested_ethernet = Ethernet.objects.get(id=request.POST["EthernetId"])

        requested_ethernet.name = request.POST["Name"]
        requested_ethernet.desc = request.POST["Description"]
        requested_ethernet.status = True if request.POST["Status"] == "on" else False
        requested_ethernet.link = True if request.POST["Link"] == "on" else False
        requested_ethernet.dhcp = True if request.POST["Dhcp"] == "on" else False
        requested_ethernet.ipv4address = request.POST["IPv4Address"]
        requested_ethernet.gateway = request.POST["Gateway"]
        requested_ethernet.manual_dns = True if request.POST["ManualDns"] == "on" else False
        requested_ethernet.dnsserver = request.POST["DnsServer"]
        requested_ethernet.mtu = request.POST["Mtu"]
        requested_ethernet.manual_mss = True if request.POST["ManualMss"] == "on" else False
        requested_ethernet.mss = request.POST["Mss"]
        requested_ethernet.edited_date = "/Date(%s)/" % str(int(time() * 1000))

        requested_ethernet.save()

        record = [{
            'Author': str(request.user),
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Status': request.POST["Status"],
            'Link': request.POST["Link"],
            'Dhcp': request.POST["Dhcp"],
            'IPv4Address': request.POST["IPv4Address"],
            'Gateway': request.POST["Gateway"],
            'ManualDns': request.POST["ManualDns"],
            'DnsServer': request.POST["DnsServer"],
            'Mtu': request.POST["Mtu"],
            'ManualMss': request.POST["ManualMss"],
            'Mss': request.POST["Mss"],
            'EditedDate': "/Date(%s)/" % str(int(time() * 1000))
        }]

        parsed_json = {
            'Result': "OK",
            'Message': "Edited Successfully.",
            'Status': "success",
            'Record': record
        }
    except IntegrityError:
        parsed_json = {
            'Result': "DUP",
            'Message': 'This name was used once, please try again!',
            'Status': "danger"
        }
    except Exception as e:
        parsed_json = {
            'Result': "ERROR",
            'Message': '%s (%s)' % (e.message, type(e)),
            'Status': "danger"
        }
    data = json.dumps(parsed_json)
    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def ethernet_delete(request):
    try:
        requested_ethernet = Ethernet.objects.get(id=request.POST["EthernetId"])
        requested_ethernet.delete()

        parsed_json = {
            'Result': "OK",
            'Message': "Deleted Successfully.",
            'Status': "success"
        }
    except Exception as e:
        parsed_json = {
            'Result': "ERROR",
            'Message': '%s (%s)' % (e.message, type(e)),
            'Status': "danger"
        }

    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def ethernet_view(request):
    requested_ethernet = Ethernet.objects.get(id=request.GET["EthernetId"])
    record = [{
        "Author": requested_ethernet.author.username,
        "EthernetId": requested_ethernet.id,
        "Name": requested_ethernet.name,
        "Description": requested_ethernet.desc,
        "Status": requested_ethernet.status,
        "Link": requested_ethernet.link,
        "Dhcp": requested_ethernet.dhcp,
        "IPv4Address": requested_ethernet.ipv4address,
        "Gateway": requested_ethernet.gateway,
        "ManualDns": requested_ethernet.manual_dns,
        "DnsServer": requested_ethernet.dnsserver,
        "Mtu": requested_ethernet.mtu,
        "ManualMss": requested_ethernet.manual_mss,
        "Mss": requested_ethernet.mss,
        "AddedDate": requested_ethernet.added_date,
        "EditedDate": requested_ethernet.edited_date
    }]

    parsed_json = record
    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def getEthernetList(request):
    ethernets = Ethernet.objects.all()
    records = []
    for eachEthernet in ethernets:
        records.append({
            "value": eachEthernet.name,
            "name": eachEthernet.desc
        })

    data = json.dumps(records)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def getRealEthernets(request):
    dbEthernetNames = Ethernet.objects.values_list('name', flat=True)
    records = []
    for eachEthernet in getEthernetRealInterfaces():
        if eachEthernet not in dbEthernetNames:
            records.append({
                "value": eachEthernet,
                "name": eachEthernet
            })

    data = json.dumps(records)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


def getEthernetLinkStatus(request):
    EthernetObject = NetworkInterface()
    records = []
    for iface in EthernetObject.List():
        eachEthernetObjects = NetworkInterface(iface.name)
        records.append({
            "Name": iface.name,
            "Link": eachEthernetObjects.getLink()
        })
    data = json.dumps(records)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


def routing_list(request):
    return render(request, 'networking/routing_main.html', {'release': release})


@csrf_exempt
def routing_create(request):
    try:
        new_routing = Routing(
            author=request.user,
            name=request.POST["Name"],
            desc=request.POST["Description"],
            status=True if request.POST["Status"] == "on" else False,
            ipv4address=request.POST["IPv4Address"],
            gateway=request.POST["Gateway"],
            interface=request.POST["Interface"],
            metric=request.POST["Metric"],
            added_date="/Date(%s)/" % str(int(time() * 1000)),
            edited_date="/Date(%s)/" % str(int(time() * 1000))
        )
        new_routing.save()
        RouteID = Routing.objects.get(name=request.POST["Name"]).id
        record = [{
            'Author': str(request.user),
            'RouteID': RouteID,
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Status': request.POST["Status"],
            'IPv4Address': request.POST["IPv4Address"],
            'Gateway': request.POST["Gateway"],
            'Interface': request.POST["Interface"],
            'Metric': request.POST["Metric"],
            'AddedDate': "/Date(%s)/" % str(int(time() * 1000)),
            'EditedDate': "/Date(%s)/" % str(int(time() * 1000))
        }]

        parsed_json = {
            'Result': "OK",
            'Message': "Added Successfully.",
            'Status': "success",
            'Record': record
        }
    except IntegrityError:
        parsed_json = {
            'Result': "DUP",
            'Message': 'This name was used once, please try again!',
            'Status': "danger"
        }
    except Exception as e:
        parsed_json = {
            'Result': "ERROR",
            'Message': '%s (%s)' % (e.message, type(e)),
            'Status': "danger"
        }

    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def routing_read(request):
    routes = Routing.objects.all().order_by("name")
    records = []
    for eachRoute in routes:
        records.append({
            "Author": eachRoute.author.username,
            "RouteID": eachRoute.id,
            "Name": eachRoute.name,
            "Description": eachRoute.desc,
            "Status": eachRoute.status,
            "IPv4Address": eachRoute.ipv4address,
            "Gateway": eachRoute.gateway,
            "Link": eachRoute.link,
            "Interface": eachRoute.interface,
            "Metric": eachRoute.metric,
            "AddedDate": eachRoute.added_date,
            "EditedDate": eachRoute.edited_date
        })

    parsed_json = records
    json_length = len(parsed_json)

    start = int(request.GET["StartIndex"])
    pageSize = int(request.GET["PageSize"])
    page_length = (start + pageSize) if (start + pageSize < json_length) else json_length
    parsed_json = parsed_json[start:page_length]
    parsed_json = {
        'Result': "OK",
        'TotalRecordCount': json_length,
        'Records': parsed_json
    }

    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def routing_update(request):
    try:
        requested_routing = Routing.objects.get(id=request.POST["routingId"])

        requested_routing.name = request.POST["Name"]
        requested_routing.desc = request.POST["Description"]
        requested_routing.status = True if request.POST["Status"] == "on" else False
        requested_routing.ipv4address = request.POST["IPv4Address"]
        requested_routing.gateway = request.POST["Gateway"]
        requested_routing.interface = request.POST["Interface"]
        requested_routing.metric = request.POST["Metric"]
        requested_routing.edited_date = "/Date(%s)/" % str(int(time() * 1000))

        requested_routing.save()

        record = [{
            'Author': str(request.user),
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Status': request.POST["Status"],
            'IPv4Address': request.POST["IPv4Address"],
            'Gateway': request.POST["Gateway"],
            'Interface': request.POST["Interface"],
            'Metric': request.POST["Metric"],
            'EditedDate': "/Date(%s)/" % str(int(time() * 1000))
        }]

        parsed_json = {
            'Result': "OK",
            'Message': "Edited Successfully.",
            'Status': "success",
            'Record': record
        }
    except IntegrityError:
        parsed_json = {
            'Result': "DUP",
            'Message': 'This name was used once, please try again!',
            'Status': "danger"
        }
    except Exception as e:
        parsed_json = {
            'Result': "ERROR",
            'Message': '%s (%s)' % (e.message, type(e)),
            'Status': "danger"
        }
    data = json.dumps(parsed_json)
    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def routing_delete(request):
    try:
        requested_route = Routing.objects.get(id=request.POST["routingId"])
        requested_route.delete()

        parsed_json = {
            'Result': "OK",
            'Message': "Deleted Successfully.",
            'Status': "success"
        }
    except Exception as e:
        parsed_json = {
            'Result': "ERROR",
            'Message': '%s (%s)' % (e.message, type(e)),
            'Status': "danger"
        }

    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def routing_view(request):
    requested_routing = Routing.objects.get(id=request.GET["routingId"])
    record = [{
        "Author": requested_routing.author.username,
        "routingId": requested_routing.id,
        "Name": requested_routing.name,
        "Description": requested_routing.desc,
        "Status": requested_routing.status,
        "IPv4Address": requested_routing.ipv4address,
        "Gateway": requested_routing.gateway,
        "Link": requested_routing.link,
        "Interface": requested_routing.interface,
        "Metric": requested_routing.metric,
        "AddedDate": requested_routing.added_date,
        "EditedDate": requested_routing.edited_date
    }]

    parsed_json = record
    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response
