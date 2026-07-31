import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import RegisterHeader from "./RegisterHeader";
import SocialRegister from "./SocialRegister";
import PasswordInput from "./PasswordInput";

import { registerSchema } from "@/features/auth/authSchema";
import { useAuthStore } from "@/features/auth/store/authStore";
import { IRegisterPayload } from "@/features/auth/types/authType";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { User } from "lucide-react";

export default function RegisterForm() {
  const [isChecked, setIsChecked] = useState(false);
  const { createAcount, isLoading } = useAuthStore(); // تأكد إذا كانت الدالة هنا register أو login في الـ Store الخاص بك
  const navigate = useNavigate();

  // تعديل الـ Type هنا ليكون متوافقاً مع الـ Schema الخاص بالتسجيل
  const { register, setError, handleSubmit, formState: { errors } } = useForm<IRegisterPayload>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched"
  });

  const onSubmit = async (data: IRegisterPayload) => {
    try {
      await createAcount(data);
      navigate('/dashboard');
    } catch (error) {
      handleServerErrors(error, setError, ['email', 'password']);
    }
  };



  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <RegisterHeader />
      
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <SocialRegister />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                {/* First Name */}
                <div className="sm:col-span-1">
                  <Input 
                    label={"Name"}
                    placeholder="Enter your name"
                    startIcon={<User size={18} />}
                    type="text"
                    error={!!errors.password}
                    hint={errors.name?.message as string}
                    {...register("name")}
                  />
                </div>
              </div>

              {/* Email */}
              <Input 
                label={"Email"}
                placeholder="Enter your email"
                startIcon={<User size={18} />}
                type="email"
                error={!!errors.email}
                hint={errors.email?.message as string}
                {...register("email")}
              />

              <div className="grid grid-cols-1 gap-5">
                  <Input 
                  label={"Password"}
                  placeholder="Password"
                  startIcon={<User size={18} />}
                  type="password"
                  error={!!errors.password}
                  hint={errors.password?.message as string}
                  {...register("password")}
                />

                  <Input 
                  label={"Password Confirmed"}
                  placeholder="Enter Password Confirmed"
                  startIcon={<User size={18} />}
                  type="password"
                  error={!!errors.password_confirmed}
                  hint={errors.password_confirmed?.message as string}
                  {...register("password_confirmed")}
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  By creating an account means you agree to the{" "}
                  <span className="text-gray-800 dark:text-white/90">Terms and Conditions,</span>{" "}
                  and our <span className="text-gray-800 dark:text-white">Privacy Policy</span>
                </p>
              </div>

              {/* Submit Button */}
              <div>
                <button 
                  disabled={isLoading}
                  type="submit" 
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-gray-400"
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-3 py-4">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}