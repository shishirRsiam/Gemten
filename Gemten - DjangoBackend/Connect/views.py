from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from .models import FriendRequest, Friendship
from django.shortcuts import get_object_or_404
from .serializers import FriendRequestSerializer, FriendshipSerializer


class SendFriendRequestView(APIView):
    def post(self, request, user_id):
        sender = request.user
        receiver = get_object_or_404(User, id=user_id)

        friend_request = FriendRequest.objects.create(sender=sender, receiver=receiver)
        return Response(FriendRequestSerializer(friend_request).data, status=status.HTTP_201_CREATED)


class AcceptFriendRequestView(APIView):
    def post(self, request, request_id):
        friend_request = get_object_or_404(FriendRequest, id=request_id)

        friend_request.accept()
        return Response({"message": "Friend request accepted!"}, status=status.HTTP_200_OK)


class RejectFriendRequestView(APIView):
    def delete(self, request, request_id):
        friend_request = get_object_or_404(FriendRequest, id=request_id, receiver=request.user)

        friend_request.reject()
        return Response({"message": "Friend request rejected!"}, status=status.HTTP_200_OK)


class FriendRequestListView(APIView):
    def get(self, request):
        friend_requests = FriendRequest.objects.filter(receiver=request.user, is_accepted=False)
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FriendListView(APIView):
    def get(self, request):
        friendships = Friendship.objects.filter(user1=request.user) | Friendship.objects.filter(user2=request.user)
        serializer = FriendshipSerializer(friendships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
