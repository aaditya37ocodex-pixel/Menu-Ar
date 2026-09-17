import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/ar/$slug")({
  component: () => <Outlet />,
});
