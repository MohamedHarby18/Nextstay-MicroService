import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Auth pages
import GuestHostLogin from './pages/auth/GuestHostLogin'
import GuestRegister from './pages/auth/GuestRegister'
import HostRegister from './pages/auth/HostRegister'
import EmployeeLogin from './pages/auth/EmployeeLogin'

// Guest pages
import GuestExplore from './pages/guest/GuestExplore'
import PropertySearch from './pages/guest/PropertySearch'
import PropertyDetails from './pages/guest/PropertyDetails'
import BookingCheckout from './pages/guest/BookingCheckout'
import MyReservations from './pages/guest/MyReservations'
import ReservationDetails from './pages/guest/ReservationDetails'
import SubmitReview from './pages/guest/SubmitReview'
import MyReviews from './pages/guest/MyReviews'
import GuestTickets from './pages/guest/GuestTickets'
import TicketConversation from './pages/guest/TicketConversation'

import ProfilePage from './pages/shared/ProfilePage'
// Host pages
import HostDashboard from './pages/host/HostDashboard'
import MyListings from './pages/host/MyListings'
import CreateListing from './pages/host/CreateListing'
import HostBookings from './pages/host/HostBookings'
import HostReviews from './pages/host/HostReviews'
import HostEarnings from './pages/host/HostEarnings'

// Agent pages
import AgentTicketQueue from './pages/agent/AgentTicketQueue'
import AgentTicketWorkspace from './pages/agent/AgentTicketWorkspace'
import AgentActionNeeded from './pages/agent/AgentActionNeeded'
import AgentFlaggedReviews from './pages/agent/AgentFlaggedReviews'
import AgentHistory from './pages/agent/AgentHistory'
import AgentPerformance from './pages/agent/AgentPerformance'

// Users Admin pages
import UserManagement from './pages/usersAdmin/UserManagement'
import AdminReviews from './pages/usersAdmin/AdminReviews'
import AdminRefunds from './pages/usersAdmin/AdminRefunds'
import AdminListings from './pages/usersAdmin/AdminListings'

// Employees Admin pages
import EmployeesManagement from './pages/empAdmin/EmployeesManagement'
import AssignTickets from './pages/empAdmin/AssignTickets'
import EmpAdminActionNeeded from './pages/empAdmin/EmpAdminActionNeeded'

