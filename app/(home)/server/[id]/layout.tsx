import ServerSiderbar from "@/components/ServerSiderbar";
import { getProfile } from "@/lib/action/profile.action";
import { getServerById } from "@/lib/action/servers.action";
import { redirect } from "next/navigation";
import React from "react";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  const profile = await getProfile();

  if (!profile) {
    return redirect("/sign-in");
  }

  const server = await getServerById(profile.id, params.id);

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSiderbar profile={profile} serverId={params.id} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
