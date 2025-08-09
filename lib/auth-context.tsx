"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { User } from './types';
import { calculateUselessnessScore } from './uselessness-calculator';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  firebaseError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Firebase is properly configured
    if (!auth || !db) {
      setFirebaseError('Firebase is not properly configured. Please check your environment variables.');
      setLoading(false);
      return;
    }
    setFirebaseError(null);
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        await loadUser(firebaseUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUser = async (userId: string) => {
    if (!db) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        // Update uselessness score
        const updatedScore = calculateUselessnessScore(userData);
        if (updatedScore !== userData.uselessnessScore) {
          await updateDoc(doc(db, 'users', userId), { uselessnessScore: updatedScore });
          userData.uselessnessScore = updatedScore;
        }
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider || !db) {
      throw new Error('Firebase is not properly configured');
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create new user
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          profileImage: firebaseUser.photoURL || '',
          uselessnessScore: Math.floor(Math.random() * 41) + 60,
          joinDate: new Date(),
          lastActive: new Date(),
          profileViews: 0,
          skills: [],
          workExperience: [],
          endorsements: [],
          badges: [],
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        setUser(newUser);
      } else {
        // Update last active
        await updateDoc(doc(db, 'users', firebaseUser.uid), { 
          lastActive: new Date() 
        });
        await loadUser(firebaseUser.uid);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const logout = async () => {
    if (!auth) return;
    
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user || !db) return;
    
    try {
      await updateDoc(doc(db, 'users', user.id), userData);
      setUser({ ...user, ...userData });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      firebaseError,
      signInWithGoogle,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}