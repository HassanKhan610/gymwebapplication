from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from datetime import timedelta
from django.utils import timezone


def upload_path(instance, filename):
    return '/'.join(['trainers', str(instance.user), filename])

def product_upload_path(instance, filename):
    # Use a different directory for product images
    return '/'.join(['products', str(instance.id), filename])


#custom user manager
class UserManager(BaseUserManager):
    def create_user(self, email, name, tc, password=None, password2=None, role='user'):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            tc=tc,
            role=role,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, tc, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            name=name,
            tc=tc,
            role='admin',
        )
        user.is_admin = True
        user.save(using=self._db)
        return user
#custom user model
class User(AbstractBaseUser):
    # ROLE_CHOICES = (
    #     ('user', 'User'),
    #     ('trainer', 'Trainer'),
    #     ('admin', 'Admin'),  # Add an 'admin' role option
    # )
    # role = models.CharField(max_length=7, choices=ROLE_CHOICES, default='user')
    USER = 'user'
    TRAINER = 'trainer'
    ROLE_CHOICES = [
        (USER, 'User'),
        (TRAINER, 'Trainer'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=USER)

    email = models.EmailField(
        verbose_name="Email",
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=200)
    tc = models.BooleanField()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "tc"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
        

class TrainerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    experience = models.CharField(max_length=200)
    speciality = models.CharField(max_length=200)
    image = models.ImageField(upload_to=upload_path, null=True, blank=True)

    def __str__(self):
        return self.user.name


class Product(models.Model):
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to=product_upload_path, blank=True, null=True)
    def __str__(self):
        return self.title

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)


class Subscription(models.Model):
    SUBSCRIPTION_CHOICES = [
        ('daily', 'Daily Subscription'),
        ('monthly', 'Monthly Subscription'),
        ('yearly', 'Yearly Subscription'),
    ]

    subscription_type = models.CharField(max_length=10, choices=SUBSCRIPTION_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subscription_time = models.DateTimeField(auto_now_add=True)
    payment_status = models.BooleanField(default=False)
    stripe_session_id = models.CharField(max_length=50, blank=True, null=True)

    
    expiration_date = models.DateTimeField()

    def save(self, *args, **kwargs):
        # set expiration date based on subscription type
        if not self.subscription_time:
            # Set subscription_time to the current time when it's not provided
            self.subscription_time = timezone.now()

        # set expiration date based on subscription type
        if self.subscription_type == 'daily':
            self.expiration_date = self.subscription_time + timezone.timedelta(days=1)
            self.amount = 10.00
        elif self.subscription_type == 'monthly':
            self.expiration_date = self.subscription_time + timezone.timedelta(days=30)
            self.amount = 20.00
        elif self.subscription_type == 'yearly':
            self.expiration_date = self.subscription_time + timezone.timedelta(days=365)
            self.amount = 30.00

        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.subscription_type} Subscription - {self.user.name}'
    
# order table
# user_id, 
# product id
# quantity
# amount
# pgAdmin tool database exploration tool