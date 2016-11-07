from django.shortcuts import render
from networking.models import Ethernet, Virtual, Routing
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse
from time import time
from django.contrib.auth import get_user

def networking(request):
    ethernets = Ethernet.objects.all()
    return render(request, 'networking/main.html', {'ethernets':ethernets})

def networking_read(request):
    ethernets = Ethernet.objects.all()
    records = []
    for eachEthernet in ethernets:
        records.append({  
                "id": eachEthernet.id,
                "title": eachEthernet.name,
                })
    
    parsed_json = records
 
    data = json.dumps(parsed_json)
     
    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response

@csrf_exempt
def ethernet_view(request):
    requested_ethernet = Ethernet.objects.get(id = request.GET["EthernetId"])
    record = []
    record.append({  
                "Author": requested_ethernet.author.username,
                "EthernetId": requested_ethernet.id,
                "Name": requested_ethernet.name,
                "Description": requested_ethernet.desc,
                "Status": requested_ethernet.status,
                "DHCP": requested_ethernet.dhcp,
                "Link": requested_ethernet.link,
                "IPv4Address": requested_ethernet.ipv4address,
                "Netmask": requested_ethernet.netmask,
                "Gateway": requested_ethernet.gateway,
                "ManualDNS": requested_ethernet.manual_dns,
                "PrimaryDNS": requested_ethernet.primary_dns,
                "SecondaryDNS": requested_ethernet.secondary_dns,
                "MTU": requested_ethernet.mtu,
                "ManualMSS": requested_ethernet.manual_mss,
                "MSS": requested_ethernet.mss,
                "AddedDate": requested_ethernet.added_date,
                "EditedDate": requested_ethernet.edited_date
    })
    
    parsed_json = record
    data = json.dumps(parsed_json)
     
    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response

@csrf_exempt
def ethernet_update(request):
    try:
        requested_ethernet = Ethernet.objects.get(id = request.POST["EthernetId"])
        requested_ethernet.status = True if request.POST["Status"] == "on" else False
