from rest_framework import serializers
from .models import Ticket
from accounts.models import CustomUser

class TicketSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    specialist = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(role='specialist'),
        allow_null=True
    )

    class Meta:
        model = Ticket
        fields = '__all__'