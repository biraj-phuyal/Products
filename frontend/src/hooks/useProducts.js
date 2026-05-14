import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../lib/api";

export const useProducts = () => {
    const result = useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
        staleTime: 60 * 1000,
        retry: 2,
    });
    return result;
};

export const useCreateProduct = () => {
  return useMutation({ mutationFn: createProduct });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};


export const useDeleteProduct = () => {
  return useMutation({ mutationFn: deleteProduct });
};
