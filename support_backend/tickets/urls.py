from django.urls import path
from .views import (
    TicketListCreateView,
    TicketDetailView,
    AssignTicketView,
)

urlpatterns = [
    path('', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('<int:pk>/assign/', AssignTicketView.as_view(), name='assign-ticket'),
]