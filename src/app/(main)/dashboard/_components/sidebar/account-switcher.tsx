"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { useLogoutMutation } from "@/store/api/auth-api";
import { useAppSelector } from "@/store/hooks";

export function AccountSwitcher() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  // Get user data from Redux store first, then localStorage as fallback
  const { user } = useAppSelector((state) => state.auth);
  const [activeUser, setActiveUser] = useState({
    username: "Guest User",
    email: "guest@example.com",
    role: "user",
  });

  // Update user data when Redux store changes or on mount
  useEffect(() => {
    let newUserData = user;

    // Fallback to localStorage if not available in store
    if (!newUserData && typeof window !== "undefined") {
      try {
        const userDataString = localStorage.getItem("userData");
        newUserData = userDataString ? JSON.parse(userDataString) : null;
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        newUserData = null;
      }
    }

    // Final fallback
    newUserData = newUserData ?? {
      username: "Guest User",
      email: "guest@example.com",
      role: "user",
    };

    setActiveUser(newUserData);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      toast.success("Logged out successfully", {
        description: "Redirecting to login page...",
      });

      // Redirect to login page
      router.push("/auth/v1/login");
    } catch (error: unknown) {
      const errorMessage = (error as any)?.data?.message ?? (error as any)?.message ?? "Please try again.";
      toast.error("Logout failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg">
          <AvatarImage src={undefined} alt={activeUser.username} />
          <AvatarFallback className="rounded-lg">{getInitials(activeUser.username)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuItem className="p-0">
          <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
            <Avatar className="size-9 rounded-lg">
              <AvatarImage src={undefined} alt={activeUser.username} />
              <AvatarFallback className="rounded-lg">{getInitials(activeUser.username)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{activeUser.username}</span>
              <span className="truncate text-xs capitalize">{activeUser.role}</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
          <LogOut />
          {isLoading ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
