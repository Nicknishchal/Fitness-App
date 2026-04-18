import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Mail, Lock, ArrowRight } from 'lucide-react';
import { Input, Button } from '../../components/common/Inputs';
import { useAuthStore } from '../../store/useAuthStore';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: Record<string, string>) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await axiosInstance.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token } = response.data;
      setToken(access_token);

      // Fetch user profile
      const userRes = await axiosInstance.get('/users/me');
      setUser(userRes.data);

      toast.success('Welcome back!');
      navigate('/');
    } catch (error: unknown) {
      let message = 'Login failed';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.detail || message;
      }
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-12 bg-primary-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>

        <div className="relative z-10 max-w-lg">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl w-fit mb-8">
            <Dumbbell className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            Track your progress, <br />
            <span className="text-primary-200">surpass your limits.</span>
          </h1>
          <p className="text-xl text-primary-100/80 leading-relaxed">
            The ultimate gym companion for planning, executing, and tracking your fitness journey.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="bg-primary-600 p-2 rounded-xl text-white">
                <Dumbbell className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
                  {...register('password', { required: 'Password is required' })}
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
              Sign In <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="text-center text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700 underline-offset-4 hover:underline">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
