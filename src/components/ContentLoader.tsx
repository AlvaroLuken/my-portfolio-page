"use client";

type ContentLoaderProps = {
  loadedCount: number;
  totalCount: number;
};

export default function ContentLoader({ loadedCount, totalCount }: ContentLoaderProps) {
  return (
    <div className="terrain-content-loader" role="status" aria-live="polite">
      <div className="terrain-content-loader-core" aria-hidden="true">
        <span className="terrain-content-spinner terrain-content-spinner-outer" />
        <span className="terrain-content-spinner terrain-content-spinner-inner" />
      </div>
      <p className="terrain-content-loader-label">
        Loading content... {loadedCount}/{totalCount}
      </p>
      <p className="terrain-content-loader-subtext">This can take up to 5-10 seconds.</p>
    </div>
  );
}
