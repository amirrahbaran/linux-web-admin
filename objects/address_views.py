from .models import Address
import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from time import time

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
                     added_date = "Date(%s)"% str(int(time()*1000)),
                     edited_date = "Date(%s)"% str(int(time()*1000))
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
    
    # Writing JSON data
    with open('objects/conf/address.json', 'w') as f:
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
def address_update(request):
    if request.method == "POST":
        requested_address = Address.objects.get(id = request.POST["AddressId"])
        
        requested_address.name = request.POST["Name"]
        requested_address.desc = request.POST["Description"]
        requested_address.group_name = request.POST["Group"]
        requested_address.version = request.POST["Version"]
        requested_address.type = request.POST["Type"]
        requested_address.value = request.POST["Value"]
        requested_address.edited_date = "Date(%s)"% str(int(time()*1000))
        
        requested_address.save()
        
        # Reading data back
        with open('objects/conf/address.json', 'r') as f:
            parsed_json = json.load(f)
        
        for each_address in parsed_json:
            if each_address['AddressId'] == request.POST["AddressId"]:
                each_address['Name'] = request.POST["Name"]
                each_address['Description'] = request.POST["Description"]
                each_address['Group'] = request.POST["Group"]
                each_address['Version'] = request.POST["Version"]
                each_address['Type'] = request.POST["Type"]
                each_address['Value'] = request.POST["Value"]
                each_address['EditedDate'] = "Date(%s)"% str(int(time()*1000))

        # Writing JSON data
        with open('objects/conf/address.json', 'w') as f:
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
def address_delete(request):
    if request.method == "POST":
        requested_address = Address.objects.get(id = request.POST["AddressId"])
        
        requested_address.delete()
        
        # Reading data back
        with open('objects/conf/address.json', 'r') as f:
            parsed_json = json.load(f)
        
        for each_address in parsed_json:
            if each_address['AddressId'] == request.POST["AddressId"]:
                del each_address[each_address.index( 'AddressId' )]

        # Writing JSON data
        with open('objects/conf/address.json', 'w') as f:
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

