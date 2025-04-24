"use client";

interface AdminPageTitleProps {
  title: string;
  description?: string;
}

export default function AdminPageTitle({
  title,
  description,
}: AdminPageTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}
