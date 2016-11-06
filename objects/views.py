from django.shortcuts import render
from .models import Address, Protocol, Schedule, Zone
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from time import time
from networking.models import Ethernet
from django.core.context_processors import request

def objects(request):
    return render(request, 'objects/main.html')

@csrf_exempt
def address_list(request):
    return render(request, 'objects/address_main.html')

@csrf_exempt
def address_create(request):
    if request.method == "POST":
        newAddress = Address(
                     author = request.user,
                     name = request.POST["Name"],
                     desc = request.POST["Description"],
                     group_name = request.POST["Group"],
                     version = request.POST["Version"],
                     type = request.POST["Type"],
                     value = request.POST["Value"],
                     added_date = "/Date(%s)/"% str(int(time()*1000)),
                     edited_date = "/Date(%s)/"% str(int(time()*1000))
                     )
        newAddress.save()
        
        record = []
        record.append({
                  'Author': str(request.user),
                  'Name': request.POST["Name"],
                  'Description': request.POST["Description"],
                  'Group': request.POST["Group"],
                  'Version': request.POST["Version"],
                  'Type': request.POST["Type"],
                  'Value': request.POST["Value"],
                  'AddedDate': "/Date(%s)/"% str(int(time()*1000)),
                  'EditedDate': "/Date(%s)/"% str(int(time()*1000))
                  })
        
        jTableResult = {
                       'Result': "OK",
                       'Record': record,
                       }
        
        data = json.dumps(jTableResult)
        
        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response

@csrf_exempt
def address_read(request):
    addresses = Address.objects.all()
    records = []
    for eachAddress in addresses:
        records.append({  "Author": eachAddress.author.username,
                    "AddressId": eachAddress.id,
                    "Name": eachAddress.name,
                    "Description": eachAddress.desc,
                    "Group": eachAddress.group_name,
                    "Version": eachAddress.version,
                    "Type": eachAddress.type,
                    "Value": eachAddress.value,
                    "AddedDate": eachAddress.added_date,
                    "EditedDate": eachAddress.edited_date
        })
        
    parsed_json = records
    json_length = len(parsed_json)
    
    start = int(request.GET["jtStartIndex"])
    pageSize = int(request.GET["jtPageSize"])
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
def address_update(request):
    if request.method == "POST":
        requested_address = Address.objects.get(id = request.POST["AddressId"])
        
        requested_address.name = request.POST["Name"]
        requested_address.desc = request.POST["Description"]
        requested_address.group_name = request.POST["Group"]
        requested_address.version = request.POST["Version"]
        requested_address.type = request.POST["Type"]
        requested_address.value = request.POST["Value"]
        requested_address.edited_date = "/Date(%s)/"% str(int(time()*1000))
        
        requested_address.save()
        
        parsed_json = {
                   'Result': "OK",
                   }

        data = json.dumps(parsed_json)

        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response    
        
@csrf_exempt
def address_delete(request):
    if request.method == "POST":
        requested_address = Address.objects.get(id = request.POST["AddressId"])
        
        requested_address.delete()
        
        parsed_json = {
                   'Result': "OK",
                   }

        data = json.dumps(parsed_json)

        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response    

@csrf_exempt
def type_list(request):
    json_file = 'objects/conf/type.json'
    f = open(json_file)
    json_string = f.read()
    f.close()
    parsed_json = json.loads(json_string)
    parsed_json = {
                   'Result': "OK",
                   'Options': parsed_json,
                   }

    data = json.dumps(parsed_json)
    
    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response    

@csrf_exempt
def protocol_list(request):
    return render(request, 'objects/protocol_main.html')

@csrf_exempt
def protocol_create(request):
    if request.method == "POST":
        newProtocol = Protocol(
                     author = request.user,
                     name = request.POST["Name"],
                     desc = request.POST["Description"],
                     group_name = request.POST["Group"],
                     protocol = request.POST["Protocol"],
                     direction = request.POST["Direction"],
                     value = request.POST["Value"],
                     added_date = "/Date(%s)/"% str(int(time()*1000)),
                     edited_date = "/Date(%s)/"% str(int(time()*1000))
                     )
        newProtocol.save()
        
        record = []
        record.append({
                  'Author': str(request.user),
                  'Name': request.POST["Name"],
                  'Description': request.POST["Description"],
                  'Group': request.POST["Group"],
                  'Protocol': request.POST["Protocol"],
                  'Direction': request.POST["Direction"],
                  'Value': request.POST["Value"],
                  'AddedDate': "/Date(%s)/"% str(int(time()*1000)),
                  'EditedDate': "/Date(%s)/"% str(int(time()*1000))
                  })
        
        jTableResult = {
                       'Result': "OK",
                       'Record': record,
                       }
        
        data = json.dumps(jTableResult)
        
        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response


