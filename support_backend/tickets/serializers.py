from rest_framework import serializers
from .models import Ticket
from accounts.serializers import UserSerializer

class TicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    specialist = UserSerializer(read_only=True)
    specialist_id = serializers.IntegerField(write_only=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'user', 'title', 'description', 'status', 'priority', 
                 'created_at', 'updated_at', 'specialist', 'specialist_id']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate(self, data):
        if self.instance and 'status' in data:
            if data['status'] == 'resolved' and not self.instance.specialist:
                raise serializers.ValidationError(
                    "Нельзя закрыть заявку без назначенного специалиста")
        return data