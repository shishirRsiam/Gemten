from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, UserProfileSerializer
from django.utils.http import urlsafe_base64_decode
from .response import *
from . models import UserProfile, User
from django.contrib.auth.tokens import default_token_generator

class UserViewSet(APIView):
    def get(self, request):
        id = request.query_params.get("id", None)
        if id:
            user_profile = UserProfile.objects.get(id=id)
            user_profile_serializer = UserProfileSerializer(user_profile)
            return Response({"user": user_profile_serializer.data})
        
        user_profile_serializer = UserProfileSerializer(UserProfile.objects.all(), many=True)
        return Response({"user": user_profile_serializer.data})
    
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
            email=email, is_active=False,
        )
        user.save()

        return user, None
    
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