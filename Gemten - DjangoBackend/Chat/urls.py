from django.urls import path
from .views import *

urlpatterns = [
    path('chats/', ChatListView.as_view(), name='chat_list'),
    path('chats/<int:chat_id>/messages/', MessageView.as_view(), name='get_message'),
]