from django.shortcuts import render
from .models import Address, Protocol, Schedule, Zone
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from time import time
from django.db.utils import IntegrityError


def objects(request):
    return render(request, 'objects/main.html')


@csrf_exempt
def address_list(request):
    return render(request, 'objects/address_main.html')


@csrf_exempt
def address_create(request):
    try:
        new_address = Address(
            author=request.user,
            name=request.POST["Name"],
            desc=request.POST["Description"],
            group_name=request.POST["Group"],
            version=request.POST["Version"],
            type=request.POST["Type"],
            value=request.POST["Value"],
            added_date="/Date(%s)/" % str(int(time() * 1000)),
            edited_date="/Date(%s)/" % str(int(time() * 1000))
        )
        new_address.save()
        address_object_id = Address.objects.get(name=request.POST["Name"]).id
        record = [{
            'Author': str(request.user),
            "AddressObjectId": address_object_id,
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Group': request.POST["Group"],
            'Version': request.POST["Version"],
            'Type': request.POST["Type"],
            'Value': request.POST["Value"],
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
def address_read(request):
    addresses = Address.objects.all()
    records = []
    for each_address in addresses:
        records.append({
            "Author": each_address.author.username,
            "AddressObjectId": each_address.id,
            "Name": each_address.name,
            "Description": each_address.desc,
            "Group": each_address.group_name,
            "Version": each_address.version,
            "Type": each_address.type,
            "Value": each_address.value,
            "AddedDate": each_address.added_date,
            "EditedDate": each_address.edited_date
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
def address_update(request):
    try:
        requested_address = Address.objects.get(id=request.POST["AddressObjectId"])

        requested_address.name = request.POST["Name"]
        requested_address.desc = request.POST["Description"]
        requested_address.group_name = request.POST["Group"]
        requested_address.version = request.POST["Version"]
        requested_address.type = request.POST["Type"]
        requested_address.value = request.POST["Value"]
        requested_address.edited_date = "/Date(%s)/" % str(int(time() * 1000))

        requested_address.save()

        record = [{
            'Author': str(request.user),
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Group': request.POST["Group"],
            'Version': request.POST["Version"],
            'Type': request.POST["Type"],
            'Value': request.POST["Value"],
            'AddedDate': "/Date(%s)/" % str(int(time() * 1000)),
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
def address_delete(request):
    try:
        requested_address = Address.objects.get(id=request.POST["AddressObjectId"])
        requested_address.delete()

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
def address_view(request):
    requested_address = Address.objects.get(id=request.GET["AddressObjectId"])
    record = [{
        "Author": requested_address.author.username,
        "AddressObjectId": requested_address.id,
        "Name": requested_address.name,
        "Description": requested_address.desc,
        "Group": requested_address.group_name,
        "Version": requested_address.version,
        "Type": requested_address.type,
        "Value": requested_address.value,
        "AddedDate": requested_address.added_date,
        "EditedDate": requested_address.edited_date
    }]

    parsed_json = record
    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def getAddressGroupNames(request):
    AddressObjects = Address.objects.values('group_name').distinct()
    records = []
    for eachAddressObject in AddressObjects:
        if eachAddressObject['group_name']:
            records.append({
                "value": eachAddressObject['group_name'],
                "name": eachAddressObject['group_name']
            })

    data = json.dumps(records)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def getAddressList(request):
    addresses = Address.objects.all()
    records = []
    for eachAddress in addresses:
        records.append({
            "name": eachAddress.name,
            "value": eachAddress.value
        })

    data = json.dumps(records)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def protocol_list(request):
    return render(request, 'objects/protocol_main.html')


@csrf_exempt
def protocol_create(request):
    try:
        newProtocol = Protocol(
            author=request.user,
            name=request.POST["Name"],
            desc=request.POST["Description"],
            group_name=request.POST["Group"],
            protocol=request.POST["Protocol"],
            direction=request.POST["Direction"],
            type=request.POST["Type"],
            value=request.POST["Value"],
            added_date="/Date(%s)/" % str(int(time() * 1000)),
            edited_date="/Date(%s)/" % str(int(time() * 1000))
        )
        newProtocol.save()
        ProtocolObjectId = Protocol.objects.get(name=request.POST["Name"]).id
        record = [{
            'Author': str(request.user),
            'ProtocolObjectId': ProtocolObjectId,
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Group': request.POST["Group"],
            'Protocol': request.POST["Protocol"],
            'Direction': request.POST["Direction"],
            'Type': request.POST["Type"],
            'Value': request.POST["Value"],
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
def protocol_read(request):
    addresses = Protocol.objects.all()
    records = []
    for each_protocol in addresses:
        records.append({
            "Author": each_protocol.author.username,
            "ProtocolObjectId": each_protocol.id,
            "Name": each_protocol.name,
            "Description": each_protocol.desc,
            "Group": each_protocol.group_name,
            "Protocol": each_protocol.protocol,
            "Direction": each_protocol.direction,
            "Type": each_protocol.type,
            "Value": each_protocol.value,
            "AddedDate": each_protocol.added_date,
            "EditedDate": each_protocol.edited_date
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
def protocol_update(request):
    try:
        requested_protocol = Protocol.objects.get(id=request.POST["ProtocolObjectId"])

        requested_protocol.name = request.POST["Name"]
        requested_protocol.desc = request.POST["Description"]
        requested_protocol.group_name = request.POST["Group"]
        requested_protocol.protocol = request.POST["Protocol"]
        requested_protocol.direction = request.POST["Direction"]
        requested_protocol.type = request.POST["Type"]
        requested_protocol.value = request.POST["Value"]
        requested_protocol.edited_date = "/Date(%s)/" % str(int(time() * 1000))

        requested_protocol.save()

        record = [{
            'Author': str(request.user),
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Group': request.POST["Group"],
            'Protocol': request.POST["Protocol"],
            'Direction': request.POST["Direction"],
            'Type': request.POST["Type"],
            'Value': request.POST["Value"],
            'AddedDate': "/Date(%s)/" % str(int(time() * 1000)),
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
def protocol_delete(request):
    try:
        requested_protocol = Protocol.objects.get(id=request.POST["ProtocolObjectId"])
        requested_protocol.delete()

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
def protocol_view(request):
    requested_address = Protocol.objects.get(id=request.GET["ProtocolObjectId"])
    record = [{
        "Author": requested_address.author.username,
        "ProtocolObjectId": requested_address.id,
        "Name": requested_address.name,
        "Description": requested_address.desc,
        "Group": requested_address.group_name,
        "Protocol": requested_address.protocol,
        "Direction": requested_address.direction,
        "Type": requested_address.type,
        "Value": requested_address.value,
        "AddedDate": requested_address.added_date,
        "EditedDate": requested_address.edited_date
    }]

    parsed_json = record
    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def getPortList(request):
    requested_address = Protocol.objects.get(id=request.GET["ProtocolObjectId"])
    record = [{
        "Author": requested_address.author.username,
        "ProtocolObjectId": requested_address.id,
        "Name": requested_address.name,
        "Description": requested_address.desc,
        "Group": requested_address.group_name,
        "Protocol": requested_address.protocol,
        "Direction": requested_address.direction,
        "Type": requested_address.type,
        "Value": requested_address.value,
        "AddedDate": requested_address.added_date,
        "EditedDate": requested_address.edited_date
    }]

    parsed_json = record
    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def getProtocolGroupNames(request):
    ProtocolObjects = Protocol.objects.values('group_name').distinct()
    records = []
    for eachProtocolObject in ProtocolObjects:
        if eachProtocolObject['group_name']:
            records.append({
                "value": eachProtocolObject['group_name'],
                "name": eachProtocolObject['group_name']
            })

    data = json.dumps(records)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def getProtocolList(request):
    protocols = Protocol.objects.all()
    records = []
    for eachProtocol in protocols:
        records.append({
            "name": eachProtocol.name,
            "value": eachProtocol.value
        })

    data = json.dumps(records)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def schedule_list(request):
    return render(request, 'objects/schedule_main.html')


@csrf_exempt
def schedule_create(request):
    try:
        new_schedule = Schedule(
            author=request.user,
            name=request.POST["Name"],
            desc=request.POST["Description"],
            day_of_week=",".join(request.POST.getlist("Weekday")),
            start_time=request.POST["StartTime"],
            stop_time=request.POST["StopTime"],
            added_date="/Date(%s)/" % str(int(time() * 1000)),
            edited_date="/Date(%s)/" % str(int(time() * 1000))
        )
        new_schedule.save()
        schedule_object_id = Schedule.objects.get(name=request.POST["Name"]).id
        record = [{
            'Author': str(request.user),
            'ScheduleObjectID': schedule_object_id,
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Weekday': request.POST["Weekday"],
            'StartTime': request.POST["StartTime"],
            'StopTime': request.POST["StopTime"],
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
def schedule_read(request):
    addresses = Schedule.objects.all()
    records = []
    for each_schedule in addresses:
        records.append({
            "Author": each_schedule.author.username,
            "ScheduleObjectId": each_schedule.id,
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
def schedule_update(request):
    try:
        requested_schedule = Schedule.objects.get(id=request.POST["ScheduleObjectId"])
        requested_schedule.name = request.POST["Name"]
        requested_schedule.desc = request.POST["Description"]
        requested_schedule.day_of_week = str(','.join(request.POST.getlist("Weekday")))
        requested_schedule.start_time = request.POST["StartTime"]
        requested_schedule.stop_time = request.POST["StopTime"]
        requested_schedule.edited_date = "/Date(%s)/" % str(int(time() * 1000))
        requested_schedule.save()

        record = [{
            'Author': str(request.user),
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Weekday': request.POST["Weekday"],
            'StartTime': request.POST["StartTime"],
            'StopTime': request.POST["StopTime"],
            'AddedDate': "/Date(%s)/" % str(int(time() * 1000)),
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
def schedule_delete(request):
    try:
        requested_schedule = Schedule.objects.get(id=request.POST["ScheduleObjectId"])
        requested_schedule.delete()

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
def schedule_view(request):
    requested_schedule = Schedule.objects.get(id=request.GET["ScheduleObjectId"])
    record = [{
        "Author": requested_schedule.author.username,
        "ProtocolObjectId": requested_schedule.id,
        "Name": requested_schedule.name,
        "Description": requested_schedule.desc,
        "Weekday": requested_schedule.day_of_week,
        "StartTime": requested_schedule.start_time,
        "StopTime": requested_schedule.stop_time,
        "AddedDate": requested_schedule.added_date,
        "EditedDate": requested_schedule.edited_date
    }]

    parsed_json = record
    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def getScheduleList(request):
    schedules = Schedule.objects.all()
    records = []
    for eachSchedule in schedules:
        records.append({
            "name": eachSchedule.name,
            "value": eachSchedule.value
        })

    data = json.dumps(records)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def zone_list(request):
    return render(request, 'objects/zone_main.html')


@csrf_exempt
def zone_create(request):
    try:
        newZone = Zone(
            author=request.user,
            name=request.POST["Name"],
            desc=request.POST["Description"],
            members=",".join(request.POST.getlist("Members")),
            added_date="/Date(%s)/" % str(int(time() * 1000)),
            edited_date="/Date(%s)/" % str(int(time() * 1000))
        )
        newZone.save()
        ZoneObjectID = Zone.objects.get(name=request.POST["Name"]).id
        record = [{
            'Author': str(request.user),
            'ZoneObjectID': ZoneObjectID,
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Members': request.POST["Members"],
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
def zone_read(request):
    addresses = Zone.objects.all()
    records = []
    for each_zone in addresses:
        records.append({
            "Author": each_zone.author.username,
            "ZoneObjectId": each_zone.id,
            "Name": each_zone.name,
            "Description": each_zone.desc,
            "Members": each_zone.members,
            "AddedDate": each_zone.added_date,
            "EditedDate": each_zone.edited_date
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
def zone_update(request):
    try:
        requested_zone = Zone.objects.get(id=request.POST["ZoneObjectId"])

        requested_zone.name = request.POST["Name"]
        requested_zone.desc = request.POST["Description"]
        requested_zone.members = str(','.join(request.POST.getlist("Members")))
        requested_zone.edited_date = "/Date(%s)/" % str(int(time() * 1000))
        requested_zone.save()

        record = [{
            'Author': str(request.user),
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Members': request.POST["Members"],
            'AddedDate': "/Date(%s)/" % str(int(time() * 1000)),
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
def zone_delete(request):
    try:
        requested_zone = Zone.objects.get(id=request.POST["ZoneObjectId"])
        requested_zone.delete()

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
def zone_view(request):
    requested_zone = Zone.objects.get(id=request.GET["ZoneObjectId"])
    record = [{
        "Author": requested_zone.author.username,
        "ZoneObjectId": requested_zone.id,
        "Name": requested_zone.name,
        "Description": requested_zone.desc,
        "Members": requested_zone.members,
        "AddedDate": requested_zone.added_date,
        "EditedDate": requested_zone.edited_date
    }]

    parsed_json = record
    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def getZoneList(request):
    zones = Zone.objects.all()
    records = []
    for eachZone in zones:
        records.append({
            "name": eachZone.name,
            "value": eachZone.value
        })

    data = json.dumps(records)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response

