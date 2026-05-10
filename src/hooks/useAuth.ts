import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setCredentials, logOut } from '@/features/auth/authSlice';
import { RootState } from '@/store/store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setCredentials({ 
          uid: firebaseUser.uid, 
          email: firebaseUser.email || '' 
        }));
      } else {
        dispatch(logOut());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const user = authState.uid ? {
    uid: authState.uid,
    email: authState.email,
    role: authState.role,
  } : null;

  return { user, ...authState };
};

