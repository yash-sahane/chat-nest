import { Skeleton } from "@/components/ui/skeleton";

function UserSkeleton() {
  return (
    <div className="flex items-center p-2 py-3 gap-3">
      <Skeleton className="h-[38px] w-[38px] rounded-full bg-[hsl(var(--message-background))]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-[hsl(var(--message-background))]" />
        <Skeleton className="h-4 w-[100px] bg-[hsl(var(--message-background))]" />
      </div>
    </div>
  );
}

export default UserSkeleton;
