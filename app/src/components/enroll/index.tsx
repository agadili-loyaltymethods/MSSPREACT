
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginService } from '@/lib/hooks/useLoginService';
import { useToast } from '@/lib/hooks/useToast';

const enrollSchema = z.object({
  email: z.string().email('Valid Email is required'),
  password: z.string().min(1, 'Password is required'),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type EnrollFormValues = z.infer<typeof enrollSchema>;

export function Enroll() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { enroll } = useLoginService();
  const { showSuccess, showError } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<EnrollFormValues>({
    resolver: zodResolver(enrollSchema)
  });

  const onSubmit = async (data: EnrollFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await enroll(data);
      if (response.status === 'success') {
        showSuccess('Enrollment successful. Please proceed to log in.');
        navigate('/login', { 
          state: { email: btoa(data.email) }
        });
      }
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-[0_0_70%] bg-[url('/assets/login-banner.jpg')] bg-cover bg-bottom" />
      
      <div className="flex-[0_0_30%] flex flex-col items-center">
        <div className="flex justify-center mt-25 mb-12.5">
          <img src="/assets/logo-login.svg" alt="Logo" className="w-[250px]" />
        </div>

        <div className="flex justify-center w-full">
          <div className="w-4/5">
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="flex flex-col gap-2.5"
            >
              <div className="flex gap-2.5">
                <div className="flex-1">
                  <input
                    {...register('firstName')}
                    placeholder="First Name"
                    className="w-full p-2.5 border border-gray-300 rounded"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    {...register('lastName')}
                    placeholder="Last Name"
                    className="w-full p-2.5 border border-gray-300 rounded"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Email"
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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

              <div>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-2.5 border border-gray-300 rounded"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2.5 mb-2.5 p-6 bg-primary text-white rounded font-medium hover:bg-primary-dark disabled:opacity-50"
              >
                CREATE AN ACCOUNT
              </button>
            </form>

            <div className="flex items-center gap-2.5 mt-2.5 mb-2.5">
              <hr className="flex-[0_0_25%]" />
              <p className="text-gray-500">Already a Member ?</p>
              <hr className="flex-[0_0_25%]" />
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full mt-2.5 mb-2.5 p-6 border-2 border-accent text-accent rounded font-medium hover:bg-accent hover:text-white"
            >
              SIGN IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
