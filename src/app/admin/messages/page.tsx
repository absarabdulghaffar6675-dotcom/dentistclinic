import React from 'react';
import { getContactMessages } from '@/lib/db';
import MessagesManagerClient from './MessagesManagerClient';


export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  return <MessagesManagerClient initialMessages={messages} />;
}
