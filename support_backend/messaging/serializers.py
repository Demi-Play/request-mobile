from rest_framework import serializers
from .models import Message
from accounts.models import CustomUser

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Message
        fields = '__all__'