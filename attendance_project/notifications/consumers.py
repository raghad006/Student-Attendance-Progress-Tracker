import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("WebSocket connection attempt received")
        
        query_string = self.scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]
        
        if not token:
            print("No token provided")
            await self.close()
            return
        
        user = await self.get_user_from_token(token)
        
        if not user:
            print("Invalid token")
            await self.close()
            return
        
        self.scope['user'] = user
        self.user = user
        
        self.group_name = f"user_{user.id}"
        
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        
        await self.accept()
        print(f"WebSocket connected for user: {user.username} (ID: {user.id})")
        
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f'Connected as {user.username}'
        }))

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        print(f"🔌 WebSocket disconnected with code: {close_code}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print(f"Received WebSocket message: {data}")
            
            if data.get('type') == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'pong',
                    'timestamp': data.get('timestamp')
                }))
                
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")

    async def send_notification(self, event):
        """Send notification to WebSocket client"""
        notification_data = event.get('notification', {})
        print(f"Sending notification via WebSocket: {notification_data}")
        
        await self.send(text_data=json.dumps({
            'type': 'new_notification',
            'notification': notification_data
        }))

    async def notification_read(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification_read',
            'notification_id': event.get('notification_id')
        }))

    async def all_notifications_read(self, event):
        await self.send(text_data=json.dumps({
            'type': 'all_notifications_read'
        }))

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            
            user = User.objects.get(id=user_id)
            return user
            
        except Exception as e:
            print(f"Token validation error: {e}")
            return None