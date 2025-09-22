"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { EllipsisVertical, CircleUser, CreditCard, MessageSquareDot, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";
import { useLogoutMutation } from "@/store/api/auth-api";
import { useAppSelector } from "@/store/hooks";

export function NavUser() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();
  const { isMobile } = useSidebar();

  // Get user data from Redux store first, then localStorage as fallback
  const { user } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState({
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

    setUserData(newUserData);
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={undefined} alt={userData.username} />
                <AvatarFallback className="rounded-lg">{getInitials(userData.username)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.username}</span>
                <span className="text-muted-foreground truncate text-xs">{userData.email}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={undefined} alt={userData.username} />
                  <AvatarFallback className="rounded-lg">{getInitials(userData.username)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.username}</span>
                  <span className="text-muted-foreground truncate text-xs">{userData.email}</span>
                  <span className="text-muted-foreground truncate text-xs capitalize">{userData.role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CircleUser />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquareDot />
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
