from django.shortcuts import render
from networking.models import Ethernet

def networking(request):
    ethernets = Ethernet.objects.all()
    ethernetNumber = len(ethernets)
    
#     requestedPage = int(request.GET["ethReqPage"])
#     start = int(request.GET["ethStartIndex"])
    start = 0
#     pageSize = int(request.GET["ethPageSize"])
    pageSize = 5
    ethernetTotalPage = (start+pageSize) if (start+pageSize < ethernetNumber) else ethernetNumber
    return render(request, 'networking/main.html', {'ethernets':ethernets,'ethernetTotalPage':ethernetTotalPage})
