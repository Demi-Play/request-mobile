from django.db import models
from accounts.models import CustomUser

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Открыта'),
        ('in_progress', 'В работе'),
        ('resolved', 'Решена'),
        ('closed', 'Закрыта'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Низкий'),
        ('medium', 'Средний'),
        ('high', 'Высокий'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tickets')
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    specialist = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets'
    )

    def __str__(self):
        return self.title