"use client";

import { useType } from "@/services/typesService";
import { useParams, useRouter } from "next/navigation";
import { Spinner, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { ArrowLeft, Edit, FileType } from "lucide-react";

export default function TypeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, isError, error } = useType(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">
            {error instanceof Error ? error.message : "Failed to load type"}
          </p>
          <Button
            className="mt-4"
            onPress={() => router.push("/types")}
          >
            Back to Types
          </Button>
        </div>
      </div>
    );
  }

  const type = data.data;

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="light"
          startContent={<ArrowLeft className="h-4 w-4" />}
          onPress={() => router.push("/types")}
        >
          Back to Types
        </Button>
        <Button
          color="primary"
          startContent={<Edit className="h-4 w-4" />}
          onPress={() => router.push(`/types/${id}/edit`)}
        >
          Edit Type
        </Button>
      </div>

      <Card className="max-w-4xl">
        <CardHeader className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <FileType className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">{type.name}</h1>
            <p className="text-sm text-gray-600">Type Details</p>
          </div>
        </CardHeader>
        <CardBody className="space-y-6 p-6">
          <div>
            <label className="text-sm font-semibold text-gray-700">ID</label>
            <p className="text-gray-900 mt-1 font-mono text-xs">{type.id}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <p className="text-gray-900 mt-1">{type.name}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <p className="text-gray-900 mt-1">
              {type.description || "No description provided"}
            </p>
          </div>

          <div className="border-t pt-4">
            <label className="text-sm font-semibold text-gray-700">
              Created At
            </label>
            <p className="text-gray-900 mt-1">
              {new Date(type.createdAt).toLocaleString()}
            </p>
          </div>

          {type.updatedAt && (
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Updated At
              </label>
              <p className="text-gray-900 mt-1">
                {new Date(type.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
