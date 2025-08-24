import { 
  LayoutDashboard,
  TrendingUp,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  Flag,
  AlertTriangle,
  Search,
  DollarSign,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { UserRole } from '@/types';

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export function getNavigationForRole(role: UserRole): NavigationSection[] {
  switch (role) {
    case 'brand':
      return [
        {
          title: 'Overview',
          items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Campaigns', href: '/brand/campaigns', icon: TrendingUp },
            { name: 'Submissions', href: '/brand/submissions', icon: FileText, badge: '12' },
            { name: 'Analytics', href: '/brand/reports', icon: BarChart3 },
          ]
        },
        {
          title: 'Management',
          items: [
            { name: 'Budget', href: '/brand/billing', icon: CreditCard },
            { name: 'Settings', href: '/settings', icon: Settings },
          ]
        }
      ];

    case 'clipper':
      return [
        {
          title: 'Overview',
          items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Discover', href: '/clipper/campaigns', icon: Search },
            { name: 'My Content', href: '/clipper/submissions', icon: FileText },
            { name: 'Earnings', href: '/clipper/earnings', icon: DollarSign },
          ]
        },
        {
          title: 'Tools',
          items: [
            { name: 'Content Tools', href: '/tools', icon: Sparkles },
            { name: 'Community', href: '/community', icon: MessageSquare },
            { name: 'Settings', href: '/settings', icon: Settings },
          ]
        }
      ];

    case 'admin':
      return [
        {
          title: 'Overview',
          items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Campaign Review', href: '/admin/review/campaigns', icon: TrendingUp, badge: '5' },
            { name: 'User Review', href: '/admin/review/users', icon: Users },
            { name: 'Moderation', href: '/admin/moderation', icon: AlertTriangle, badge: '3' },
          ]
        },
        {
          title: 'Management',
          items: [
            { name: 'Disputes', href: '/admin/disputes', icon: Shield },
            { name: 'Feature Flags', href: '/admin/feature-flags', icon: Flag },
            { name: 'Settings', href: '/settings', icon: Settings },
          ]
        }
      ];

    default:
      return [
        {
          title: 'General',
          items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
          ]
        }
      ];
  }
}