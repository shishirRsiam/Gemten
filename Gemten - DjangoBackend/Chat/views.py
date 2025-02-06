from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from django.contrib.auth.models import User

class ChatListView(APIView):
    def get(self, request):
        print("(v)"*30)
        print('request.user ==>', request.user)
        chats = Chat.objects.filter(user1=request.user) | Chat.objects.filter(user2=request.user)

        serializer = ChatSerializer(chats, many=True, context={'request': request})
        return Response(serializer.data)

class MessageView(APIView):
    def get(self, request, chat_id):
        print('chat_id ==>', chat_id)
        print('request.user ==>', request.user)
        chat = Chat.objects.get(id=chat_id)
        serializer = MessageSerializer(chat.messages, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request, chat_id):
        chat = Chat.objects.get(id=chat_id)
        chat.last_message = request.data.get('content')
        chat.save()
        message = Message.objects.create(chat=chat, sender=request.user, content=request.data.get('content'))
        return Response(MessageSerializer(message, context={'request': request}).data, status=status.HTTP_201_CREATED)
