from django.shortcuts import render
from networking.models import Ethernet, Virtual, Routing
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse
from time import time
from django.contrib.auth import get_user

def networking(request):
    ethernets = Ethernet.objects.all()
#     ethernetNumber = len(ethernets)
#     
# #     requestedPage = int(request.GET["ethReqPage"])
# #     start = int(request.GET["ethStartIndex"])
#     start = 0
# #     pageSize = int(request.GET["ethPageSize"])
#     pageSize = 5
#     ethernetTotalPage = (start+pageSize) if (start+pageSize < ethernetNumber) else ethernetNumber
#     return render(request, 'networking/main.html', {'ethernets':ethernets,'ethernetTotalPage':ethernetTotalPage})
    return render(request, 'networking/main.html', {'ethernets':ethernets})
#     return render(request, 'networking/main.html')

@csrf_exempt
def ethernet_read(request):
    ethernets = Ethernet.objects.all()
     
    each_row = """<div class="md-card">
                    <div class="md-card-content">
                        <div class="uk-grid uk-grid-medium" data-uk-grid-margin data-uk-grid-match="{target:'.md-card'}">
                            <div class="uk-width-medium-2-10 uk-width-small-1-1">
                                <div class="uk-grid">
                                    <div class="uk-width-1-1">
                                        <span class="uk-text-large">%s</span> <!-- Name -->
                                    </div>
                                    <div class="uk-width-1-1">
                                        <span class="uk-text-muted uk-text-small">%s</span> <!-- Description -->
                                    </div>
                                </div>
                            </div>
                            <div class="uk-width-medium-2-10 uk-width-small-1-1">
                                <div class="uk-grid">
                                     <div class="uk-width-1-1">
                                        <span class="uk-text-middle">%s</span> <!-- IPv4Address -->
                                    </div>
                                    <div class="uk-width-1-1">
                                        <span class="uk-text-muted uk-text-small">%s</span> <!-- Netmask -->
                                    </div>
                                </div>
                            </div>
                            <div class="uk-width-medium-2-10 uk-width-small-1-1">
                                <div class="uk-grid">
                                    <div class="uk-width-1-1">
                                        <span class="uk-text-small">Default Gateway: %s</span> <!-- Gateway -->
                                    </div>
                                    <div class="uk-width-1-1">
                                        <span class="uk-text-small">Primary DNS: %s</span> <!-- PrimaryDNS -->
                                    </div>
                                    <div class="uk-width-1-1">
                                        <span class="uk-text-small">Secondary DNS: %s</span> <!-- SecondaryDNS -->
                                    </div>
                                </div>
                            </div>
                            <div class="uk-width-medium-1-10 uk-width-small-1-1">&nbsp;</div>
                           <div class="uk-width-medium-3-10 uk-width-small-1-1">
                                <div class="uk-grid uk-grid-medium" data-uk-grid-margin data-uk-grid-match="{target:'.md-card'}">
                                    <div class="uk-width-1-5">
                                        <img style="cursor:pointer" title="Status" src='/static/assets/img/md-images/%s.png' alt="Status"/> <!-- ethernet_status -->
                                    </div>
                                    <div class="uk-width-1-5">
                                        <img style="cursor:pointer" title="Link" src='/static/assets/img/md-images/%s.png' alt="Link Status"/> <!-- ethernet_link_status -->
                                    </div>
                                    <div class="uk-width-1-5">
                                        <img style="cursor:pointer" title="DHCP" src='/static/assets/img/md-images/%s.png' alt="DHCP Status"/> <!-- ethernet_dhcp_status -->                                                            
                                    </div>
                                    <div class="uk-width-1-5">
                                        <a id="add_virtualip__%s" href="#" data-uk-modal="{target:'#window_virtual'}" data-uk-tooltip="{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}">
                                            <img style="cursor:pointer" title="Add IP Address" src='/static/assets/img/md-images/plus.png' alt="Add IP Address"/>
                                        </a>
                                    </div>
                                    <div class="uk-width-1-5">
                                        <a id="edit_ethernet__%s" href="#" data-uk-modal="{target:'#window_ethernet'}" data-uk-tooltip="{cls:'uk-tooltip-small',pos:'top-left',animation:'true'}">
                                            <img style="cursor:pointer" title="Edit" src='/static/assets/img/md-images/pencil.png' alt="Edit"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div> <!-- uk-grid uk-grid-medium endofdiv -->
                    </div> <!-- md-card-content endofdiv -->
                </div> <!-- md-card endofdiv -->""".replace('\s+\n','')
     
    data = """<!-- Ethernet Body -->
    <div class="uk-grid" data-uk-grid-margin>
        <div class="uk-width-1-1">
            <div class="uk-overflow-container">
                <h3 class="heading_a uk-margin-bottom"><i class="material-icons">device_hub</i>Ethernet</h3>""".replace('\s+\n','')

    for eachEthernet in ethernets:
        ethernet_status = "lan-disconnect"
        if eachEthernet.status :
            ethernet_status = "lan-connect"
        ethernet_link_status = "link-off"
        if eachEthernet.link :
            ethernet_link_status = "link"
        ethernet_dhcp_status = "server-network-off"
        if eachEthernet.dhcp :
            ethernet_dhcp_status = "server-network"
        gateway_value = "None"
        if eachEthernet.gateway != "":
            gateway_value = eachEthernet.gateway
        pdns_value = "None"
        if eachEthernet.primary_dns != "":
            pdns_value = eachEthernet.primary_dns        
        sdns_value = "None"
        if eachEthernet.secondary_dns != "":
            sdns_value = eachEthernet.secondary_dns        
        data += each_row % (eachEthernet.name, eachEthernet.desc,eachEthernet.ipv4address,
                                eachEthernet.netmask,gateway_value,pdns_value,sdns_value,
                                ethernet_status,ethernet_link_status,ethernet_dhcp_status,eachEthernet.id,eachEthernet.id)
 
 
    data += """</div> <!-- uk-overflow-container endofdiv -->
            </div> <!-- uk-width-1-1 endofdiv -->
            </div> <!-- uk-grid endofdiv -->
            <!--<ul class="uk-pagination uk-margin-medium-top uk-margin-medium-bottom">
              <li class="uk-disabled"><span><i class="uk-icon-angle-double-left"></i></span></li>
              <li class="uk-active"><span>1</span></li>
              <li><a href="#">2</a></li>
              <li><a href="#">3</a></li>
              <li><a href="#">4</a></li>
              <li><span>&nbsp;</span></li>
              <li><a href="#">20</a></li>
              <li><a href="#"><i class="uk-icon-angle-double-right"></i></a></li>
            </ul>
            <div class="md-fab-wrapper md-fab-speed-dial">
                <a class="md-fab md-fab-primary" href="#" data-uk-modal="{target:'#virtual_window'}" data-uk-tooltip="{cls:'uk-tooltip-small',pos:'left'}" title="Address"><i class="material-icons">add</i></a>
            </div>-->
            <!-- End of Ethernet Body -->""".replace('\s+\n','')
 
    response = HttpResponse()
    response['Content-Type'] = "text/plain"
    response.write(data)
    return response

