import { PlusIcon, Trash2Icon } from "lucide-react";

export const DynamicAttributes = ({ attributes, onAdd, onUpdate, onRemove }: any) => (
  <div className="border-t pt-4 mt-4">
    <div className="flex justify-between items-center mb-3">
      <span className="text-sm font-bold">المواصفات (Attributes)</span>
      <button type="button" onClick={onAdd} className="text-xs text-blue-500 flex items-center gap-1">
        <PlusIcon size={14} /> إضافة
      </button>
    </div>
    {attributes.map((attr: any, index: number) => (
      <div key={index} className="flex gap-2 mb-2">
        <input className="flex-1 border p-2 rounded" placeholder="اللون" value={attr.key} onChange={(e) => onUpdate(index, 'key', e.target.value)} />
        <input className="flex-1 border p-2 rounded" placeholder="أحمر" value={attr.value} onChange={(e) => onUpdate(index, 'value', e.target.value)} />
        <button type="button" onClick={() => onRemove(index)} className="text-red-500"><Trash2Icon size={16} /></button>
      </div>
    ))}
  </div>
);