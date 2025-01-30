from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, PostMedia, Comment
from Authentication.serializers import UserSerializer


class PostMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostMedia
        fields = ['id', 'file', 'media_type', 'uploaded_at']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'updated_at']


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  
    media = PostMediaSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'media', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def create(self, validated_data):
        media_data = validated_data.pop('media', [])  
        post = Post.objects.create(**validated_data)  
        
        for media in media_data:
            PostMedia.objects.create(post=post, **media)  

        return post