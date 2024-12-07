import React, { createContext, useState, useEffect, useContext } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { User, getUser, login, logout } from './AuthContext';
import { Text } from '~/components/ui/text';
import { useRouter } from 'expo-router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SuccessPopup: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Sign in successful!</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
          const userData = await getUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('Signing in with email:', email);
      const { access_token } = await login(email, password);
      if (!access_token) {
        return { success: false, message: 'No access token received from server' };
      }
      const userData = await getUser();
      setUser(userData);
      console.log('Sign in successful');
      setShowSuccessPopup(true);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during sign in';
      return { success: false, message: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      await SecureStore.deleteItemAsync('authToken');
      router.replace('/');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SuccessPopup visible={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

