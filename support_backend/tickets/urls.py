from django.urls import path
from .views import (
    TicketListCreateView,
    TicketDetailView,
    AssignTicketView,
    AllTicketsListView,
    TicketStatusUpdateView,
)

urlpatterns = [
    path('', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('all/', AllTicketsListView.as_view(), name='all-tickets'),
    path('<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('<int:pk>/assign/', AssignTicketView.as_view(), name='assign-ticket'),
    path('<int:pk>/status/', TicketStatusUpdateView.as_view(), name='update-ticket-status'),
]