
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginService } from '@/lib/hooks/useLoginService';
import { useToast } from '@/lib/hooks/useToast';

const loginSchema = z.object({
  username: z.string().email('Email is required!'),
  password: z.string().min(1, 'Password is required!'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const [showLoginProgress, setShowLoginProgress] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useLoginService();
  const { showError } = useToast();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    localStorage.clear();
    
    // Check for email in location state
    const email = location.state?.email;
    if (email) {
      setValue('username', atob(email));
    }
  }, [location.state, setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    setShowLoginProgress(true);
    try {
      const response = await login(data);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('idToken', response.idToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      navigate('/dashboard');
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    } finally {
      setShowLoginProgress(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-[0_0_70%] bg-[url('/assets/login-banner.jpg')] bg-cover bg-bottom" />
      
      <div className="flex-[0_0_30%] flex flex-col items-center">
        <div className="flex justify-center mt-25 mb-12.5">
          <img src="/assets/logo-login.svg" alt="Logo" className="w-[250px]" />
        </div>

        <div className="flex justify-center w-full">
          <div className="w-4/5">
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="flex flex-col gap-5"
            >
              <div>
                <input
                  {...register('username')}
                  type="email"
                  placeholder="Email"
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Password"
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={showLoginProgress}
                className="mt-2.5 mb-2.5 p-6 bg-primary text-white rounded font-medium hover:bg-primary-dark disabled:opacity-50"
              >
                SIGN IN
              </button>

              {showLoginProgress && (
                <div className="w-full h-1 bg-gray-200 rounded overflow-hidden">
                  <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" />
                </div>
              )}
            </form>

            <div className="flex items-center gap-2.5 mt-2.5 mb-2.5">
              <hr className="flex-[0_0_25%]" />
              <p className="text-gray-500">Not a Member ?</p>
              <hr className="flex-[0_0_25%]" />
            </div>

            <button
              onClick={() => navigate('/enroll')}
              className="w-full mt-2.5 mb-2.5 p-6 border-2 border-accent text-accent rounded font-medium hover:bg-accent hover:text-white"
            >
              CREATE AN ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
