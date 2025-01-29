from .email_sent import *
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from Authentication.serializers import UserSerializer, UserProfileSerializer
from .response import *


class EmailSentAPIView(APIView):
    def post(self, request):
        print('($)'*30)
        print('request.data ==>', request.data)

        email = request.data.get('email', None)
        resone = request.data.get('resone', None)

        user = User.objects.filter(email=email).first()
        print("user ==>", user)
        if not user:
            response = get_user_not_found_response()
            return Response(response)
        

        if resone == 'create_account':
            sent_email_verify_email(user)

        elif resone == 'reset_password':
            sent_password_reset_email(user)
        
        # http://localhost:8000/api/email/sent/?email_sent=forget_password&&email=shishir.siam01@gmail.com
        elif resone == 'forget_password':
            sent_forget_password_email(user)
        else:
            return Response({'message': 'Invalid resone! Please try with create_account, reset_password or forget_password.'}, status=400)
        
        return Response({'message': 'Email sent successfully!'}, status=200)

        user = UserSerializer(request.user)
        return Response({"user": user.data})
