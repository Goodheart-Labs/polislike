"use client";

import { useAuth } from "@clerk/nextjs";

import BorderedButton from "@/components/BorderedButton";
import type { Poll } from "@/lib/api";
import { useAdminState } from "@/providers/AdminStateProvider";
import { isPollAdmin } from "@/utils/authutils";

// Types
// -----------------------------------------------------------------------------

type AdminPillViewProps = {
  data: {
    poll: Poll;
  };
  state: {
    editingAnalytics: boolean;
    setEditingAnalytics: (editingAnalytics: boolean) => void;
  };
};

// View
// -----------------------------------------------------------------------------

const AdminPillView = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: { poll },
  state: { editingAnalytics, setEditingAnalytics },
}: AdminPillViewProps) => (
  <div className="fixed left-0 flex p-4">
    <BorderedButton
      color="yellow"
      onClick={() => setEditingAnalytics(!editingAnalytics)}
    >
      {editingAnalytics ? "Done" : "Edit Mode"}
    </BorderedButton>
  </div>
);

// Default export
// -----------------------------------------------------------------------------

const AdminPill = ({ poll }: { poll: Poll | null }) => {
  const { userId } = useAuth();
  const { adminState, setAdminState } = useAdminState();

  const { editingAnalytics } = adminState;

  const setEditingAnalytics = (value: boolean) =>
    setAdminState((state) => ({ ...state, editingAnalytics: value }));

  if (!isPollAdmin(poll, userId)) {
    return null;
  }

  return (
    <AdminPillView
      data={{ poll }}
      state={{
        editingAnalytics,
        setEditingAnalytics,
      }}
    />
  );
};

export default AdminPill;
