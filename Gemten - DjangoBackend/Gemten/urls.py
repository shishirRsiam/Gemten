from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('Authentication.urls')),
    path('api/', include('Email_Sent.urls')),
]
