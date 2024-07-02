'use client';
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


export default function Churches() {

  const { data: session, status } = useSession();

  useEffect(() => {
  }, [session,status]);
  return (
    <main className="flex min-h-screen  flex-col items-center justify-start px-24 p-8 text-black font-text font-light text-xl gap-16">
      <section className="flex w-full items-center justify-center">
        <Navbar session={session} status={status}/>
      </section>
      <section className="h-full flex flex-col w-full items-center justify-start flex-1">
        <AdminDashboard/>
      </section>
    </main>
  );
}
