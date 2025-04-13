import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  color?: string;
  size?: number;
}

export const ICONS = {
  settings: ({ color = '#000', size = 24 }: IconProps) => (
    <Ionicons name="settings-outline" size={size} color={color} />
  ),
  chat: ({ color = '#000', size = 24 }: IconProps) => (
    <Ionicons name="chatbubble-outline" size={size} color={color} />
  ),
  ticket: ({ color = '#000', size = 24 }: IconProps) => (
    <Ionicons name="ticket-outline" size={size} color={color} />
  ),
  profile: ({ color = '#000', size = 24 }: IconProps) => (
    <Ionicons name="person-outline" size={size} color={color} />
  ),
  add: ({ color = '#000', size = 24 }: IconProps) => (
    <Ionicons name="add-circle-outline" size={size} color={color} />
  ),
  edit: ({ color = '#000', size = 24 }: IconProps) => (
    <Ionicons name="create-outline" size={size} color={color} />
  ),
  delete: ({ color = '#000', size = 24 }: IconProps) => (
    <Ionicons name="trash-outline" size={size} color={color} />
  ),
  back: ({ color = '#000', size = 24 }: IconProps) => (
    <Ionicons name="arrow-back-outline" size={size} color={color} />
  ),
  forward: ({ color = '#000', size = 24 }: IconProps) => (
    <Ionicons name="arrow-forward-outline" size={size} color={color} />
  ),
  menu: ({ color = '#000', size = 24 }: IconProps) => (
    <Ionicons name="menu-outline" size={size} color={color} />
  ),
}; 