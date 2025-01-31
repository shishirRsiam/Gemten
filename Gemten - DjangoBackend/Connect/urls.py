from .views import *
from django.urls import path

urlpatterns = [
    path("send-request/<int:user_id>/", SendFriendRequestView.as_view(), name="send_friend_request"),
    path("accept-request/<int:request_id>/", AcceptFriendRequestView.as_view(), name="accept_friend_request"),
    path("reject-request/<int:request_id>/", RejectFriendRequestView.as_view(), name="reject_friend_request"),
    path("friend-requests/", FriendRequestListView.as_view(), name="friend_requests"),
    path("friends/", FriendListView.as_view(), name="friend_list"),
]
