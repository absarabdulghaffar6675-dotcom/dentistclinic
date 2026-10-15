import React from 'react';
import { connection } from 'next/server';
import { getContactMessages } from '@/lib/db';
import MessagesManagerClient from './MessagesManagerClient';

export default async function AdminMessagesPage() {
  await connection();
  const messages = await getContactMessages();
  return <MessagesManagerClient initialMessages={messages} />;
}
