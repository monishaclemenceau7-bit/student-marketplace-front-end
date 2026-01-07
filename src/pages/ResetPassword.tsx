import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import esilvLogo from '@/assets/esilv-marketplace-logo.png';
import api from '@/lib/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return 'Password must contain uppercase, lowercase, and numbers';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post<{
        message: string;
        token: string;
        user: { name: string; email: string };
      }>('/auth/reset-password', {
        token,
        newPassword,
      });

      // Save auth token for auto-login
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }

      setIsSuccess(true);
      toast.success('Password reset successfully!', {
        description: 'You can now log in with your new password.',
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: unknown) {
      const err = error as { message?: string; status?: number; isNetworkError?: boolean };
      console.error('Reset password error:', err);

      if (err.isNetworkError || !err.status) {
        toast.error('Unable to connect to server. Please check your internet connection.');
        return;
      }

      const message = err.message || 'Failed to reset password. Please try again.';
      toast.error(message);

      // If token is invalid/expired, redirect to forgot password
      if (err.status === 400) {
        setTimeout(() => {
          navigate('/forgot-password');
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <img src={esilvLogo} alt="ESILV" className="h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold mb-2">Reset Password</h1>
            <p className="text-muted-foreground">
              {isSuccess ? 'Your password has been reset' : 'Enter your new password'}
            </p>
          </div>

          {/* Form or Success Message */}
          <div className="bg-card rounded-xl border border-border/50 p-6">
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Password Reset Successful!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your password has been updated successfully. You are now logged in and will be
                    redirected to the homepage.
                  </p>
                </div>

                <Button asChild className="w-full">
                  <Link to="/">Go to Homepage</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      className="pl-10 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Password Requirements:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : ''
                        }
                      >
                        • At least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)
                            ? 'text-green-600 dark:text-green-400'
                            : ''
                        }
                      >
                        • Uppercase and lowercase letters
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          /\d/.test(newPassword) ? 'text-green-600 dark:text-green-400' : ''
                        }
                      >
                        • At least one number
                      </span>
                    </li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </div>

          {/* Help */}
          {!isSuccess && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Need help?{' '}
              <Link to="/help" className="text-primary hover:underline">
                Visit our Help Center
              </Link>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
