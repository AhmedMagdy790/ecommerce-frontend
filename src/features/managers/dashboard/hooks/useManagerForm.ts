import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useManagerStore } from "../../model/store/useManagerStore";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { mapUserToForm } from "@/features/users/dashboard/mappers/mapUserForm";


import {
  managerSchema,
  type ManagerFormData,
  type ManagerFormInput,
} from "../../model/schema/managerSchema";
import { managerAdapter } from "../../adapters/manager.adapter";
import type { User } from "@/features/users/model/types/user.types";

export const managerFormDefault: ManagerFormInput = {
  mode: "select",
  user_id: "",
  name: "",
  email: "",
  phone: "",
  avatar: "",
  status: "active",
  roles: [],
  password: "",
  password_confirmation: "",
};

export const useManagerForm = (
  initialData?: User | null,
  closeModal?: () => void,
  isOpen?: boolean
) => {
  const { create, update, isSubmitting, submitError } = useManagerStore();

  const prevIsOpenRef = useRef(isOpen);

  const methods = useForm<ManagerFormInput, unknown, ManagerFormData>({
    resolver: zodResolver(managerSchema),
    defaultValues: managerFormDefault,
  });

  const { reset, handleSubmit, setError } = methods;

  const isEditMode = Boolean(initialData?.id);

  const sanitizedInitialValues = useMemo<ManagerFormInput>(
    () =>
      initialData
        ? {
            ...mapUserToForm(initialData),
            mode: "create",
            user_id: initialData.id,
          }
        : managerFormDefault,
    [initialData]
  );

  useEffect(() => {
    const justOpened = !prevIsOpenRef.current && isOpen;
    prevIsOpenRef.current = isOpen;

    if (justOpened) {
      reset(isEditMode ? sanitizedInitialValues : managerFormDefault);
    }
  }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

  const resetForm = () => {
    reset(managerFormDefault);
  };

  const submitManager = async (formData: ManagerFormData) => {
    if (isSubmitting) return;

    try {

      if (formData.mode === "create") {

        const payload = {
          mode: formData.mode,
          user_id: formData.user_id,
          roles: formData.roles,
          status: formData.status,
        };
        await create(payload);
      } else {


        const payload = managerAdapter.toCreateDto(formData);
        if (payload.user_id == null) {
          throw new Error("A user ID is required to update a manager.");
        }
        await update(payload.user_id, payload);
      }

      resetForm();
      closeModal?.();
    } catch (error: unknown) {
      console.error("Failed to submit manager:", error);

      const managerFields: Path<ManagerFormInput>[] = [
        "mode",
        "user_id",
        "name",
        "email",
        "phone",
        "password",
        "password_confirmation",
        "status",
        "roles",
        "avatar",
      ];

      handleServerErrors(error, setError, managerFields);
    }
  };

  return {
    resetForm,
    submitManager,
    methods,
    onSubmit: handleSubmit(submitManager),
    isSubmitting,
    submitError,
    isEditMode,
  };
};