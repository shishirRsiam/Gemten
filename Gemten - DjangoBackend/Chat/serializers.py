from rest_framework import serializers
from django.contrib.auth.models import User
from Authentication.serializers import UserSerializer

from rest_framework import serializers
from .models import Chat, Message
from django.contrib.auth.models import User

class ChatSerializer(serializers.ModelSerializer):
    receiver = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = '__all__'

    def get_receiver(self, obj):
        request_user = self.context['request'].user
        receiver = obj.user2 if obj.user1 == request_user else obj.user1
        return UserSerializer(receiver).data
    

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = '__all__'
