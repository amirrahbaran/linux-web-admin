from django.shortcuts import render
from django.core.context_processors import request

def dashboard(request):
    return render(request, 'dashboard/main.html', {})
