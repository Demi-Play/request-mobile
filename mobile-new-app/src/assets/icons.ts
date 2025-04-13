import { Ionicons } from '@expo/vector-icons';

export const ICONS = {
  settings: (color: string = '#000', size: number = 24) => (
    <Ionicons name="settings-outline" size={size} color={color} />
  ),
  chat: (color: string = '#000', size: number = 24) => (
    <Ionicons name="chatbubble-outline" size={size} color={color} />
  ),
  ticket: (color: string = '#000', size: number = 24) => (
    <Ionicons name="ticket-outline" size={size} color={color} />
  ),
  profile: (color: string = '#000', size: number = 24) => (
    <Ionicons name="person-outline" size={size} color={color} />
  ),
  add: (color: string = '#000', size: number = 24) => (
    <Ionicons name="add-circle-outline" size={size} color={color} />
  ),
  edit: (color: string = '#000', size: number = 24) => (
    <Ionicons name="create-outline" size={size} color={color} />
  ),
  delete: (color: string = '#000', size: number = 24) => (
    <Ionicons name="trash-outline" size={size} color={color} />
  ),
  back: (color: string = '#000', size: number = 24) => (
    <Ionicons name="arrow-back-outline" size={size} color={color} />
  ),
  forward: (color: string = '#000', size: number = 24) => (
    <Ionicons name="arrow-forward-outline" size={size} color={color} />
  ),
  menu: (color: string = '#000', size: number = 24) => (
    <Ionicons name="menu-outline" size={size} color={color} />
  ),
}; 