from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    user1 = models.ForeignKey(User, related_name='chats_as_user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name='chats_as_user2', on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Chat between {self.user1.username} and {self.user2.username}"
    
    class Meta:
        unique_together = ['user1', 'user2']
        

class Message(models.Model):
    content = models.TextField()
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)    

    def __str__(self):
        return f"Message from {self.sender.username} in chat with {self.chat.user1.username if self.sender != self.chat.user1 else self.chat.user2.username}"