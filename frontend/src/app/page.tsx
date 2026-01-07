"use client";

import dynamic from "next/dynamic";
import SchemaBuilderSkeleton from "@/components/SchemaBuilderSkeleton";

const SchemaBuilder = dynamic(() => import("@/components/SchemaBuilder"), {
  loading: () => <SchemaBuilderSkeleton />,
  ssr: false,
});

export default function Home() {
  return (
    <div className="bg-black/10 h-full fixed top-0 left-0 w-full z-10 overflow-y-auto">
      <div className="min-h-screen container mx-auto px-4 py-8 pb-32">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-3xl font-bold text-white">
            Credential Schema Builder
          </h2>
          <p className="text-muted-foreground">
            Create and validate credential schemas for verifiable credentials
          </p>
        </div>

        <SchemaBuilder />
      </div>
    </div>
  );
}
