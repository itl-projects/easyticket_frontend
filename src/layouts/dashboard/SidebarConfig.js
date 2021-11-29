import { Icon } from '@iconify/react';
import peopleFill from '@iconify/icons-eva/people-fill';
// import fileTextFill from '@iconify/icons-eva/file-text-fill';
import monitorFill from '@iconify/icons-eva/monitor-fill';
import ticketFill from '@iconify/icons-ic/baseline-airplane-ticket';
import ruppeFill from '@iconify-icons/tabler/currency-rupee';
import listFill from '@iconify-icons/tabler/list-check';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon(monitorFill)
  },
  {
    title: 'Users',
    path: '/dashboard/agents',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Tickets',
    path: '/dashboard/tickets',
    icon: getIcon(ticketFill)
  },
  {
    title: 'bookings',
    path: '/dashboard/bookings',
    icon: getIcon(listFill)
  },
  {
    title: 'Credits',
    path: '/dashboard/credits',
    icon: getIcon(ruppeFill)
  },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: getIcon(settings2Fill)
  }
];

export const supplierSidebarConfig = [
  {
    title: 'bookings',
    path: '/dashboard/bookings',
    icon: getIcon(listFill)
  },
  {
    title: 'Tickets',
    path: '/dashboard/tickets',
    icon: getIcon(ticketFill)
  },
  {
    title: 'Credits',
    path: '/dashboard/credits',
    icon: getIcon(ruppeFill)
  }
];
