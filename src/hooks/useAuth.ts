import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setCredentials, logOut } from '@/features/auth/authSlice';
import { RootState } from '@/store/store';
import { useSyncUserMutation } from '@/features/auth/authApi'; // ✅ Swap to syncUser

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  
  const [syncUser] = useSyncUserMutation();
  const [isAuthLoading, setIsAuthLoading] = useState(true); // ✅ Add a loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Force token refresh to avoid race conditions
          await firebaseUser.getIdToken(true);

          // Fetch the actual profile from the database
          const dbResponse = await syncUser({
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email || ""
          }).unwrap() as any;

          // Extract the role safely
          const realRole = dbResponse?.data?.role || dbResponse?.role || "ATHLETE";

          dispatch(setCredentials({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: realRole
          }));
        } catch (err) {
          console.error("Failed to fetch user profile for role:", err);
          dispatch(logOut());
        } finally {
          setIsAuthLoading(false); // ✅ Turn off loading when done
        }
      } else {
        dispatch(logOut());
        setIsAuthLoading(false); // ✅ Turn off loading if no user
      }
    });

    return () => unsubscribe();
  }, [dispatch, syncUser]);

  const user = authState.uid ? {
    uid: authState.uid,
    email: authState.email,
    role: authState.role,
  } : null;

  return { user, ...authState, isAuthLoading }; // ✅ Export the loading state
};