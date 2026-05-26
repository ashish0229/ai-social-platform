import { RegisterForm } from "@/components/auth/RegisterForm";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper p-4 dark:bg-slate-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <RegisterForm />
    </main>
  );
}

