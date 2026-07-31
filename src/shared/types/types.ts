export interface IModal {
  isOpen: boolean;
  closeModal: () => void;
  addressToEdit?: any;
}

export interface IOption {
  label: string;
  value: string;
}
