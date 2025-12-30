import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  count?: number;
};

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await api.get<Category[]>('/categories');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCategory = (slug?: string) => {
  return useQuery<Category | undefined>({
    queryKey: ["categories", slug],
    queryFn: async () => {
      if (!slug) return undefined;
      const data = await api.get<Category>(`/categories/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

export default useCategories;
