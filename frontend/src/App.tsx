import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import PageTransition from '@/components/shared/PageTransition'
import GlobalRipple from '@/components/shared/Ripple'
import ScrollProgress from '@/components/shared/ScrollProgress'
import SoundProvider from '@/components/shared/SoundProvider'
import { LoadingSpinner } from '@/components/shared/DataStates'

// Route-level lazy loading — splits the 487KB main bundle into per-route chunks
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const OnboardingPage = lazy(() => import('@/pages/OnboardingPage'))
const HomePage = lazy(() => import('@/pages/HomePage'))
const DiscoverPage = lazy(() => import('@/pages/DiscoverPage'))
const ChatPage = lazy(() => import('@/pages/ChatPage'))
const ChatRoomPage = lazy(() => import('@/pages/ChatRoomPage'))
const FeedPage = lazy(() => import('@/pages/FeedPage'))
const CreatePostPage = lazy(() => import('@/pages/CreatePostPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const ClonePage = lazy(() => import('@/pages/ClonePage'))
const CalibrationPage = lazy(() => import('@/pages/CalibrationPage'))
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'))

function App() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  return (
    <SoundProvider>
      <div className="min-h-screen bg-background text-text-primary">
        <GlobalRipple />
        <ScrollProgress />
        <PageTransition>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        }>
        <Routes location={location}>
          <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/home" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/home" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/home" />} />
          <Route path="/onboarding" element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" />} />
          <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/discover" element={isAuthenticated ? <DiscoverPage /> : <Navigate to="/login" />} />
          <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/chat/:conversationId" element={isAuthenticated ? <ChatRoomPage /> : <Navigate to="/login" />} />
          <Route path="/feed" element={isAuthenticated ? <FeedPage /> : <Navigate to="/login" />} />
          <Route path="/feed/create" element={isAuthenticated ? <CreatePostPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/clone" element={isAuthenticated ? <ClonePage /> : <Navigate to="/login" />} />
          <Route path="/calibrate" element={isAuthenticated ? <CalibrationPage /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>
      </PageTransition>
    </div>
    </SoundProvider>
  )
}

export default App
