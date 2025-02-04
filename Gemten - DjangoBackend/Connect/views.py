from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from .models import FriendRequest, Friendship
from django.shortcuts import get_object_or_404
from .serializers import FriendRequestSerializer, FriendshipSerializer


class ConnectView(APIView):
    def post(self, request, user_id):
        viewed_user = get_object_or_404(User, id=user_id)

        sent_requst = request.query_params.get('sent_request', None)
        if sent_requst:                   
            friend_request = FriendRequest.objects.create(sender=request.user, receiver=viewed_user)
            return Response(FriendRequestSerializer(friend_request).data, status=status.HTTP_201_CREATED)
        
        cancel_requst = request.query_params.get('cancel_requst', None)
        if cancel_requst:
            friend_request = FriendRequest.objects.filter(sender=request.user, receiver=viewed_user).first()
            friend_request.cancel()
            return Response({'message': 'Friend request canceled!'}, status=status.HTTP_200_OK)
        
        accept_request = request.query_params.get('accept_request', None)
        friend_request = FriendRequest.objects.filter(sender=viewed_user, receiver=request.user).first()
        if accept_request:
            friend_request.accept()
            return Response({'message': 'Friend request accepted!'}, status=status.HTTP_200_OK)
        
        reject_request = request.query_params.get('reject_request', None)
        if reject_request:
            friend_request.reject()
            return Response({'message': 'Friend request rejected!'}, status=status.HTTP_200_OK)
        
        remove_friend = request.query_params.get('remove_friend', None)
        if remove_friend:
            friendship = Friendship.objects.filter(user1=request.user, user2=viewed_user).first()
            if not friendship:
                friendship = Friendship.objects.filter(user1=viewed_user, user2=request.user).first()
            friendship.delete()
            return Response({'message': 'Friend removed!'}, status=status.HTTP_200_OK)
            
        return Response({'message': 'Invalid request! try with connect/<user_id>?<sent_request|cancel_requst|accept_request|reject_request|remove_friend>=true'})


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
