import { GlobalLoading } from '@/core/ui/GlobalLoading';

export default function DashboardLoading() {
  return (
    <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
      <GlobalLoading />
    </div>
  );
}
