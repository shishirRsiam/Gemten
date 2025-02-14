from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, PostMedia, Comment
from Authentication.serializers import UserSerializer


class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMedia
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'updated_at']


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  
    is_liked = serializers.SerializerMethodField()  
    likes_count = serializers.SerializerMethodField()  
    # media = PostMediaSerializer(many=True, required=False)
    # comments = CommentSerializer(many=True, required=False)
    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_likes_count(self, obj):
        obj.views += 1
        obj.save()
        return obj.likes.count()
    
    
    def get_is_liked(self, obj):
        user = self.context['request'].user
        if user:
            return obj.likes.filter(id=user.id).exists()
        return False