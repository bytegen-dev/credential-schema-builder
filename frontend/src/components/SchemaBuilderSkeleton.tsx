import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SchemaBuilderSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schema Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attributes</CardTitle>
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
            <div className="md:col-span-3 space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="md:col-span-5 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="md:col-span-1 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-9" />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Schema</CardTitle>
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="border rounded-md overflow-hidden">
              <div className="h-[400px] w-full bg-[#1e1e1e] flex">
                <div className="w-12 bg-[#252526] text-[#858585] text-xs font-mono py-4 px-2 flex flex-col items-end space-y-3">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="h-4">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4 bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-full bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-5/6 bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-4/5 bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-full bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-3/4 bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-5/6 bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-full bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-4/5 bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-3/4 bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-full bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-5/6 bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-4/5 bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-3/4 bg-[#2d2d30]" />
                  <Skeleton className="h-4 w-full bg-[#2d2d30]" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

