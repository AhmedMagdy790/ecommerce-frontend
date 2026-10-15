export interface IModal {
  isOpen: boolean;
  closeModal: () => void;
  addressToEdit?: any;
}

export interface IOption {
  label: string;
  value: string;
}

export type TranslatedText = {
      ar: string;
      en: string;
      [key: string]: string;
    };

export type LanguageCode = keyof TranslatedText;