from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('client', 'Клиент'),
        ('specialist', 'Специалист'),
        ('admin', 'Администратор'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
    company = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)