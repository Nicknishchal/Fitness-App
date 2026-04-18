import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Input, Button } from '../../components/common/Inputs';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const Signup = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: Record<string, string>) => {
    try {
      await axiosInstance.post('/auth/signup', {
        email: data.email,
        full_name: data.full_name,
        password: data.password
      });
      
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error: unknown) {
      let message = 'Signup failed';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail || message;
      }
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl w-fit mb-8">
            <Dumbbell className="w-10 h-10 text-primary-400" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            Join the community of <br />
            <span className="text-primary-400">FlexTrac athletes.</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Start your journey today. Plan your workouts, track your progress, and reach your goals faster.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-500 mt-2">Get started for free today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  {...register('full_name', { required: 'Full name is required' })}
                  placeholder="John Doe"
                  className="pl-12"
                  error={errors.full_name?.message as string}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  placeholder="name@example.com"
                  className="pl-12"
                  error={errors.email?.message as string}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <Input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="pl-12"
                  error={errors.password?.message as string}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              isLoading={isSubmitting}
            >
              Sign Up <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="text-center text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
