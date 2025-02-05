from django.contrib.auth.models import User
from django.db import models
from Chat.models import Chat, Message

class Friendship(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends1")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends2")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user1.username} - {self.user2.username}"


class FriendRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_requests")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_requests")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}"

    def accept(self):
        Friendship.objects.create(user1=self.sender, user2=self.receiver)
        Chat.objects.get_or_create(user1=self.sender, user2=self.receiver)
        self.delete()
        
    def reject(self):
        self.delete()
        
    def cancel(self):
        self.delete()

