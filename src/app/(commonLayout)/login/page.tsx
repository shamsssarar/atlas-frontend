import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="w-full max-w-md flex flex-col items-center justify-center space-y-6">
        {/* Optional Logo Space */}
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-2xl shadow-md">
          A
        </div>
        
        <LoginForm />
      </div>
    </main>
  );
}