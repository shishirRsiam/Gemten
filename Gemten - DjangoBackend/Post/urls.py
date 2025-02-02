from django.urls import path
from .views import PostAPIView, CommentAPIView, LikePostAPIView

urlpatterns = [
    path('posts/', PostAPIView.as_view(), name='post_list_create'),
    path('posts/<int:post_id>/', PostAPIView.as_view(), name='post_detail'),
    path('posts/<int:post_id>/like/', LikePostAPIView.as_view(), name='like_post'), 
    path('posts/comments/', CommentAPIView.as_view(), name='post_comments'),
    path('posts/<int:post_id>/comments/', CommentAPIView.as_view(), name='post_comments'),
    path('posts/<int:post_id>/comments/<int:comment_id>/', CommentAPIView.as_view(), name='post_comments'),
]
