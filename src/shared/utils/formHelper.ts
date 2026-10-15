import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

export function createTranslatedFieldRegistrar<TFieldValues extends FieldValues>(
  register: UseFormRegister<TFieldValues>
) {
  return (field: Path<TFieldValues>, lang: string) =>
    register(`${field}.${lang}` as Path<TFieldValues>);
}