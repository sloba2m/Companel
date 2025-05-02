import type { Message, Conversation } from 'src/types/chat';
import type { Notification } from 'src/types/notifications';

import SockJS from 'sockjs-client/dist/sockjs';
import { Client, type IFrame, type IMessage, type StompSubscription } from '@stomp/stompjs';

import getKeycloak from 'src/utils/keycloakService';

import { useMessageStore } from 'src/stores/messageStore';
import { useNotificationStore } from 'src/stores/notification';
import { useConversationStore } from 'src/stores/conversationStore';

const getConversationIdFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('conversationId');
};

class WebSocketService {
  private client: Client | null = null;

  private isManuallyClosed = false;

  private reconnectDelay = 1000;

  private maxReconnectDelay = 30000;

  private reconnectTimeout: NodeJS.Timeout | null = null;

  private token: string | null = null;

  keycloak = getKeycloak();

  public isReconnecting(): boolean {
    return this.reconnectTimeout !== null;
  }

  public isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  public async connect(): Promise<void> {
    if (this.isConnected()) return;

    this.token = this.keycloak.token ?? null;
    if (!this.token) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_DOMAIN}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    this.client.connectHeaders = {
      Authorization: `Bearer ${this.token}`,
    };

    this.client.onConnect = (frame) => this.onConnect(frame);
    this.client.onStompError = (frame) => this.onError(frame);
    this.client.onWebSocketClose = () => {
      if (!this.isManuallyClosed) this.reconnect();
    };

    this.client.activate();
  }

  private onConnect(_: any): void {
    this.resetTimeout();
    this.reconnectDelay = 1000;

    this.subscribe('/user/queue/conversations', (msg) => {
      const body = JSON.parse(msg.body);
      const type = body.type as string;
      const { addConversation, updateConversation } = useConversationStore.getState();
      const conversation = body.payload as Conversation;
      if (type === 'CONVERSATION_CREATED') {
        addConversation(conversation);
      } else if (type === 'CONVERSATION_UPDATED') {
        updateConversation(conversation);
      }
    });

    this.subscribe('/user/queue/notifications', (msg) => {
      const body = JSON.parse(msg.body);
      const notification = body.payload as Notification;
      const { addNotification } = useNotificationStore.getState();
      addNotification(notification);
    });

    this.subscribe('/user/queue/messages', (msg) => {
      const body = JSON.parse(msg.body);
      const message = body.payload as Message;
      const currentConversationId = getConversationIdFromUrl();
      console.log(currentConversationId);

      if (message.conversationId === currentConversationId) {
        const { addMessages } = useMessageStore.getState();
        addMessages([message]);
      }
    });
  }

  private subscribe(
    destination: string,
    callback: (msg: IMessage) => void
  ): StompSubscription | undefined {
    if (!this.client?.connected) return;
    this.client.subscribe(destination, callback, {
      Authorization: `Bearer ${this.token}`,
    });
  }

  private onError(error: IFrame): void {
    console.error('WebSocket STOMP error:', error);
    this.reconnect();
  }

  private reconnect(): void {
    this.resetTimeout();

    if (this.reconnectDelay < this.maxReconnectDelay) {
      this.reconnectDelay *= 2;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);
  }

  public disconnect(): void {
    this.isManuallyClosed = true;
    this.client?.deactivate();
    this.resetTimeout();
    console.log('WebSocket disconnected');
  }

  private resetTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
