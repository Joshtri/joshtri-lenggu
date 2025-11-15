export default function PostLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        {/* Category Badge */}
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
        
        {/* Title */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
        <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
        
        {/* Meta Info */}
        <div className="flex gap-4 items-center">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Cover Image Skeleton */}
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8" />

      {/* Content Skeleton */}
      <div className="space-y-4">
        {/* Paragraph lines */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
