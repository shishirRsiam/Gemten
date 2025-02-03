from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Post, Comment, PostMedia
from .serializers import PostSerializer, CommentSerializer

class PostAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, post_id=None):
        if post_id:
            post = Post.objects.get(id=post_id)
            serializer = PostSerializer(post, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            post = serializer.save(user=request.user)
            self.upload_media(post, request.FILES.getlist('media'))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def upload_media(self, post, media_data):
        for media in media_data:
            PostMedia.objects.create(post=post, file=media) 
    
    def delete(self, request, post_id):
        post = Post.objects.get(id=post_id)
        post.delete()
        return Response({"message": "Post deleted successfully"}, status=status.HTTP_200_OK)

    def put(self, request, post_id):
        post = Post.objects.get(id=post_id)
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, post_id, comment_id=None):
        if comment_id:
            comment = Comment.objects.get(id=comment_id)
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        comments = Comment.objects.filter(post_id=post_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, post_id=None):
        serializer = CommentSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, post_id, comment_id):
        comment = Comment.objects.get(id=comment_id)
        comment.delete()
        return Response({"message": "Comment deleted successfully"}, status=status.HTTP_200_OK)

    def put(self, request, comment_id):
        comment = Comment.objects.get(id=comment_id)
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikePostAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = Post.objects.get(id=post_id)
        user = request.user
        if user in post.likes.all():
            post.likes.remove(user)  # Unlike
            liked = False
        else:
            post.likes.add(user)  # Like
            liked = True

        return Response({"liked": liked, "total_likes": post.total_likes()}, status=status.HTTP_200_OK)