#         requested_ethernet.name = request.POST["Name"]
        requested_ethernet.desc = request.POST["Description"]
        requested_ethernet.dhcp = True if request.POST["DHCP"] == "on" else False
        requested_ethernet.ipv4address = request.POST["IPv4Address"]
        requested_ethernet.netmask = request.POST["Netmask"]
        requested_ethernet.gateway = request.POST["Gateway"]
        requested_ethernet.manual_dns = True if request.POST["ManualDNS"] == "on" else False
        requested_ethernet.primary_dns = request.POST["PrimaryDNS"]
        requested_ethernet.secondary_dns = request.POST["SecondaryDNS"]
        requested_ethernet.mtu = request.POST["MTU"]
        requested_ethernet.manual_mss = True if request.POST["ManualMSS"] == "on" else False
        requested_ethernet.mss = request.POST["MSS"]
        requested_ethernet.edited_date = "/Date(%s)/"% str(int(time()*1000))
        
        requested_ethernet.save()
        
        parsed_json = {
                       'Result': "OK",
                       'Message': "Edited Successfully.",
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
def add_virtual(request):
    if request.method == "POST":
        try:
            newVirtual = Virtual(
                                 author = get_user(request),
#                                  desc = request.POST["Description"],
                                 parent = request.POST["ParentId"],
                                 ipv4address = request.POST["IPv4Address"],
                                 netmask = request.POST["Netmask"],
                                 added_date = "/Date(%s)/"% str(int(time()*1000)),
                                 edited_date = "/Date(%s)/"% str(int(time()*1000))
                                 )
            newVirtual.save()
            parsed_json = {
                       'Result': "OK",
                       'Message': "Edited Successfully.",
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

def routing(request):
    return render(request, 'networking/routing_main.html')

@csrf_exempt
def routing_create(request):
    try:
        newRoute = Routing(
                     author = request.user,
                     name = request.POST["Name"],
                     desc = request.POST["Description"],
                     ipv4address = request.POST["IPv4Address"],
                     netmask = request.POST["Netmask"],
                     gateway = request.POST["Gateway"],
                     interface = request.POST["Interface"],
                     metric = request.POST["Metric"],
                     added_date = "/Date(%s)/"% str(int(time()*1000)),
                     edited_date = "/Date(%s)/"% str(int(time()*1000))
                     )
        newRoute.save()
        RouteID = Routing.objects.get(name = request.POST["Name"]).id
        record = []
        record.append({
                  'Author': str(request.user),
                  "RouteID": RouteID,
                  'Name': request.POST["Name"],
                  'Description': request.POST["Description"],
                  'IPv4Address': request.POST["IPv4Address"],
                  'Netmask': request.POST["Netmask"],
                  'Gateway': request.POST["Gateway"],
                  'Interface': request.POST["Interface"],
                  'Metric': request.POST["Metric"],
                  'AddedDate': "/Date(%s)/"% str(int(time()*1000)),
                  'EditedDate': "/Date(%s)/"% str(int(time()*1000))
                  })
        
        parsed_json = {
                       'Result': "OK",
                       'Message': "Added Successfully.",
                       'Status': "success",
                        'Record': record
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
    routes = Routing.objects.all()
    records = []
    for eachRoute in routes:
        records.append({  
                "Author": eachRoute.author.username,
                "RouteID": eachRoute.id,
                "Name": eachRoute.name,
                "Description": eachRoute.desc,
                "Status": eachRoute.status,
                "IPv4Address": eachRoute.ipv4address,
                "Netmask": eachRoute.netmask,
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
    page_length = (start+pageSize) if (start+pageSize < json_length) else json_length
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
        requested_routing = Routing.objects.get(id = request.POST["routingId"])
        requested_routing.status = True if request.POST["Status"] == "on" else False
        requested_routing.name = request.POST["Name"]
        requested_routing.desc = request.POST["Description"]
        requested_routing.ipv4address = request.POST["IPv4Address"]
        requested_routing.netmask = request.POST["Netmask"]
        requested_routing.gateway = request.POST["Gateway"]
        requested_routing.interface = request.POST["Interface"]
        requested_routing.metric = request.POST["Metric"]
        requested_routing.edited_date = "/Date(%s)/"% str(int(time()*1000))
        
        requested_routing.save()
        
        record = []
        record.append({
                  'Author': str(request.user),
                  'Name': request.POST["Name"],
                  'Description': request.POST["Description"],
                  'IPv4Address': request.POST["IPv4Address"],
                  'Netmask': request.POST["Netmask"],
                  'Gateway': request.POST["Gateway"],
                  'Interface': request.POST["Interface"],
                  'Metric': request.POST["Metric"],
                  'AddedDate': "/Date(%s)/"% str(int(time()*1000)),
                  'EditedDate': "/Date(%s)/"% str(int(time()*1000))
                  })
        
        parsed_json = {
                       'Result': "OK",
                       'Message': "Edited Successfully.",
                       'Status': "success",
                        'Record': record
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
        requested_route = Routing.objects.get(id = request.POST["routingId"])
        requested_route.delete()
        
        parsed_json = {
                       'Result': "OK",
                       'Message': "Deleted Successfully.",
                       'Status': "success",
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
    requested_routing = Routing.objects.get(id = request.GET["routingId"])
    record = []
    record.append({  "Author": requested_routing.author.username,
                "routingId": requested_routing.id,
                "Name": requested_routing.name,
                "Description": requested_routing.desc,
                "Status": requested_routing.status,
                "IPv4Address": requested_routing.ipv4address,
                "Netmask": requested_routing.netmask,
                "Gateway": requested_routing.gateway,
                "Link": requested_routing.link,
                "Interface": requested_routing.interface,
                "Metric": requested_routing.metric,
                "AddedDate": requested_routing.added_date,
                "EditedDate": requested_routing.edited_date
    })
    
    parsed_json = record
    data = json.dumps(parsed_json)
     
    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response
