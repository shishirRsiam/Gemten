from django.contrib.auth.models import User
from django.db import models

class FriendRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_requests")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_requests")
    is_accepted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}"

    def accept(self):
        Friendship.objects.create(user1=self.sender, user2=self.receiver)
        self.is_accepted = True
        self.save()

    def reject(self):
        self.delete()

class Friendship(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends1")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friends2")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user1.username} - {self.user2.username}"