// Route guards
function RequireAuth({ children }) {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function RequireGuest({ children }) {
  const { token, role } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (role !== 'GUEST' && role !== 'HOST') return <Navigate to="/login" replace />
  return children
}

function RequireHost({ children }) {
  const { token, role } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (role !== 'HOST') return <Navigate to="/login" replace />
  return children
}

function RequireAgent({ children }) {
  const { token, role } = useAuthStore()
  if (!token) return <Navigate to="/employee-login" replace />
  if (!['SUPPORT_AGENT', 'SUPPORT_LEAD'].includes(role)) return <Navigate to="/employee-login" replace />
  return children
}

function RequireUsersAdmin({ children }) {
  const { token, role, authType } = useAuthStore()
  
  // User Admins use the normal login, so redirect there if no token
  if (!token) return <Navigate to="/login" replace />
  
  // Check for 'ADMIN' role AND 'user' authType to separate them from Employee Admins
  if (role !== 'ADMIN' || authType !== 'user') return <Navigate to="/login" replace />
  
  return children
}

function RequireEmpAdmin({ children }) {
  const { token, role } = useAuthStore()
  if (!token) return <Navigate to="/employee-login" replace />
  if (!['ADMIN_EMPLOYEES', 'ADMIN'].includes(role)) return <Navigate to="/employee-login" replace />
  return children
}

function PublicOnly({ children }) {
  const { token, role, authType } = useAuthStore()
  if (token) {
    if (authType === 'agent') {
      if (['SUPPORT_AGENT', 'SUPPORT_LEAD'].includes(role)) return <Navigate to="/agent/tickets" replace />
      // Employee Admin check
      if (['ADMIN_EMPLOYEES', 'ADMIN'].includes(role)) return <Navigate to="/emp-admin/employees" replace />
    }
    
    // ADD THIS BLOCK: Explicitly handle User Admins vs Hosts vs Guests
    if (authType === 'user') {
      if (role === 'ADMIN') return <Navigate to="/users-admin/listings" replace />
      if (role === 'HOST') return <Navigate to="/host" replace />
      return <Navigate to="/guest" replace />
    }
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Public ─── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicOnly><GuestHostLogin /></PublicOnly>} />
        <Route path="/register/guest" element={<PublicOnly><GuestRegister /></PublicOnly>} />
        <Route path="/register/host" element={<PublicOnly><HostRegister /></PublicOnly>} />
        <Route path="/employee-login" element={<PublicOnly><EmployeeLogin /></PublicOnly>} />

        {/* ─── Guest ─── */}
        <Route path="/guest" element={<RequireAuth><GuestExplore /></RequireAuth>} />
        <Route path="/guest/search" element={<RequireAuth><PropertySearch /></RequireAuth>} />
        <Route path="/guest/property/:id" element={<RequireAuth><PropertyDetails /></RequireAuth>} />
        <Route path="/guest/checkout/:listingId" element={<RequireGuest><BookingCheckout /></RequireGuest>} />
        <Route path="/guest/reservations" element={<RequireGuest><MyReservations /></RequireGuest>} />
        <Route path="/guest/reservations/:id" element={<RequireGuest><ReservationDetails /></RequireGuest>} />
        <Route path="/guest/review/:reservationId" element={<RequireGuest><SubmitReview /></RequireGuest>} />
        <Route path="/guest/reviews" element={<RequireGuest><MyReviews /></RequireGuest>} />
        <Route path="/guest/tickets" element={<RequireAuth><GuestTickets /></RequireAuth>} />
        <Route path="/guest/tickets/:ticketId" element={<RequireAuth><TicketConversation /></RequireAuth>} />
        <Route path="/guest/profile" element={<RequireGuest><ProfilePage /></RequireGuest>} />

        {/* ─── Host ─── */}
        <Route path="/host" element={<RequireHost><HostDashboard /></RequireHost>} />
        <Route path="/host/listings" element={<RequireHost><MyListings /></RequireHost>} />
        <Route path="/host/listings/create" element={<RequireHost><CreateListing /></RequireHost>} />
        <Route path="/host/bookings" element={<RequireHost><HostBookings /></RequireHost>} />
        <Route path="/host/reviews" element={<RequireHost><HostReviews /></RequireHost>} />
        <Route path="/host/earnings" element={<RequireHost><HostEarnings /></RequireHost>} />
        <Route path="/host/tickets" element={<RequireHost><GuestTickets /></RequireHost>} />
        <Route path="/host/tickets/:ticketId" element={<RequireHost><TicketConversation /></RequireHost>} />
        <Route path="/host/profile" element={<RequireHost><ProfilePage /></RequireHost>} />

        {/* ─── Support Agent ─── */}
        <Route path="/agent/tickets" element={<RequireAgent><AgentTicketQueue /></RequireAgent>} />
        <Route path="/agent/tickets/:ticketId" element={<RequireAgent><AgentTicketWorkspace /></RequireAgent>} />
        <Route path="/agent/action-needed" element={<RequireAgent><AgentActionNeeded /></RequireAgent>} />
        <Route path="/agent/flagged-reviews" element={<RequireAgent><AgentFlaggedReviews /></RequireAgent>} />
        <Route path="/agent/history" element={<RequireAgent><AgentHistory /></RequireAgent>} />
        <Route path="/agent/performance" element={<RequireAgent><AgentPerformance /></RequireAgent>} />

        {/* ─── Users Admin ─── */}
        <Route path="/users-admin/users" element={<RequireUsersAdmin><UserManagement /></RequireUsersAdmin>} />
        <Route path="/users-admin/reviews" element={<RequireUsersAdmin><AdminReviews /></RequireUsersAdmin>} />
        <Route path="/users-admin/refunds" element={<RequireUsersAdmin><AdminRefunds /></RequireUsersAdmin>} />
        <Route path="/users-admin/listings" element={<RequireUsersAdmin><AdminListings /></RequireUsersAdmin>} />

        {/* ─── Employees Admin ─── */}
        <Route path="/emp-admin/employees" element={<RequireEmpAdmin><EmployeesManagement /></RequireEmpAdmin>} />
        <Route path="/emp-admin/assign" element={<RequireEmpAdmin><AssignTickets /></RequireEmpAdmin>} />
        <Route path="/emp-admin/action-needed" element={<RequireEmpAdmin><EmpAdminActionNeeded /></RequireEmpAdmin>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
