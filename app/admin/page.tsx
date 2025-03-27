import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

interface AdminData {
  scheduledCount: number;
  pendingCount: number;
  cancelledCount: number;
  documents: any[]; // Replace with appropriate type for your documents h
}

const AdminPage = async () => {
  let appointments: AdminData | null = null;
  let error: Error | null = null;

  try {
    const data = await getRecentAppointmentList();
    
    // Type guard to ensure data has the required structure
    if (
      typeof data.scheduledCount === "number" &&
      typeof data.pendingCount === "number" &&
      typeof data.cancelledCount === "number" &&
      Array.isArray(data.documents)
    ) {
      appointments = data;
    } else {
      throw new Error("Invalid data format");
    }
  } catch (err) {
    error = err instanceof Error ? err : new Error("Failed to fetch appointments");
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full1.png"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        {error ? (
          <section className="error-message">
            <p className="text-error">Error fetching appointments: {error.message}</p>
          </section>
        ) : !appointments ? (
          <section className="loading-message">
            <p className="text-gray-500">Loading appointments...</p>
          </section>
        ) : (
          <>
            <section className="admin-stat">
              <StatCard
                type="appointments"
                count={appointments.scheduledCount}
                label="Scheduled appointments"
                icon={"/assets/icons/appointments.svg"}
              />
              <StatCard
                type="pending"
                count={appointments.pendingCount}
                label="Pending appointments"
                icon={"/assets/icons/pending.svg"}
              />
              <StatCard
                type="cancelled"
                count={appointments.cancelledCount}
                label="Cancelled appointments"
                icon={"/assets/icons/cancelled.svg"}
              />
            </section>

            <DataTable columns={columns} data={appointments.documents} />
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
