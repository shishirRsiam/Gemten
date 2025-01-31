from .views import *
from django.urls import path


urlpatterns = [
    path('user/', UserViewSet.as_view(), name='user'),
    path('login/', LoginApiView.as_view(), name='login'),
    path('logout/', LogoutApiView.as_view(), name='logout'),
    path('auth/', UserViewSet.as_view(), name='logged_in_user'),
    path('user/<str:profile_id>/', UserViewSet.as_view(), name='user info'),
    path('account/email/verify/<str:uid>/<str:token>/', EmailVerifyAPIView.as_view(), name='email_verify'),
]