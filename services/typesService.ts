"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { ApiResponse, QueryParams } from "@/interfaces/api";
import { CreateTypeInput, Type, UpdateTypeInput } from "@/components/features/types/interfaces";
import { Toast } from "@/components/ui/Toast";

export const typesKeys = {
    all: ["types"] as const,
    lists: () => [...typesKeys.all, "list"] as const,
    list: (params?: QueryParams) =>
        [...typesKeys.lists(), params] as const,
    details: () => [...typesKeys.all, "detail"] as const,
    detail: (id: string) => [...typesKeys.details(), id] as const,
};

// ==================== API FUNCTIONS (using Axios) ====================

// Fetch all types
async function getTypes(
    params?: QueryParams
): Promise<ApiResponse<Type[]>> {
    const { data } = await apiClient.get<ApiResponse<Type[]>>("/types", {
        params,
    });
    return data;
}

// Fetch single type
async function getType(id: string): Promise<ApiResponse<Type>> {
    const { data } = await apiClient.get<ApiResponse<Type>>(`/types/${id}`);
    return data;
}

// Create type
async function createType(
    typeData: CreateTypeInput
): Promise<ApiResponse<Type>> {
    const { data } = await apiClient.post<ApiResponse<Type>>("/types", typeData);
    return data;
}

// Update type
async function updateType({
    id,
    data: typeData,
}: {
    id: string;
    data: UpdateTypeInput;
}): Promise<ApiResponse<Type>> {
    const { data } = await apiClient.patch<ApiResponse<Type>>(
        `/types/${id}`,
        typeData
    );
    return data;
}

// Delete type
async function deleteType(id: string): Promise<ApiResponse<null>> {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/types/${id}`);
    return data;
}

export function useTypes(params?: QueryParams) {
    return useQuery({
        queryKey: typesKeys.list(params),
        queryFn: () => getTypes(params),
        staleTime: 5000, // Consider data fresh for 5 seconds
        gcTime: 10 * 60 * 1000, // Cache for 10 minutes (formerly cacheTime)
    })
}

export function useType(id: string) {
    return useQuery({
        queryKey: typesKeys.detail(id),
        queryFn: () => getType(id),
        staleTime: 5000, // Consider data fresh for 5 seconds
        gcTime: 10 * 60 * 1000, // Cache for 10 minutes (formerly cacheTime))
    })
}

// ==================== REACT 19.2 UTILITIES ====================

// Export for use with React 19.2 useOptimistic hook
export function getOptimisticType(input: CreateTypeInput): Type {
    return {
        id: `temp-${Date.now()}`, // Temporary ID for optimistic updates
        name: input.name,
        description: input.description ?? null,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
    };
}

// Hook: Create type with React 19.2 optimizations
export function useCreateType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createType,
        onMutate: async (newType) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: typesKeys.lists() });

            // Snapshot previous value for rollback
            const previousTypes = queryClient.getQueryData(typesKeys.lists());

            // Optimistically update to show new type immediately
            queryClient.setQueryData(
                typesKeys.lists(),
                (old: ApiResponse<Type[]> | undefined) => {
                    if (!old?.data) return old;

                    // Create temporary type with negative ID
                    const optimisticType: Type = getOptimisticType(newType);

                    return {
                        ...old,
                        data: [optimisticType, ...old.data],
                    };
                }
            );

            return { previousTypes };
        },
        onSuccess: (response) => {
            // Invalidate and refetch types list with new data
            queryClient.invalidateQueries({ queryKey: typesKeys.lists() });

            // Show success
            Toast({
                title: "Type created successfully",
                description: response.message,
                color: "success"
            })
        },
        onError: (error: Error, _newType, context) => {
            // Rollback to previous state on error
            if (context?.previousTypes) {
                queryClient.setQueryData(typesKeys.lists(), context.previousTypes);
            }

            Toast({
                title: "Failed to create type",
                description: error.message,
                color: "danger",
            })
        },
    });
}

// Hook: Update type with optimistic updates
export function useUpdateType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateType,
        onMutate: async ({ id, data: updateData }) => {
            await queryClient.cancelQueries({ queryKey: typesKeys.detail(id) });
            await queryClient.cancelQueries({ queryKey: typesKeys.lists() });

            const previousType = queryClient.getQueryData(typesKeys.detail(id));
            const previousTypes = queryClient.getQueryData(typesKeys.lists());

            // Optimistically update single type cache
            queryClient.setQueryData(
                typesKeys.detail(id),
                (old: ApiResponse<Type> | undefined) => {
                    if (!old?.data) return old;
                    return {
                        ...old,
                        data: { ...old.data, ...updateData },
                    };
                }
            );

            // Optimistically update type within list cache
            queryClient.setQueryData(
                typesKeys.lists(),
                (old: ApiResponse<Type[]> | undefined) => {
                    if (!old?.data) return old;
                    return {
                        ...old,
                        data: old.data.map((type) =>
                            type.id === id ? { ...type, ...updateData } : type
                        ),
                    };
                }
            );

            return { previousType, previousTypes, id };
        },
        onSuccess: (response, variables) => {
            // Ensure fresh data
            queryClient.invalidateQueries({ queryKey: typesKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: typesKeys.lists() });

            Toast({
                title: "Type updated successfully",
                description: response.message,
                color: "success"
            })
        },
        onError: (error: Error, _variables, context) => {
            // Rollback optimistic updates
            if (context?.previousType) {
                queryClient.setQueryData(
                    typesKeys.detail(context.id),
                    context.previousType
                );
            }
            if (context?.previousTypes) {
                queryClient.setQueryData(typesKeys.lists(), context.previousTypes);
            }

            Toast({
                title: "Failed to update type",
                description: error.message,
                color: "danger",
            })
        },
    });
}

// Hook: Delete type with optimistic removal
export function useDeleteType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteType,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: typesKeys.lists() });

            const previousTypes = queryClient.getQueryData(typesKeys.lists());

            queryClient.setQueryData(
                typesKeys.lists(),
                (old: ApiResponse<Type[]> | undefined) => {
                    if (!old?.data) return old;
                    return {
                        ...old,
                        data: old.data.filter((type) => type.id !== id),
                    };
                }
            );

            return { previousTypes };
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: typesKeys.lists() });

            Toast({
                title: "Type deleted successfully",
                description: response.message,
                color: "success"
            })
        },
        onError: (error: Error, _id, context) => {
            if (context?.previousTypes) {
                queryClient.setQueryData(typesKeys.lists(), context.previousTypes);
            }

            Toast({
                title: "Failed to delete type",
                description: error.message,
                color: "danger",
            })
        },
    });
}
