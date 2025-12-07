# automator_project/settings.py
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = "change-me-for-production"

DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "AutoApp",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "Automate.urls"

TEMPLATES = []

WSGI_APPLICATION = "Automate.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "automate",
        "USER": "django",
        "PASSWORD": "password",
        "HOST": "127.0.0.1",
        "PORT": "3306",
    }
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
