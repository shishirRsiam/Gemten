from .views import *
from django.urls import path

urlpatterns = [
    path("friends/", FriendListView.as_view(), name="friend_list"),
    path("friend/requests/", FriendRequestListView.as_view(), name="friend_requests"),
    path("connect/<int:user_id>/", ConnectView.as_view(), name="connect"),
]