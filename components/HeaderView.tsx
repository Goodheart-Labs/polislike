"use client";

import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/shadcn/ui/button";
import { PlusCircle, Menu, XIcon } from "lucide-react";
import { useQuery } from "react-query";
import { useState } from "react";
import { Logo } from "./Logo";

export function HeaderView() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { slug } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: isAdmin } = useQuery(
    ["polls", slug],
    async () => {
      if (!slug || slug === "new") return false;
      if (user?.publicMetadata.isSuperAdmin) return true;
      const response = await fetch(`/api/public/is-admin/${slug}`);
      const data = (await response.json()) as { isAdmin: boolean };
      return data.isAdmin;
    },
    {
      enabled: isSignedIn,
    },
  );

  const onClickPollAdmin = () => router.push(`/polls/${slug}/admin`);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  const renderNavLinks = (isMobile = false) => (
    <>
      <Link
        href="/user/polls"
        className={`${isMobile ? "block" : ""} text-white hover:opacity-50 text-sm`}
        onClick={isMobile ? closeMenu : undefined}
      >
        My Polls
      </Link>
      <Link
        href="/user/account"
        className={`${isMobile ? "block" : ""} text-white hover:opacity-50 text-sm`}
        onClick={isMobile ? closeMenu : undefined}
      >
        Account
      </Link>
      <Button
        variant="pill"
        size="pill"
        className={isMobile ? "w-full" : "mr-2"}
        asChild
      >
        <Link
          href="/new-poll"
          prefetch={false}
          onClick={isMobile ? closeMenu : undefined}
        >
          <PlusCircle className="w-3 mr-2" /> Create Poll
        </Link>
      </Button>
    </>
  );

  const renderMobileMenu = () => (
    <div
      className={`fixed inset-y-0 right-0 transform ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out bg-zinc-800 w-64 p-6 space-y-4 md:hidden`}
    >
      <Button
        variant="ghost"
        className="absolute top-4 right-4"
        onClick={toggleMenu}
      >
        <XIcon className="h-4 w-4" />
      </Button>
      {renderNavLinks(true)}
    </div>
  );

  const renderDesktopMenu = () => (
    <div className="hidden md:flex gap-3 items-center">
      {renderNavLinks()}
      <UserButton afterSignOutUrl="/" />
    </div>
  );

  return (
    <div className="self-start flex items-center justify-between w-full p-4 sticky top-0 bg-zinc-900 z-[60]">
      <Link href="/" className="hover:opacity-50">
        <Logo width={160} height={24} />
      </Link>

      {isSignedIn && isAdmin && (
        <div className="hidden md:block">
          <Button variant="pill" size="pill" onClick={onClickPollAdmin}>
            Poll Admin
          </Button>
        </div>
      )}

      <div className="flex items-center gap-3">
        {isSignedIn ? (
          <>
            <div className="md:hidden">
              <UserButton afterSignOutUrl="/" />
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            {renderMobileMenu()}
            {renderDesktopMenu()}
          </>
        ) : (
          <SignInButton>Login</SignInButton>
        )}
      </div>
    </div>
  );
}
