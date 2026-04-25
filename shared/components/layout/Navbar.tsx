"use client";

import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { BookOpen, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: user, isLoading } = useUser();
  const { logout } = useAuth();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
    <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
      
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">LitEvents</span>
          </Link>

       
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-200 animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                  <UserIcon className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => logout.mutate()}
                  disabled={logout.isPending}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Cerrar sesión</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}