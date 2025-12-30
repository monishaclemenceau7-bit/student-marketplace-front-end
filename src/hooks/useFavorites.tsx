import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Product } from "./useProducts";

export const useFavorites = () => {
  return useQuery<Product[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const data = await api.get<Product[]>('/auth/favorites');
      return data;
    },
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      return api.post(`/auth/favorites/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      return api.del(`/auth/favorites/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useToggleFavorite = () => {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  
  return {
    toggleFavorite: async (productId: string, isFavorite: boolean) => {
      if (isFavorite) {
        return removeFavorite.mutateAsync(productId);
      } else {
        return addFavorite.mutateAsync(productId);
      }
    },
    isLoading: addFavorite.isPending || removeFavorite.isPending,
  };
};
