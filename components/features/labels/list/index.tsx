"use client";

import {
  ACTION_BUTTONS,
  ADD_BUTTON,
} from "@/components/ui/Button/ActionButtons";
import { ListGrid } from "@/components/ui/ListGrid";
import { useDeleteLabel } from "@/services/labelsService";
import { Tooltip } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Label } from "../interfaces/labels";

export default function LabelList() {
  const router = useRouter();
  const deleteLabel = useDeleteLabel();

  const columns = [
    {
      key: "id",
      label: "ID",
      value: (label: Label) => label.id,
    },
    {
      key: "name",
      label: "Name",
      value: (label: Label) => label.name,
    },
    {
      key: "color",
      label: "Color",
      value: (label: Label) => (
        <>
          <Tooltip content={label.color} placement="top">
            <div
              className="w-6 h-6 border cursor-pointer"
              style={{ backgroundColor: label.color }}
            />
          </Tooltip>
        </>
      ),
    },
    {
      key: "description",
      label: "Description",
      value: (label: Label) => label.description,
    },
    {
      key: "actions",
      label: "Actions",
      align: "center" as const,
    },
  ];

  const handleDelete = (id: string) => {
    return deleteLabel.mutateAsync(id);
  };

  return (
    <ListGrid
      keyField="id"
      idField="id"
      title={"Label Management"}
      description={"Manage your labels"}
      actionButtons={{
        add: ADD_BUTTON.CREATE("/labels/create"),
        edit: ACTION_BUTTONS.EDIT((id) => router.push(`/labels/${id}/edit`)),
        delete: ACTION_BUTTONS.DELETE(handleDelete),
      }}
      resourcePath="/labels"
      nameField="name"
      searchPlaceholder="Search labels by name, description, or color..."
      onSearch={(query) => {}}
      columns={columns}
      pageSize={10}
      showPagination={true}
    />
  );
}
