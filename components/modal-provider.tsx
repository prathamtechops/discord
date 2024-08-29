"use client";

import CreateChannelModal from "@/components/modal/CreateChannelModal";
import CreateServerModal from "@/components/modal/CreateServerModal";
import EditServerModal from "@/components/modal/EditServerModal";
import InviteModal from "@/components/modal/InviteModal";
import MembersModal from "@/components/modal/MembersModal";
import React from "react";
import DeleteServerModal from "./modal/DeleteServer";
import LeaveServerModal from "./modal/LeaveServer";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />

      <DeleteServerModal />
    </>
  );
};
