import mimetypes
from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField(blank=True, null=True)
    likes = models.ManyToManyField(User, related_name="liked_posts", blank=True)
    views = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def total_likes(self):
        return self.likes.count()
    
    def total_comments(self):
        return self.comments.count()

    def get_all_comments(self):
        return self.comments.all()
    
    def get_all_likes(self):
        return self.likes.all()
    
    def get_all_media(self):
        return self.media.all()
    
    def user_liked_post(self, user):
        return self.likes.filter(id=user.id).exists()

    def __str__(self):
        return f"Post by {self.user.username} at {self.created_at}"


class PostMedia(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="media")
    file = models.FileField(upload_to="post_media/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.media_type.capitalize()} for Post ID {self.post.id}"
    

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments") 
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField() 

    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.id}"
    
