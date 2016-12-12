from django.shortcuts import render
from .models import Policies
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from time import time
from django.db.utils import IntegrityError


def policies_list(request):
    return render(request, 'policies/policies_main.html')


@csrf_exempt
def policies_create(request):
    try:
        new_policies = Policies(
            author=request.user,
            status=True if request.POST["Status"] == "on" else False,
            log=True if request.POST["Log"] == "on" else False,
            name=request.POST["Name"],
            desc=request.POST["Description"],
            action=request.POST["Action"],
            schedule=request.POST["Schedule"],
            source_zone=request.POST["SourceZone"],
            destination_zone=request.POST["DestinationZone"],
            source_network=request.POST["SourceNetwork"],
            destination_network=request.POST["DestinationNetwork"],
            source_service=request.POST["SourceService"],
            destination_service=request.POST["DestinationService"],
            snat_enabled=True if request.POST["SnatEnabled"] == "on" else False,
            snat_policy=request.POST["SnatPolicy"],
            snat_to=request.POST["SnatTo"],
            dnat_enabled=True if request.POST["DnatEnabled"] == "on" else False,
            dnat_to=request.POST["DnatTo"],
            added_date="/Date(%s)/" % str(int(time() * 1000)),
            edited_date="/Date(%s)/" % str(int(time() * 1000))
        )
        new_policies.save()
        policy_id = Policies.objects.get(name=request.POST["Name"]).id
        record = [{
            'Author': str(request.user),
            "PoliciesId": policy_id,
            'Status': request.POST["Status"],
            'Log': request.POST["Log"],
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Action': request.POST["Action"],
            'Schedule': request.POST["Schedule"],
            'SourceZone': request.POST["SourceZone"],
            'DestinationZone': request.POST["DestinationZone"],
            'SourceNetwork': request.POST["SourceNetwork"],
            'DestinationNetwork': request.POST["DestinationNetwork"],
            'SourceService': request.POST["SourceService"],
            'DestinationService': request.POST["DestinationService"],
            'SnatEnabled': request.POST["SnatEnabled"],
            'SnatPolicy': request.POST["SnatPolicy"],
            'SnatTo': request.POST["SnatTo"],
            'DnatEnabled': request.POST["DnatEnabled"],
            'DnatTo': request.POST["DnatTo"],
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
def policies_read(request):
    policies = Policies.objects.all()
    records = []
    for each_policies in policies:
        records.append({
            "Author": each_policies.author.username,
            "PoliciesId": each_policies.id,
            "Status": each_policies.status,
            "Log": each_policies.log,
            "Name": each_policies.name,
            "Description": each_policies.desc,
            "Action": each_policies.action,
            "Schedule": each_policies.schedule,
            "SourceZone": each_policies.source_zone,
            "DestinationZone": each_policies.destination_zone,
            "SourceNetwork": each_policies.source_network,
            "DestinationNetwork": each_policies.destination_network,
            "SourceService": each_policies.source_service,
            "DestinationService": each_policies.destination_service,
            'SnatEnabled': each_policies.snat_enabled,
            'SnatPolicy': each_policies.snat_policy,
            'SnatTo': each_policies.snat_to,
            'DnatEnabled': each_policies.dnat_enabled,
            'DnatTo': each_policies.dnat_to,
            "AddedDate": each_policies.added_date,
            "EditedDate": each_policies.edited_date
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
def policies_update(request):
    try:
        requested_policies = Policies.objects.get(id=request.POST["PoliciesId"])

        requested_policies.status = True if request.POST["Status"] == "on" else False
        requested_policies.log = True if request.POST["Log"] == "on" else False
        requested_policies.name = request.POST["Name"]
        requested_policies.desc = request.POST["Description"]
        requested_policies.action = request.POST["Action"]
        requested_policies.schedule = request.POST["Schedule"]
        requested_policies.source_zone = request.POST["SourceZone"]
        requested_policies.destination_zone = request.POST["DestinationZone"]
        requested_policies.source_network = request.POST["SourceNetwork"]
        requested_policies.destination_network = request.POST["DestinationNetwork"]
        requested_policies.source_service = request.POST["SourceService"]
        requested_policies.destination_service = request.POST["DestinationService"]
        requested_policies.snat_enabled = True if request.POST["SnatEnabled"] == "on" else False
        requested_policies.snat_policy = request.POST["SnatPolicy"]
        requested_policies.snat_to = request.POST["SnatTo"]
        requested_policies.dnat_enabled = True if request.POST["DnatEnabled"] == "on" else False
        requested_policies.dnat_to = request.POST["DnatTo"]
        requested_policies.edited_date = "/Date(%s)/" % str(int(time() * 1000))

        requested_policies.save()

        record = [{
            'Author': str(request.user),
            'Status': request.POST["Status"],
            'Log': request.POST["Log"],
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Action': request.POST["Action"],
            'Schedule': request.POST["Schedule"],
            'SourceZone': request.POST["SourceZone"],
            'DestinationZone': request.POST["DestinationZone"],
            'SourceNetwork': request.POST["SourceZone"],
            'DestinationNetwork': request.POST["DestinationZone"],
            'SourceService': request.POST["SourceService"],
            'DestinationService': request.POST["DestinationService"],
            'SnatEnabled': request.POST["SnatEnabled"],
            'SnatPolicy': request.POST["SnatPolicy"],
            'SnatTo': request.POST["SnatTo"],
            'DnatEnabled': request.POST["DnatEnabled"],
            'DnatTo': request.POST["DnatTo"],
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
def policies_delete(request):
    try:
        requested_policies = Policies.objects.get(id=request.POST["PoliciesId"])
        requested_policies.delete()

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
def policies_view(request):
    requested_policies = Policies.objects.get(id=request.GET["PoliciesId"])
    record = [{
        "Author": requested_policies.author.username,
        "PoliciesId": requested_policies.id,
        "Status": requested_policies.status,
        "Log": requested_policies.log,
        "Name": requested_policies.name,
        "Description": requested_policies.desc,
        "Action": requested_policies.action,
        "Schedule": requested_policies.schedule,
        "SourceZone": requested_policies.source_zone,
        "SourceNetwork": requested_policies.source_network,
        "SourceService": requested_policies.source_service,
        "DestinationZone": requested_policies.destination_zone,
        "DestinationNetwork": requested_policies.destination_network,
        "DestinationService": requested_policies.destination_service,
        "SnatEnabled": requested_policies.snat_enabled,
        "SnatPolicy": requested_policies.snat_policy,
        "SnatTo": requested_policies.snat_to,
        "DnatEnabled": requested_policies.dnat_enabled,
        "DnatTo": requested_policies.dnat_to,
        "AddedDate": requested_policies.added_date,
        "EditedDate": requested_policies.edited_date
    }]

    parsed_json = record
    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response
