from .response import *
from Connect.models import Friendship
from . models import UserProfile, User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import login, logout
from rest_framework.authtoken.models import Token
from django.utils.http import urlsafe_base64_decode
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, UserProfileSerializer
from django.contrib.auth.tokens import default_token_generator
from Post.serializers import PostSerializer

class UserViewSet(APIView):
    def get(self, request, profile_id=None):
        all_user = request.query_params.get("all_user", None)
        if all_user:
            user_profile_serializer = UserProfileSerializer(UserProfile.objects.all(), many=True)
            return Response({"status": True, "all_user": user_profile_serializer.data})
        
        if profile_id:
            print('($)'*30)
            print('profile_id ==>', profile_id)
            user = User.objects.get(id=profile_id)
            user_profile_serializer = UserProfileSerializer(user.userprofile)
            # respose = get_user_profile_response(user_profile_serializer)
            return Response({"status": True, "user_profile": user_profile_serializer.data})
        
        user_profile_serializer = UserProfileSerializer(request.user.userprofile)
        friends_serializer = UserProfileSerializer(self.get_friends(request.user), many=True)
        post_serializer = PostSerializer(request.user.posts.all(), many=True, context={'request': request})
        response = get_user_profile_response(user_profile_serializer, post_serializer, friends_serializer)
        return Response(response)
    
    def post(self, request):
        phone_no = request.data.get("phone_no")
        user = UserProfile.objects.filter(phone_no=phone_no)
        if user:
            response = get_username_or_email_or_phone_already_exists_response('phone no')
            return Response(data=response, status=400)

        user, response = self.create_user(request)
        if not user:
            return response        
        
        user_profile = UserProfile.objects.create(
            user=user, phone_no=phone_no,
            date_of_birth=request.data.get("date_of_birth"),
            gender=request.data.get("gender"),
        )
        user_profile.save()        
        
        user_profile_serializer = UserProfileSerializer(user_profile)
        response = get_use_creation_response(user_profile_serializer)

        return Response(response)

    def create_user(self, request):
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")

        email = request.data.get("email")
        username = request.data.get("username")
        password = request.data.get("password")

        user = User.objects.filter(username=username).first()
        if user:
            response = get_username_or_email_or_phone_already_exists_response('username')
            return None, Response(data=response, status=400)

        user = User.objects.filter(email=email).first()
        if user:
            response = get_username_or_email_or_phone_already_exists_response('email')
            return None, Response(data=response, status=400)
        
        user = User.objects.create_user(
            first_name=first_name, last_name=last_name,
            username=username, password=password,
            email=email, is_active=True,
        )
        user.save()

        return user, None
    
    def get_friends(self, user):
        friendships = Friendship.objects.filter(user1=user) | Friendship.objects.filter(user2=user)
        friends = [friendship.user1 if friendship.user2 == user else friendship.user2 for friendship in friendships]
        print(friends)
        return friends

class EmailVerifyAPIView(APIView):
    def get(self, request, uid, token):
        id = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(id=id)
        if user:
            if user.is_active:
                response = get_already_account_activation_response()
                return Response(response, status=200)
            
            elif default_token_generator.check_token(user, token):
                user.is_active = True
                user.save()

                response = get_successful_account_activation_response()
                return Response(response, status=200)

        response = get_failed_account_activation_response()
        return Response(response, status=400)


class LoginApiView(APIView):
    def post(self, request):
        password = request.data.get('password')
        user_info = request.data.get('user_info')
        user = User.objects.filter(username=user_info).first()
        if not user:
            user = User.objects.filter(email=user_info).first()
        if not user:
            user = User.objects.filter(userprofile__phone_no=user_info).first()

        if user and user.check_password(password):
            if not user.is_active:
                response = get_account_not_active_response()
                return Response(response, status=400)
            
            token, _ = Token.objects.get_or_create(user=user) 
            userinfo_serializer = UserProfileSerializer(user.userprofile)
            response = get_successful_login_response(userinfo_serializer, token)
            return Response(response, status=200)
        
        response = get_failed_login_response()
        return Response(response, status=400)
    

class LogoutApiView(APIView):
    def get(self, request):
        try:
            request.user.auth_token.delete()
            return Response({"message": "Logout successful"}, status=200)
        except Exception as e:
            return Response({"error": "Something went wrong"}, status=500)  

