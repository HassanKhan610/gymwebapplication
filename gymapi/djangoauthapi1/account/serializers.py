from xml.dom import ValidationErr
from rest_framework import serializers
from account.models import User, TrainerProfile, Product, Order, Subscription
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from account.utils import Util
from urllib.parse import quote, unquote


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
    role = serializers.CharField(max_length=20, default='user', write_only=True)
    class Meta:
        model=User
        fields=["email", "name", "password", "password2", "tc", "role"]
        extra_kwargs={
            'password':{'write_only':True}
        }
    #validating pass and pass2
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("password and confirm pass doesnt match")
        return attrs
    
    def create(self, validated_data):
        role = validated_data.pop('role', 'user')
        user = User.objects.create_user(**validated_data)
        user.role = role
        user.save()
        return user
        # return User.objects.create_user(**validated_data)
    

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role']

class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type':'password2'}, write_only=True)
    class Meta:
        fields = ['password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError("password and confirm pass doesnt match")
        user.set_password(password)
        user.save()
        return attrs
    
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email = email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            print('Encoded UID', uid)
            token = PasswordResetTokenGenerator().make_token(user)
            print('password Reset Token', token)
            link = 'http://localhost:3000/api/user/reset/'+uid+'/'+token
            print('Password Reset Link', link)
            #send email
            body = 'Click Following Link To Reset Your Password  '+link
            data = {
                'subject': 'Reset Your password',
                'body': body,
                'to_email': user.email
            }
            # Util.send_email(data)
            return attrs
        else:
            raise ValidationErr('You are not a registered User')
        

class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type':'password2'}, write_only=True)
    class Meta:
        fields = ['password', 'password2']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            if password != password2:
                raise serializers.ValidationError("password and confirm pass doesnt match")
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise ValidationErr('Token is not valid or expired')
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            PasswordResetTokenGenerator().check_token(user, token)
            raise ValidationErr('Token is not valid or expired')


class TrainerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerProfile
        # fields = '__all__'
        fields = ('id', 'experience', 'speciality', 'image')

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     # Replace @ with another character and then encode
    #     email_without_at = instance.user.email.replace('@', '-')
    #     representation['image'] = quote(email_without_at) + '/' + instance.image.name
    #     return representation

class TrainerProfileWithUserSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name')
    user_email = serializers.CharField(source='user.email')
    # Add any other fields you want to include from the User model

    class Meta:
        model = TrainerProfile
        fields = ['id', 'user_name', 'user_email', 'experience', 'speciality', 'user_id', 'image']


class ProductIdSerializer(serializers.ListSerializer):
    child = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        # fields = '__all__'
        fields = ['id', 'title', 'price', 'description', 'image']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['user', 'product', 'quantity', 'amount']

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'subscription_type', 'user', 'subscription_time', 'amount', 'payment_status']

class SubscriptionDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['subscription_type', 'user', 'subscription_time', 'expiration_date']  # Add other fields as needed

        