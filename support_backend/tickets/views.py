from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Ticket
from .serializers import TicketSerializer
from accounts.models import CustomUser

class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'client':
            return Ticket.objects.filter(user=user)
        elif user.role == 'specialist':
            return Ticket.objects.filter(specialist=user)
        return Ticket.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        instance = serializer.save()
        if 'status' in serializer.validated_data:
            self._send_status_notification(instance)

    def _send_status_notification(self, ticket):
        # Здесь можно добавить логику отправки уведомлений
        pass

class AssignTicketView(generics.UpdateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        ticket = self.get_object()
        specialist_id = request.data.get('specialist')
        
        try:
            specialist = CustomUser.objects.get(id=specialist_id, role='specialist')
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'Специалист не найден'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ticket.specialist = specialist
        ticket.status = 'in_progress'
        ticket.save()
        
        serializer = self.get_serializer(ticket)
        return Response(serializer.data)