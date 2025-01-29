from django.urls import path
from .views import *

urlpatterns = [
    path('user/', UserViewSet.as_view(), name='user'),
    path('account/email/verify/<str:uid>/<str:token>/', EmailVerifyAPIView.as_view(), name='email_verify'),
]