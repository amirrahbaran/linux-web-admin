from .models import Protocol
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from time import time

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
                     added_date = "Date(%s)"% str(int(time()*1000)),
                     edited_date = "Date(%s)"% str(int(time()*1000))
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
                  'AddedDate': "Date(%s)"% str(int(time()*1000)),
                  'EditedDate': "Date(%s)"% str(int(time()*1000))
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
    
    # Writing JSON data
    with open('objects/conf/protocol.json', 'w') as f:
        json.dump(parsed_json, f)

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
        requested_protocol.edited_date = "Date(%s)"% str(int(time()*1000))
        
        requested_protocol.save()
        
        # Reading data back
        with open('objects/conf/protocol.json', 'r') as f:
            parsed_json = json.load(f)
        
        for each_protocol in parsed_json:
            if each_protocol['ProtocolId'] == request.POST["ProtocolId"]:
                each_protocol['Name'] = request.POST["Name"]
                each_protocol['Description'] = request.POST["Description"]
                each_protocol['Group'] = request.POST["Group"]
                each_protocol['Protocol'] = request.POST["Protocol"]
                each_protocol['Direction'] = request.POST["Direction"]
                each_protocol['Value'] = request.POST["Value"]
                each_protocol['EditedDate'] = "Date(%s)"% str(int(time()*1000))

        # Writing JSON data
        with open('objects/conf/protocol.json', 'w') as f:
            json.dump(parsed_json, f)
        
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
        
        # Reading data back
        with open('objects/conf/protocol.json', 'r') as f:
            parsed_json = json.load(f)
        
        for each_protocol in parsed_json:
            if each_protocol['ProtocolId'] == request.POST["ProtocolId"]:
                del each_protocol[each_protocol.index( 'ProtocolId' )]

        # Writing JSON data
        with open('objects/conf/protocol.json', 'w') as f:
            json.dump(parsed_json, f)
        
        parsed_json = {
                   'Result': "OK",
                   }

        data = json.dumps(parsed_json)

        response = HttpResponse()
        response['Content-Type'] = "application/json"
        response.write(data)
        return response    
