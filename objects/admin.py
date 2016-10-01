from django.contrib import admin
from .models import Address
from .models import Schedule
from .models import Zone
from .models import Protocol


admin.site.register(Address)
admin.site.register(Schedule)
admin.site.register(Zone)
admin.site.register(Protocol)

