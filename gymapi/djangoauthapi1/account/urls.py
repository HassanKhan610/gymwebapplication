from django.urls import path
from account.views import UserRegistrationView, UserLoginView, UserProfileView, UserChangePasswordView, SendPasswordResetEmailView, UserPasswordResetView, TrainerProfileCreateView, TrainerProfileListView, ProductViewSet, CreateOrderView, SubscriptionListCreateView, SubscriptionDetailsView, create_checkout_session


urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),

    path('create-trainer-profile/', TrainerProfileCreateView.as_view(), name='create-trainer-profile'),
    path('update-trainer-profile/', TrainerProfileCreateView.as_view(), name='update-trainer-profile'),

    path('trainers/', TrainerProfileCreateView.as_view(), name='trainer-create'),
    path('all-trainers/', TrainerProfileListView.as_view(), name='all-trainers-list'),


    # path('products/', ProductList.as_view(), name='product-list'),
    # path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    # path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    # # path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    # path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    # path('create-order/', OrderListCreateView.as_view(), name='create-order'),

    # path('products/', ProductViewSet.as_view(), name='product-list'),
    # path('create-order/', OrderViewSet.as_view(), name='create-order'),
    path('products/', ProductViewSet.as_view({'get': 'list', 'post': 'create'}), name='product-list'),
    # path('create-order/', OrderViewSet.as_view({'post': 'create'}), name='create-order'),
    path('create-order/', CreateOrderView.as_view({'post': 'create'}), name='create-order'),

    path('subscriptions/', SubscriptionListCreateView.as_view(), name='subscription-list-create'),
    path('subscriptions/details/', SubscriptionDetailsView.as_view(), name='subscription-details'),
    
    # path('create-checkout-session/', create_checkout_session, name='create-checkout-session'),
    path('create-checkout-session/', create_checkout_session, name='create-checkout-session'),




]
