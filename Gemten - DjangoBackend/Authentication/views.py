from rest_framework.views import APIView
from rest_framework.response import Response

class UserViewSet(APIView):
    def get(self, request):
        return Response({"message": "Hello, Get!"})
    
    def post(self, request):
        return Response({"message": "Hello, Post!"})