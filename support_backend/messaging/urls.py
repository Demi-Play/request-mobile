from django.urls import path
from .views import MessageListView

urlpatterns = [
    path('<int:ticket_id>/messages/', MessageListView.as_view(), name='ticket-messages'),
]