@csrf_exempt
def ethernet_view(request):
    requested_ethernet = Ethernet.objects.get(id = request.GET["EthernetId"])
    record = []
    record.append({  "Author": requested_ethernet.author.username,
                "EthernetId": requested_ethernet.id,
                "Name": requested_ethernet.name,
                "Description": requested_ethernet.desc,
                "Status": requested_ethernet.status,
                "DHCP": requested_ethernet.dhcp,
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

# @csrf_exempt
# def ethernet_read_as_json(request):
#     ethernets = Ethernet.objects.all()
#     records = []
#     for eachEthernet in ethernets:
#         records.append({  "Author": eachEthernet.author.username,
#                     "EthernetId": eachEthernet.id,
#                     "Name": eachEthernet.name,
#                     "Description": eachEthernet.desc,
#                     "Status": eachEthernet.status,
#                     "DHCP": eachEthernet.dhcp,
#                     "IPv4Address": eachEthernet.ipv4address,
#                     "Netmask": eachEthernet.netmask,
#                     "Gateway": eachEthernet.gateway,
#                     "PrimaryDNS": eachEthernet.primary_dns,
#                     "SecondaryDNS": eachEthernet.secondary_dns,
#                     "MTU": eachEthernet.mtu,
#                     "MSSFlag": eachEthernet.override_mss_flag,
#                     "MSSValue": eachEthernet.mss,
#                     "AddedDate": eachEthernet.added_date,
#                     "EditedDate": eachEthernet.edited_date
#         })
#         
#     parsed_json = records
#     json_length = len(parsed_json)
#     
#     start = int(request.GET["uktStartIndex"])
#     pageSize = int(request.GET["uktPageSize"])
#     page_length = (start+pageSize) if (start+pageSize < json_length) else json_length
#     parsed_json = parsed_json[start:page_length]
#     parsed_json = {
#                    'Result': "OK",
#                    'TotalRecordCount': json_length,
#                    'Records': parsed_json
#                    }
# 
#     data = json.dumps(parsed_json)
#     
#     response = HttpResponse()
#     response['Content-Type'] = "application/json"
#     response.write(data)
#     return response    

def routing(request):
    routes = Routing.objects.all()
    routes_length = int(len(routes))
    route_list = []
    for i in range(0,routes_length):
        route_list.append(i)    
    return render(request, 'networking/routing_main.html', {'routes':routes,'records':route_list})