@csrf_exempt
def protocol_read(request):
    addresses = Protocol.objects.all()
    records = []
    for each_protocol in addresses:
        records.append({  "Author": each_protocol.author.username,
                    "ProtocolId": each_protocol.id,
                    "Name": each_protocol.name,
                    "Description": each_protocol.desc,
                    "Group": each_protocol.group_name,
                    "Protocol": each_protocol.protocol,
                    "Direction": each_protocol.direction,
                    "Value": each_protocol.value,
                    "AddedDate": each_protocol.added_date,
                    "EditedDate": each_protocol.edited_date
        })
        
    parsed_json = records
    json_length = len(parsed_json)
    
    start = int(request.GET["jtStartIndex"])
    pageSize = int(request.GET["jtPageSize"])
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
def protocol_update(request):
    if request.method == "POST":
        requested_protocol = Protocol.objects.get(id = request.POST["ProtocolId"])
        
        requested_protocol.name = request.POST["Name"]
        requested_protocol.desc = request.POST["Description"]
        requested_protocol.group_name = request.POST["Group"]
        requested_protocol.protocol = request.POST["Protocol"]
        requested_protocol.direction = request.POST["Direction"]
        requested_protocol.value = request.POST["Value"]
        requested_protocol.edited_date = "/Date(%s)/"% str(int(time()*1000))
        
        requested_protocol.save()
        
        for each_protocol in parsed_json:
            if each_protocol['ProtocolId'] == request.POST["ProtocolId"]:
                each_protocol['Name'] = request.POST["Name"]
                each_protocol['Description'] = request.POST["Description"]
                each_protocol['Group'] = request.POST["Group"]
                each_protocol['Protocol'] = request.POST["Protocol"]
                each_protocol['Direction'] = request.POST["Direction"]
                each_protocol['Value'] = request.POST["Value"]
                each_protocol['EditedDate'] = "/Date(%s)/"% str(int(time()*1000))

        parsed_json = {
                   'Result': "OK",
                   }

        data = json.dumps(parsed_json)

        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response    
        
@csrf_exempt
def protocol_delete(request):
    if request.method == "POST":
        requested_protocol = Protocol.objects.get(id = request.POST["ProtocolId"])
        
        requested_protocol.delete()
        
        parsed_json = {
                   'Result': "OK",
                   }

        data = json.dumps(parsed_json)

        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response    

@csrf_exempt
def schedule_list(request):
    return render(request, 'objects/schedule_main.html')

@csrf_exempt
def schedule_create(request):
    if request.method == "POST":
        try:
            newSchedule = Schedule(
                         author = request.user,
                         name = request.POST["Name"],
                         desc = request.POST["Description"],
                         day_of_week = ",".join(request.POST.getlist("Weekday")),
                         start_time = request.POST["StartTime"],
                         stop_time = request.POST["StopTime"],
                         added_date = "/Date(%s)/"% str(int(time()*1000)),
                         edited_date = "/Date(%s)/"% str(int(time()*1000))
                         )
            newSchedule.save()
            
            record = []
            record.append({
                      'Author': str(request.user),
                      'Name': request.POST["Name"],
                      'Description': request.POST["Description"],
                      'Weekday': request.POST["Weekday"],
                      'StartTime': request.POST["StartTime"],
                      'StopTime': request.POST["StopTime"],
                      'AddedDate': "/Date(%s)/"% str(int(time()*1000)),
                      'EditedDate': "/Date(%s)/"% str(int(time()*1000))
                      })
            
            jTableResult = {
                           'Result': "OK",
                           'Record': record,
                           }
        except :
            jTableResult = {
                           'Result': "ERROR",
                           'Record': record,
                           }

        data = json.dumps(jTableResult)
        
        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response


