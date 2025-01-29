from django.urls import path
from .views import EmailSentAPIView

urlpatterns = [
    path('email/sent/', EmailSentAPIView.as_view(), name='email_sent'),
]