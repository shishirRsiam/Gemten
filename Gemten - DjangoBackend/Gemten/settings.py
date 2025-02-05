import os
from . import credentials
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = credentials.SECRET_KEY

DEBUG = True

ALLOWED_HOSTS = ['*', '192.168.0.101', "http://192.168.0.101:8000", "http://127.0.0.1:8000"]


INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework', 'rest_framework.authtoken', 
    'Authentication', 'Email_Sent', 'Post', 'Connect', 'Chat',
]


CORS_ALLOW_CREDENTIALS = True  # If using authentication


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
}

ROOT_URLCONF = 'Gemten.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Gemten.wsgi.application'

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': credentials.DATABASE_ENGINE,
        'NAME': credentials.DATABASE_NAME,
        'USER': credentials.DATABASE_USER,
        'PASSWORD': credentials.DATABASE_PASSWORD, 
        'HOST': credentials.DATABASE_HOST,
        'PORT': credentials.DATABASE_PORT,
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Dhaka'

USE_I18N = True

USE_TZ = True

MEDIA_URL = '/Media/'
STATIC_URL = 'static/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'Media')
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


EMAIL_BACKEND = credentials.EMAIL_BACKEND
EMAIL_HOST = credentials.EMAIL_HOST
EMAIL_PORT = credentials.EMAIL_PORT
EMAIL_USE_TLS = credentials.EMAIL_USE_TLS

EMAIL_HOST_USER = credentials.EMAIL_HOST_USER
EMAIL_HOST_PASSWORD = credentials.EMAIL_HOST_PASSWORD




# Allow all origins for now (change in production)
CORS_ALLOW_ALL_ORIGINS = True  

# Or allow specific origins
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:19006",  # Expo
#     "http://10.0.2.2:8000",  # Android Emulator
#     "http://192.168.1.100:8000",  # Physical device (change IP)
# ]