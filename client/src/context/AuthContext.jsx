import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('truecart_token') || null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Check current session
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            fetchUserData(token);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Auth verification error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const fetchUserData = async (activeToken) => {
    try {
      const [alertsRes, watchRes] = await Promise.all([
        fetch('/api/alerts', {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        }),
        fetch('/api/watchlist', {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        })
      ]);

      if (alertsRes.ok) {
        const aData = await alertsRes.json();
        setAlerts(aData.alerts || []);
      }
      if (watchRes.ok) {
        const wData = await watchRes.json();
        setWatchlist(wData.watchlist || []);
      }
    } catch (err) {
      console.error('Fetch user data error:', err);
    }
  };

  const login = async (identifier, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('truecart_token', data.token);
    setToken(data.token);
    setUser(data.user);
    fetchUserData(data.token);
    return data.user;
  };

  const adminLogin = async (username, password) => {
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Admin login failed');
    }

    localStorage.setItem('truecart_token', data.token);
    setToken(data.token);
    setUser(data.user);
    fetchUserData(data.token);
    return data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('truecart_token', data.token);
    setToken(data.token);
    setUser(data.user);
    fetchUserData(data.token);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('truecart_token');
    setToken(null);
    setUser(null);
    setWatchlist([]);
    setAlerts([]);
  };

  const toggleWatch = async (productId) => {
    if (!token) {
      return { success: false, requireAuth: true };
    }
    try {
      const res = await fetch('/api/watchlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        fetchUserData(token);
        return { success: true };
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false };
  };

  const addAlert = async (productId, targetPrice) => {
    if (!token) {
      return { success: false, requireAuth: true };
    }
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, targetPrice })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create alert');
      }
      fetchUserData(token);
      return { success: true, alert: data.alert };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeAlert = async (alertId) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
      }
    } catch (err) {
      console.error('Delete alert error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        watchlist,
        alerts,
        login,
        adminLogin,
        register,
        logout,
        toggleWatch,
        addAlert,
        removeAlert,
        refreshAlerts: () => token && fetchUserData(token)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

