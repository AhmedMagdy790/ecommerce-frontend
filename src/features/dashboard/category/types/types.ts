export interface NavItem {
  id: string | number;
  label: string;
  url: string;
}

export interface SubCategory {
  id: string | number;
  name: string;
  items: NavItem[];
}

export interface ICategory {
  id: number;
  name: string;
  image: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  parent?: ICategory;
  children?: ICategory[];
}

export interface ICategoryPayload {
  name: string;
  slug?: string;
  description?: string | null;
  parent_id?: number | null;
  status?: 'active' | 'inactive';
}


export interface ICategoryState {
  categories: ICategory [];
  adminCategories: ICategory[];
  trashedCategories: ICategory[];
  stats: {
    all: number | null,
    total: number | null,
    active: number | null,
    inactive:number | null,
    trashed:number | null,
  },
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPublicCategories: () => Promise<void>;
  fetchAdminCategories: () => Promise<void>;
  fetchTrashed: () => void;
  restoreCategory: (id: number) => Promise<void>;
  addCategory: (payload: ICategoryPayload) => Promise<boolean>;
  updateCategory: (id: number, payload: Partial<ICategoryPayload>) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<void>;
  toggleCategoryStatus: (id: number, currentStatus: 'active' | 'inactive') => Promise<void>;
}