@csrf_exempt
def schedule_read(request):
    addresses = Schedule.objects.all()
    records = []
    for each_schedule in addresses:
        records.append({  "Author": each_schedule.author.username,
                    "ScheduleId": each_schedule.id,
                    "Name": each_schedule.name,
                    "Description": each_schedule.desc,
                    "Weekday": each_schedule.day_of_week,
                    "StartTime": each_schedule.start_time,
                    "StopTime": each_schedule.stop_time,
                    "AddedDate": each_schedule.added_date,
                    "EditedDate": each_schedule.edited_date
        })
        
    parsed_json = records
    json_length = len(parsed_json)
    
    start = int(request.GET["jtStartIndex"])
    pageSize = int(request.GET["jtPageSize"])
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
def schedule_update(request):
    if request.method == "POST":

        requested_schedule = Schedule.objects.get(id = request.POST["ScheduleId"])
        
        requested_schedule.name = request.POST["Name"]
        requested_schedule.desc = request.POST["Description"]
        requested_schedule.day_of_week = str(','.join(request.POST.getlist("Weekday")))
        requested_schedule.start_time = request.POST["StartTime"]
        requested_schedule.stop_time = request.POST["StopTime"]
        requested_schedule.edited_date = "/Date(%s)/"% str(int(time()*1000))
        
        requested_schedule.save()
        
        parsed_json = {
                   'Result': "OK",
                   }

        data = json.dumps(parsed_json)

        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response    
        
@csrf_exempt
def schedule_delete(request):
    if request.method == "POST":
        requested_schedule = Schedule.objects.get(id = request.POST["ScheduleId"])
        
        requested_schedule.delete()
        
        parsed_json = {
                   'Result': "OK",
                   }

        data = json.dumps(parsed_json)

        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response    

@csrf_exempt
def zone_list(request):
    return render(request, 'objects/zone_main.html')

@csrf_exempt
def zone_create(request):
    if request.method == "POST":
        newZone = Zone(
                     author = request.user,
                     name = request.POST["Name"],
                     desc = request.POST["Description"],
                     members = ",".join(request.POST.getlist("Members")),
                     added_date = "/Date(%s)/"% str(int(time()*1000)),
                     edited_date = "/Date(%s)/"% str(int(time()*1000))
                     )
        newZone.save()
        
        record = []
        record.append({
                  'Author': str(request.user),
                  'Name': request.POST["Name"],
                  'Description': request.POST["Description"],
                  'Members': request.POST["Members"],
                  'AddedDate': "/Date(%s)/"% str(int(time()*1000)),
                  'EditedDate': "/Date(%s)/"% str(int(time()*1000))
                  })
        
        jTableResult = {
                       'Result': "OK",
                       'Record': record,
                       }
        
        data = json.dumps(jTableResult)
        
        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response


@csrf_exempt
def zone_read(request):
    addresses = Zone.objects.all()
    records = []
    for each_zone in addresses:
        records.append({  "Author": each_zone.author.username,
                    "ZoneId": each_zone.id,
                    "Name": each_zone.name,
                    "Description": each_zone.desc,
                    "Members": each_zone.members,
                    "AddedDate": each_zone.added_date,
                    "EditedDate": each_zone.edited_date
        })
        
    parsed_json = records
    json_length = len(parsed_json)
    
    start = int(request.GET["jtStartIndex"])
    pageSize = int(request.GET["jtPageSize"])
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
def zone_update(request):
    if request.method == "POST":
        requested_zone = Zone.objects.get(id = request.POST["ZoneId"])
        
        requested_zone.name = request.POST["Name"]
        requested_zone.desc = request.POST["Description"]
        requested_zone.members = str(','.join(request.POST.getlist("Members")))
        requested_zone.edited_date = "/Date(%s)/"% str(int(time()*1000))
        
        requested_zone.save()
        
        parsed_json = {
                   'Result': "OK",
                   }

        data = json.dumps(parsed_json)

        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response    
        
@csrf_exempt
def zone_delete(request):
    if request.method == "POST":
        requested_zone = Zone.objects.get(id = request.POST["ZoneId"])
        
        requested_zone.delete()
        
        parsed_json = {
                   'Result': "OK",
                   }

        data = json.dumps(parsed_json)

        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response    

@csrf_exempt
def ethernet_list(request):
    interfaces = Ethernet.objects.all()
    records = []
    for each_interface in interfaces:
        records.append({
            "DisplayText": each_interface.name,
            "Value": each_interface.id
        })

    parsed_json = {
                   'Result': "OK",
                   'Options': records
                   }

    data = json.dumps(parsed_json)
    
    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response    
