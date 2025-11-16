export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header Section */}
      <section className="bg-white dark:bg-gray-950 border-b-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          {/* Breadcrumbs & Search Button */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />

              {/* Breadcrumbs */}
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-5 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>

            {/* Search Button */}
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>

          {/* Category Header Content */}
          <div className="flex items-start gap-6">
            {/* Icon Placeholder */}
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />

            <div className="flex-1">
              {/* Title */}
              <div className="h-14 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />

              {/* Description */}
              <div className="space-y-2 mb-3">
                <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>

              {/* Article Count */}
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {/* Card Skeleton 1 */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="group relative h-full rounded-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              {/* Cover Image Skeleton */}
              <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden" />

              {/* Content */}
              <div className="p-6 flex flex-col h-full">
                {/* Title Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>

                {/* Excerpt Skeleton */}
                <div className="space-y-2 mb-4 flex-grow">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>

                {/* Footer Skeleton */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                  {/* Date */}
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
