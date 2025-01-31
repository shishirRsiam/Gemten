from django.db import models
from Connect.models import Friendship
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_no = models.CharField(max_length=16) 
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20)

    profile_pic = models.ImageField(upload_to='profile_pics', default='profile_pics/default.png', null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    bio = models.TextField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.user.username
    