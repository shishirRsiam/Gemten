from rest_framework import serializers
from django.contrib.auth.models import User
from Authentication.serializers import UserSerializer

from rest_framework import serializers
from .models import Chat, Message
from django.contrib.auth.models import User

class ChatSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = '__all__'
