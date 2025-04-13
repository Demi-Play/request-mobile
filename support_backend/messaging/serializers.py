from rest_framework import serializers
from .models import Message
from accounts.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'ticket', 'sender', 'text', 'timestamp', 'file']
        read_only_fields = ['sender', 'timestamp']