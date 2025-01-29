from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginApiView.as_view(), name='login'),
    path('logout/', LogoutApiView.as_view(), name='logout'),
    path('user/', UserViewSet.as_view(), name='user'),
    path('account/email/verify/<str:uid>/<str:token>/', EmailVerifyAPIView.as_view(), name='email_verify'),
]