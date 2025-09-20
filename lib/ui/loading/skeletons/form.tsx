interface FormSkeletonProps {
  fields?: number;
}

export function FormSkeleton({ fields = 3 }: FormSkeletonProps) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="h-10 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
}
