from django.contrib import admin
from .models import Ethernet
from .models import Routing


admin.site.register(Ethernet)
admin.site.register(Routing)