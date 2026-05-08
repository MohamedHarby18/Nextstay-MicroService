import { clsx } from 'clsx'

const STATUS_RESERVATION = {
  PENDING:   { cls: 'badge-yellow', label: 'Pending' },
  CONFIRMED: { cls: 'badge-blue',   label: 'Confirmed' },
  COMPLETED: { cls: 'badge-green',  label: 'Completed' },
  CANCELLED: { cls: 'badge-gray',   label: 'Cancelled' },
  REJECTED:  { cls: 'badge-red',    label: 'Rejected' },
}
const STATUS_TICKET = {
  open:        { cls: 'badge-blue',   label: 'Open' },
  in_progress: { cls: 'badge-yellow', label: 'In Progress' },
  resolved:    { cls: 'badge-green',  label: 'Resolved' },
  closed:      { cls: 'badge-gray',   label: 'Closed' },
}
const STATUS_LISTING = {
  ACTIVE:    { cls: 'badge-green', label: 'Active' },
  INACTIVE:  { cls: 'badge-gray',  label: 'Inactive' },
  SUSPENDED: { cls: 'badge-red',   label: 'Suspended' },
}
const STATUS_USER = {
  active:      { cls: 'badge-green',  label: 'Active' },
  flagged:     { cls: 'badge-yellow', label: 'Flagged' },
  deactivated: { cls: 'badge-red',    label: 'Deactivated' },
}
const STATUS_AGENT = {
  SUPPORT_AGENT: { cls: 'badge-blue',   label: 'Support Agent' },
  SUPPORT_LEAD:  { cls: 'badge-purple', label: 'Support Lead' },
  ADMIN:         { cls: 'badge-red',    label: 'Admin' },
}

export function Badge({ className, children }) {
  return <span className={clsx('badge', className)}>{children}</span>
}

export function ReservationBadge({ status }) {
  const s = STATUS_RESERVATION[status] || { cls: 'badge-gray', label: status }
  return <span className={clsx('badge', s.cls)}>{s.label}</span>
}

export function TicketBadge({ status }) {
  const s = STATUS_TICKET[status] || { cls: 'badge-gray', label: status }
  return <span className={clsx('badge', s.cls)}>{s.label}</span>
}

export function ListingBadge({ status }) {
  const s = STATUS_LISTING[status] || { cls: 'badge-gray', label: status }
  return <span className={clsx('badge', s.cls)}>{s.label}</span>
}

export function UserStatusBadge({ user }) {
  let s
  if (!user?.isActive)   s = STATUS_USER.deactivated
  else if (user?.isFlagged) s = STATUS_USER.flagged
  else                   s = STATUS_USER.active
  return <span className={clsx('badge', s.cls)}>{s.label}</span>
}

export function AgentRoleBadge({ role }) {
  const s = STATUS_AGENT[role] || { cls: 'badge-gray', label: role }
  return <span className={clsx('badge', s.cls)}>{s.label}</span>
}
