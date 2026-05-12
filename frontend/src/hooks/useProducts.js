import {useQuery} from "@tanstack/react-query"
import { getAllProducts } from "../lib/api"

export const useProducts = () => {
    const result = useQuery({queryFn: getAllProducts})
}