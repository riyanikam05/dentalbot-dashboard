import { createContext, useContext, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('dentalbot_token'));
  const [clinicName, setClinicName] = useState(localStorage.getItem('dentalbot_clinic_name'));

  const login = async (email, password) => {
    const response = await client.post('/auth/login', { email, password });
    const newToken = response.data.token;
    localStorage.setItem('dentalbot_token', newToken);
    setToken(newToken);

    try {
      const clinicRes = await client.get('/clinic', {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      localStorage.setItem('dentalbot_clinic_name', clinicRes.data.name);
      setClinicName(clinicRes.data.name);
    } catch {
      // non-critical, dashboard still works without the clinic name cached
    }
  };

  const logout = () => {
    localStorage.removeItem('dentalbot_token');
    localStorage.removeItem('dentalbot_clinic_name');
    setToken(null);
    setClinicName(null);
  };

  return (
    <AuthContext.Provider value={{ token, clinicName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}