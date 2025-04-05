from django.db import models
from accounts.models import CustomUser
from tickets.models import Ticket

class Message(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='chat_files/', blank=True, null=True)

    def __str__(self):
        return f"{self.sender.email}: {self.text[:20]}..."