import { useQuery } from "@tanstack/react-query"

export function useTest() {
  return useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      return ["hola", "mundo"]
    },
  })
}