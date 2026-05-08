import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return '—'
  try { return format(typeof date === 'string' ? parseISO(date) : date, 'MMM d, yyyy') }
  catch { return '—' }
}

export const formatDateTime = (date) => {
  if (!date) return '—'
  try { return format(typeof date === 'string' ? parseISO(date) : date, 'MMM d, yyyy • h:mm a') }
  catch { return '—' }
}

export const timeAgo = (date) => {
  if (!date) return '—'
  try { return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true }) }
  catch { return '—' }
}

export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount ?? 0)

export const formatNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  const a = new Date(checkIn), b = new Date(checkOut)
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export const getReservationStatusStyle = (status) => {
  const map = {
    PENDING:   'badge-yellow',
    CONFIRMED: 'badge-blue',
    COMPLETED: 'badge-green',
    CANCELLED: 'badge-gray',
    REJECTED:  'badge-red',
  }
  return map[status] || 'badge-gray'
}

export const getTicketStatusStyle = (status) => {
  const map = {
    open:        'badge-blue',
    in_progress: 'badge-yellow',
    resolved:    'badge-green',
    closed:      'badge-gray',
  }
  return map[status] || 'badge-gray'
}

export const getListingStatusStyle = (status) => {
  const map = {
    ACTIVE:    'badge-green',
    INACTIVE:  'badge-gray',
    SUSPENDED: 'badge-red',
  }
  return map[status] || 'badge-gray'
}

export const getUserStatusStyle = (user) => {
  if (!user?.isActive) return 'badge-red'
  if (user?.isFlagged) return 'badge-yellow'
  return 'badge-green'
}

export const truncate = (str, n = 80) =>
  str && str.length > n ? str.slice(0, n) + '…' : str

export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

export const avatarUrl = (seed, size = 80) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&size=${size}&backgroundColor=FF385C&textColor=ffffff`

export const propertyImage = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`
