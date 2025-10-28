import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useRegisterMutation, useLoginMutation } from '@/redux/services/auth.services';
import { setTokens } from '@/redux/slices/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';

export default function Auth() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const [signInMutation] = useLoginMutation();
  const [signUpMutation] = useRegisterMutation();

  // 👇 redirect after successful login
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // ✅ many backends expect 'username', not 'email'
      const response = await signInMutation({ email: email, password }).unwrap();

      // ✅ Save to localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // ✅ Update Redux
      dispatch(
        setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: {
            username: response.username,
            email: response.email,
            role: response.role,
          },
        })
      );

      // ✅ Navigate (redundant but safe)
      navigate('/admin');
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    username: string
  ) => {
    setIsLoading(true);
    try {
      await signUpMutation({ email, password, firstName, lastName, username }).unwrap();
      console.log('Sign-up successful');
    } catch (error) {
      console.error('Sign up failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <SignInForm
                  onSubmit={handleSignIn}
                  onForgotPassword={() => setShowForgotPassword(true)}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </div>
  );
}
