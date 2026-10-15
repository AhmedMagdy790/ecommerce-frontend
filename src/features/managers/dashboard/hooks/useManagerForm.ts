// src/features/managers/dashboard/hooks/useManagerForm.ts

import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { useManagerStore } from "../../model/store/useManagerStore";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { userSchema, type UserFormData, type UserFormInput } from "@/features/users/model/schema/userSchema";
import { userFromDefault } from "@/features/users/dashboard/constants/userFromDefault";
import type { InitialUserData } from "@/features/users/model/types/user.from.typs";
import { mapUserToForm } from "@/features/users/dashboard/mappers/mapUserForm";
import { userAdapter } from "@/features/users/adapters/user.adapter";

export const useManagerForm = (
  initialData?: InitialUserData | null,
  closeModal?: () => void,
  isOpen?: boolean
) => {
  const { create, update, isSubmitting, submitError } = useManagerStore();

  const prevIsOpenRef = useRef(isOpen);

  const methods = useForm<UserFormInput, unknown, UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: userFromDefault,
  });

  const { reset, handleSubmit, setError } = methods;

  const isEditMode = Boolean(initialData?.id);

  const sanitizedInitialValues = useMemo(
    () => (initialData ? mapUserToForm(initialData) : userFromDefault),
    [initialData]
  );

  useEffect(() => {
    const justOpened = !prevIsOpenRef.current && isOpen;
    prevIsOpenRef.current = isOpen;

    if (justOpened) {
      reset(isEditMode ? sanitizedInitialValues : userFromDefault);
    }
  }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

  const resetForm = () => {
    reset(userFromDefault);
  };

  const submitManager = async (formData: UserFormData) => {
    if (isSubmitting) return;

    try {
      if (isEditMode && initialData?.id) {
        const payload = userAdapter.toUpdateDto(formData);
        await update(initialData.id, payload);
      } else {
        const payload = userAdapter.toCreateDto(formData);
        await create(payload);
      }

      resetForm();
      closeModal?.();
    } catch (error: unknown) {
      console.error("Failed to submit manager:", error);

      const managerFields: Path<UserFormInput>[] = [
        "name" as Path<UserFormInput>,
        "email" as Path<UserFormInput>,
        "phone" as Path<UserFormInput>,
        "password" as Path<UserFormInput>,
        "password_confirmation" as Path<UserFormInput>,
        "status" as Path<UserFormInput>,
        "roles" as Path<UserFormInput>,
        "avatar" as Path<UserFormInput>,
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