from django.shortcuts import render
from .models import Profile, Tunnel
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from time import time
from django.db.utils import IntegrityError
from netsecui.settings import RELEASE

release = RELEASE


@csrf_exempt
def profile_list(request):
    return render(request, 'vpn/profile_main.html',{'release':release})


@csrf_exempt
def profile_create(request):
    try:
        new_profile = Profile(
            author=request.user,
            name=request.POST["Name"],
            desc=request.POST["Description"],
            phase1_algo=request.POST["Phase1Algo"],
            phase1_auth=request.POST["Phase1Auth"],
            phase1_dhg=request.POST["Phase1Dhg"],
            phase1_lifetime=request.POST["Phase1LifeTime"],
            phase2_algo=request.POST["Phase2Algo"],
            phase2_auth=request.POST["Phase2Auth"],
            phase2_dhg=request.POST["Phase2Dhg"],
            phase2_lifetime=request.POST["Phase2LifeTime"],
            encap_type=request.POST["EncapType"],
            encap_local_endpoint=request.POST["EncapLocalEndpoint"],
            encap_remote_endpoint=request.POST["EncapRemoteEndpoint"],
            encap_service=request.POST["EncapService"],
            added_date="/Date(%s)/" % str(int(time() * 1000)),
            edited_date="/Date(%s)/" % str(int(time() * 1000))
        )
        new_profile.save()
        profile_object_id = Profile.objects.get(name=request.POST["Name"]).id
        record = [{
            'Author': str(request.user),
            "VpnProfileId": profile_object_id,
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Phase1Algo':request.POST["Phase1Algo"],
            'Phase1Auth':request.POST["Phase1Auth"],
            'Phase1Dhg':request.POST["Phase1Dhg"],
            'Phase1LifeTime':request.POST["Phase1LifeTime"],
            'Phase2Algo':request.POST["Phase2Algo"],
            'Phase2Auth':request.POST["Phase2Auth"],
            'Phase2Dhg':request.POST["Phase2Dhg"],
            'Phase2LifeTime':request.POST["Phase2LifeTime"],
            'EncapType':request.POST["EncapType"],
            'EncapLocalEndpoint':request.POST["EncapLocalEndpoint"],
            'EncapRemoteEndpoint':request.POST["EncapRemoteEndpoint"],
            'EncapService':request.POST["EncapService"],
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
def profile_read(request):
    profiles = Profile.objects.all()
    records = []
    for each_profile in profiles:
        records.append({
            "Author": each_profile.author.username,
            "VpnProfileId": each_profile.id,
            "Name": each_profile.name,
            "Description": each_profile.desc,
            'Phase1Algo':each_profile.phase1_algo,
            'Phase1Auth':each_profile.phase1_auth,
            'Phase1Dhg':each_profile.phase1_dhg,
            'Phase1LifeTime':each_profile.phase1_lifetime,
            'Phase2Algo':each_profile.phase2_algo,
            'Phase2Auth':each_profile.phase2_auth,
            'Phase2Dhg':each_profile.phase2_dhg,
            'Phase2LifeTime':each_profile.phase2_lifetime,
            'EncapType':each_profile.encap_type,
            'EncapLocalEndpoint':each_profile.encap_local_endpoint,
            'EncapRemoteEndpoint':each_profile.encap_remote_endpoint,
            'EncapService':each_profile.encap_service,
            "AddedDate": each_profile.added_date,
            "EditedDate": each_profile.edited_date
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
def profile_update(request):
    try:
        requested_profile = Profile.objects.get(id=request.POST["VpnProfileId"])

        requested_profile.name = request.POST["Name"]
        requested_profile.desc = request.POST["Description"]
        requested_profile.phase1_algo = request.POST["Phase1Algo"]
        requested_profile.phase1_auth = request.POST["Phase1Auth"]
        requested_profile.phase1_dhg = request.POST["Phase1Dhg"]
        requested_profile.phase1_lifetime = request.POST["Phase1LifeTime"]
        requested_profile.phase2_algo = request.POST["Phase2Algo"]
        requested_profile.phase2_auth = request.POST["Phase2Auth"]
        requested_profile.phase2_dhg = request.POST["Phase2Dhg"]
        requested_profile.phase2_lifetime = request.POST["Phase2LifeTime"]
        requested_profile.encap_type = request.POST["EncapType"]
        requested_profile.encap_local_endpoint = request.POST["EncapLocalEndpoint"]
        requested_profile.encap_remote_endpoint = request.POST["EncapRemoteEndpoint"]
        requested_profile.encap_service = request.POST["EncapService"]
        requested_profile.edited_date = "/Date(%s)/" % str(int(time() * 1000))

        requested_profile.save()

        record = [{
            'Author': str(request.user),
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Phase1Algo':request.POST["Phase1Algo"],
            'Phase1Auth':request.POST["Phase1Auth"],
            'Phase1Dhg':request.POST["Phase1Dhg"],
            'Phase1LifeTime':request.POST["Phase1LifeTime"],
            'Phase2Algo':request.POST["Phase2Algo"],
            'Phase2Auth':request.POST["Phase2Auth"],
            'Phase2Dhg':request.POST["Phase2Dhg"],
            'Phase2LifeTime':request.POST["Phase2LifeTime"],
            'EncapType':request.POST["EncapType"],
            'EncapLocalEndpoint':request.POST["EncapLocalEndpoint"],
            'EncapRemoteEndpoint':request.POST["EncapRemoteEndpoint"],
            'EncapService':request.POST["EncapService"],
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
def profile_delete(request):
    try:
        requested_profile = Profile.objects.get(id=request.POST["VpnProfileId"])
        requested_profile.delete()

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
def profile_view(request):
    requested_profile = Profile.objects.get(id=request.GET["VpnProfileId"])
    record = [{
        'Author': requested_profile.author.username,
        'VpnProfileId': requested_profile.id,
        'Name': requested_profile.name,
        'Description': requested_profile.desc,
        'Phase1Algo':requested_profile.phase1_algo,
        'Phase1Auth':requested_profile.phase1_auth,
        'Phase1Dhg':requested_profile.phase1_dhg,
        'Phase1LifeTime':requested_profile.phase1_lifetime,
        'Phase2Algo':requested_profile.phase2_algo,
        'Phase2Auth':requested_profile.phase2_auth,
        'Phase2Dhg':requested_profile.phase2_dhg,
        'Phase2LifeTime':requested_profile.phase2_lifetime,
        'EncapType':requested_profile.encap_type,
        'EncapLocalEndpoint':requested_profile.encap_local_endpoint,
        'EncapRemoteEndpoint':requested_profile.encap_remote_endpoint,
        'EncapService':requested_profile.encap_service,
        'AddedDate': requested_profile.added_date,
        'EditedDate': requested_profile.edited_date
    }]

    parsed_json = record
    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def profile_getlist(request):
    profiles = Profile.objects.all()
    records = []
    for each_profile in profiles:
        records.append({
            "value": each_profile.name,
            "name": each_profile.desc,
        })

    data = json.dumps(records)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response


@csrf_exempt
def tunnel_list(request):
    return render(request, 'vpn/tunnel_main.html',{'release':release})


@csrf_exempt
def tunnel_create(request):
    try:
        new_tunnel = Tunnel(
            author=request.user,
            status=True if request.POST["Status"] == "on" else False,
            dpd=True if request.POST["Dpd"] == "on" else False,
            name=request.POST["Name"],
            desc=request.POST["Description"],
            profile=request.POST["Profile"],
            local_network=request.POST["LocalNetwork"],
            local_endpoint=request.POST["LocalEndPoint"],
            local_id=request.POST["LocalId"],
            remote_network=request.POST["RemoteNetwork"],
            remote_endpoint=request.POST["RemoteEndPoint"],
            peer_id=request.POST["PeerId"],
            auth_type=request.POST["AuthType"],
            pre_key=request.POST["PreKey"],
            pri_key=request.POST["PriKey"],
            pub_key=request.POST["PubKey"],
            added_date="/Date(%s)/" % str(int(time() * 1000)),
            edited_date="/Date(%s)/" % str(int(time() * 1000))
        )
        new_tunnel.save()
        tunnel_object_id = Tunnel.objects.get(name=request.POST["Name"]).id
        record = [{
            'Author': str(request.user),
            'VpnTunnelId': tunnel_object_id,
            'Status':request.POST["Status"],
            'Dpd':request.POST["Dpd"],
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Profile':request.POST["Profile"],
            'LocalNetwork':request.POST["LocalNetwork"],
            'LocalEndPoint':request.POST["LocalEndPoint"],
            'LocalId':request.POST["LocalId"],
            'RemoteNetwork':request.POST["RemoteNetwork"],
            'RemoteEndPoint':request.POST["RemoteEndPoint"],
            'PeerId':request.POST["PeerId"],
            'AuthType':request.POST["AuthType"],
            'PreKey':request.POST["PreKey"],
            'PriKey':request.POST["PriKey"],
            'PubKey':request.POST["PubKey"],
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
def tunnel_read(request):
    tunnels = Tunnel.objects.all()
    records = []
    for each_tunnel in tunnels:
        records.append({
            'Author': each_tunnel.author.username,
            'VpnTunnelId': each_tunnel.id,
            'Status':each_tunnel.status,
            'Dpd':each_tunnel.dpd,
            'Name': each_tunnel.name,
            'Description': each_tunnel.desc,
            'Profile':each_tunnel.profile,
            'LocalNetwork':each_tunnel.local_network,
            'LocalEndPoint':each_tunnel.local_endpoint,
            'LocalId':each_tunnel.local_id,
            'RemoteNetwork':each_tunnel.remote_network,
            'RemoteEndPoint':each_tunnel.remote_endpoint,
            'PeerId':each_tunnel.peer_id,
            'AuthType':each_tunnel.auth_type,
            'PreKey':each_tunnel.pre_key,
            'PriKey':each_tunnel.pri_key,
            'PubKey':each_tunnel.pub_key,
            'AddedDate': each_tunnel.added_date,
            'EditedDate': each_tunnel.edited_date
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
def tunnel_update(request):
    try:
        requested_tunnel = Tunnel.objects.get(id=request.POST["VpnTunnelId"])
        requested_tunnel.status = True if request.POST["Status"] == "on" else False,
        requested_tunnel.dpd = True if request.POST["Dpd"] == "on" else False,
        requested_tunnel.name = request.POST["Name"]
        requested_tunnel.desc = request.POST["Description"]
        requested_tunnel.profile = request.POST["Profile"]
        requested_tunnel.local_network = request.POST["LocalNetwork"]
        requested_tunnel.local_endpoint = request.POST["LocalEndPoint"]
        requested_tunnel.local_id = request.POST["LocalId"]
        requested_tunnel.remote_network = request.POST["RemoteNetwork"]
        requested_tunnel.remote_endpoint = request.POST["RemoteEndPoint"]
        requested_tunnel.peer_id = request.POST["PeerId"]
        requested_tunnel.auth_type = request.POST["AuthType"]
        requested_tunnel.pre_key = request.POST["PreKey"]
        requested_tunnel.pri_key = request.POST["PriKey"]
        requested_tunnel.pub_key = request.POST["PubKey"]
        requested_tunnel.edited_date = "/Date(%s)/" % str(int(time() * 1000))

        requested_tunnel.save()

        record = [{
            'Author': str(request.user),
            'Status':request.POST["Status"],
            'Dpd':request.POST["Dpd"],
            'Name': request.POST["Name"],
            'Description': request.POST["Description"],
            'Profile':request.POST["Profile"],
            'LocalNetwork':request.POST["LocalNetwork"],
            'LocalEndPoint':request.POST["LocalEndPoint"],
            'LocalId':request.POST["LocalId"],
            'RemoteNetwork':request.POST["RemoteNetwork"],
            'RemoteEndPoint':request.POST["RemoteEndPoint"],
            'PeerId':request.POST["PeerId"],
            'AuthType':request.POST["AuthType"],
            'PreKey':request.POST["PreKey"],
            'PriKey':request.POST["PriKey"],
            'PubKey':request.POST["PubKey"],
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
def tunnel_delete(request):
    try:
        requested_tunnel = Tunnel.objects.get(id=request.POST["VpnTunnelId"])
        requested_tunnel.delete()

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
def tunnel_view(request):
    requested_tunnel = Tunnel.objects.get(id=request.GET["VpnTunnelId"])
    record = [{
        'Author': requested_tunnel.author.username,
        'VpnTunnelId': requested_tunnel.id,
        'Status':requested_tunnel.status,
        'Dpd':requested_tunnel.dpd,
        'Name': requested_tunnel.name,
        'Description': requested_tunnel.desc,
        'Profile':requested_tunnel.profile,
        'LocalNetwork':requested_tunnel.local_network,
        'LocalEndPoint':requested_tunnel.local_endpoint,
        'LocalId':requested_tunnel.local_id,
        'RemoteNetwork':requested_tunnel.remote_network,
        'RemoteEndPoint':requested_tunnel.remote_endpoint,
        'PeerId':requested_tunnel.peer_id,
        'AuthType':requested_tunnel.auth_type,
        'PreKey':requested_tunnel.pre_key,
        'PriKey':requested_tunnel.pri_key,
        'PubKey':requested_tunnel.pub_key,
        'AddedDate': requested_tunnel.added_date,
        'EditedDate': requested_tunnel.edited_date
    }]

    parsed_json = record
    data = json.dumps(parsed_json)

    response = HttpResponse()
    response['Content-Type'] = "application/json"
    response.write(data)
    return response
