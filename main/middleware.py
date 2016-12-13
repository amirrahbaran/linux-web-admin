from django.shortcuts import redirect
from netsecui import settings

class logincheck:
    def process_request(self, request):
        if request.path == settings.LOGIN_URL:
            return

        if request.user.is_authenticated():
            pass
        else:
            return redirect(settings.LOGIN_URL)