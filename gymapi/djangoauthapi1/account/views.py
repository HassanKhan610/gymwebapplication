from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, UserChangePasswordSerializer, SendPasswordResetEmailSerializer, UserPasswordResetSerializer, TrainerProfileSerializer, TrainerProfileWithUserSerializer, ProductSerializer, OrderSerializer, SubscriptionSerializer, SubscriptionDetailsSerializer
from account.models import TrainerProfile, Product, Order, Subscription
from rest_framework import generics
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
import requests
from rest_framework.parsers import MultiPartParser, FormParser
import json
import stripe
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from django.conf import settings



#tokens manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED)
    

class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            token = get_tokens_for_user(user)
            return Response({'token':token, 'msg':'Login Successfull'}, status=status.HTTP_200_OK)
        else:
            return Response({'errors':{'non_field_errors':['email or password is not valid']}}, status=status.HTTP_404_NOT_FOUND)
    

class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
        serializer.is_valid(raise_exception=True)
        return Response({'msg':'Password Changed Successfull'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'msg':'Password Reset Link Send. Please Check Your Email'}, status=status.HTTP_200_OK)
    
class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
        serializer.is_valid(raise_exception=True)
        return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)

# class TrainerProfileCreateView(generics.CreateAPIView):
#     queryset = TrainerProfile.objects.all()
#     serializer_class = TrainerProfileSerializer
class TrainerProfileCreateView(APIView):
    # permission_classes = [IsAuthenticated]

    # def post(self, request, *args, **kwargs):
    #     serializer = TrainerProfileSerializer(data=request.data)

    #     if serializer.is_valid():
    #         if request.user.role != 'trainer':
    #             return Response({'detail': 'Only trainers can create profiles.'}, status=status.HTTP_403_FORBIDDEN)

    #         trainer_profile = TrainerProfile(
    #             user=request.user,
    #             experience=serializer.validated_data['experience'],
    #             speciality=serializer.validated_data['speciality']
    #         )
    #         trainer_profile.save()

    #         return Response({'detail': 'Trainer profile created successfully.'}, status=status.HTTP_201_CREATED)

    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        serializer = TrainerProfileSerializer(data=request.data)

        if serializer.is_valid():
            # Check if 'image' is 'null' and set it to None if so
            image = request.data.get('image')
            if image == 'null':
                request.data['image'] = None
                
            if request.user.role != 'trainer':
                return Response({'detail': 'Only trainers can create profiles.'}, status=status.HTTP_403_FORBIDDEN)

            trainer_profile = TrainerProfile.objects.create(
                user=request.user,
                experience=serializer.validated_data['experience'],
                speciality=serializer.validated_data['speciality'],
                image=request.data.get('image')
            )
            trainer_profile.save()

            return Response({'detail': 'Trainer profile created successfully.'}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        trainer_profile = TrainerProfile.objects.get(user=request.user)

        if request.user.role != 'trainer' or trainer_profile.user != request.user:
            return Response({'detail': 'You are not allowed to update this profile.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = TrainerProfileSerializer(trainer_profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Trainer profile updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TrainerProfileListView(generics.ListAPIView):
    # queryset = TrainerProfile.objects.all()
    # serializer_class = TrainerProfileSerializer
    queryset = TrainerProfile.objects.filter(user__role='trainer')
    serializer_class = TrainerProfileWithUserSerializer




class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# class OrderViewSet(viewsets.ModelViewSet):
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_order(request):
#     # Get user from the request
#     user = request.user

#     # Create an order
#     serializer = OrderSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(user=user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class CreateOrderView(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data)
    # permission_classes = [IsAuthenticated]

    # def post(self, request):
    #     # Get user from the request
    #     user = request.user

    #     order_data = {
    #         'user': user.id,
    #         'product_id': request.data.get('product_id'),  # Example: Get product ID from the request data
    #         'quantity': request.data.get('quantity'),  # Example: Get quantity from the request data
    #         'amount': request.data.get('amount'), 
    #         # Include other order details here
    #     }
    #     # Create an order
    #     serializer = OrderSerializer(data=order_data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({'message': 'Order created successfully'}, status=201)
    #     else:
    #         return Response(serializer.errors, status=400)
    # permission_classes = [IsAuthenticated]

#    def post(self, request):
#         try:
#             # Get the authenticated user from the request
#             user = request.user
#         except AttributeError:
#             # If the user is not authenticated, handle it as needed
#             return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
#         print(request.data)
#         # Assuming the product and quantity are sent in the request data
#         product_id = request.data.get('product')
#         quantity = request.data.get('quantity', 1)

#         # You might want to add validation to check if the product_id is valid
#         # and if the user has the necessary quantity in stock.

#         # Assuming you have a Product model with a price field
#         product = Product.objects.get(pk=product_id)
#         amount = product.price * quantity

#         order_data = {
#             'user': user.id,
#             'product': product_id,
#             'quantity': quantity,
#             'amount': amount,
#         }

#         serializer = OrderSerializer(data=order_data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SubscriptionListCreateView(generics.ListCreateAPIView):
    # queryset = Subscription.objects.all()
    # serializer_class = SubscriptionSerializer
    serializer_class = SubscriptionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SubscriptionDetailsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionDetailsSerializer

    def get_object(self):
        # Retrieve subscription details for the authenticated user
        user = self.request.user
        return Subscription.objects.filter(user=user).first()



stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(request):
    if request.method == 'POST':
        subscription_id = request.POST.get('subscription_id')  # Get subscription ID from frontend

        # Get subscription object from the database
        subscription = Subscription.objects.get(pk=subscription_id)

        # Create a Checkout Session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': subscription.subscription_type,
                    },
                    'unit_amount': int(subscription.amount * 100),  # Amount in cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='/payment/success',
            cancel_url='http://localhost:3000/payment/failure',
        )

        # return JsonResponse({'id': checkout_session.id})
        # return JsonResponse({'id': checkout_session.id, 'subscription_id': subscription_id})
        subscription.stripe_session_id = checkout_session.id
        subscription.save()

        return JsonResponse({'id': checkout_session.id})
