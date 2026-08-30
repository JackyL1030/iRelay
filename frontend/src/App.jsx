import { useAuth } from '@clerk/react';
import { Routes } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import { WallpaperProvider } from './context/WallpaperContext';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if(!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />} />
          <Route path="/auth" element={!isSignedIn ? <AuthPage /> : <Navigate to={"/chat"} replace />} />
        </Routes>
      </WallpaperProvider>
    </ThemeProvider>
  );
}
export default App;
