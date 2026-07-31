import React, { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import ProfileAddressModal from "../modal/ProfileAddressModal"; 
import AddressItemCard from "../components/AddressItemCard";
import { useAddressStore } from "../store/useAddressStore";
import { confirm } from "@/shared/components/confirmModal/confirm";
import { useAuthStore } from "@/store/authStore";
import { Plus } from "lucide-react";

export default function UserAddressPage() {
  const { user } = useAuthStore();
  const { fetchAddresses, addresses, removeAddress } = useAddressStore();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  
  const openEdit = (address: any) => {
    setSelectedAddress(address);
    openModal();
  };

  const openAdd = () => {
    setSelectedAddress(null);
    openModal();
  };

  const handleDelete = async (id: number | string) => {
    const result = await confirm({
      title: "Delete Address",
      description: "Are you sure you want to delete this address?",
      confirmText: "Confirm",
      cancelText: "Cancel",
    });

    if (!result) return;

    removeAddress(id);
  };

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Shipping Addresses
          </h4>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Manage your delivery locations and billing addresses
          </p>
        </div>
        
        <button
          onClick={openAdd}
          className="
            inline-flex 
            items-center 
            justify-center
            gap-2 
            rounded-[var(--radius-md)] 
            bg-[var(--color-primary)] 
            px-4 
            py-2.5 
            text-sm 
            font-medium 
            text-white 
            hover:bg-[var(--color-primary-hover)] 
            transition-all 
            duration-[var(--duration-fast)]
            shadow-[var(--shadow-xs)]
            active:scale-95
          "
        >
          <Plus size={18} />
          <span>Add New</span>
        </button>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <AddressItemCard 
              key={address.id} 
              onDelete={handleDelete}  
              onEdit={openEdit} 
              address={address} 
            />
          ))
        ) : (
          <div 
            className="
              col-span-full 
              py-16 
              flex 
              flex-col 
              items-center 
              justify-center 
              border-2 
              border-dashed 
              border-[var(--color-border)] 
              rounded-[var(--radius-xl)]
              bg-[var(--card-bg)]
            "
          >
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              No addresses saved yet.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProfileAddressModal 
        isOpen={isOpen} 
        closeModal={closeModal} 
        addressToEdit={selectedAddress}
      />
    </div>
  );
}