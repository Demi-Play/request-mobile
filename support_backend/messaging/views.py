from rest_framework import generics, permissions
from .models import Message
from .serializers import MessageSerializer

class MessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        ticket_id = self.kwargs['ticket_id']
        return Message.objects.filter(ticket_id=ticket_id)