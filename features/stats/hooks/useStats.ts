import { useEvents } from "../../events/hooks/useEvents";
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];



interface CategoryChartData {
  name: string;
  value: number;
  fill: string;
}

interface MonthlyChartData {
  name: string;
  cantidad: number;
}

export function useStats() {
  const { data: events = [], isLoading } = useEvents();

 
  const categoryData = events.reduce<CategoryChartData[]>((acc, event) => {
    const categoryName = event.type || "otro";
    const existing = acc.find((item) => item.name === categoryName);
    
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: categoryName, value: 1, fill: COLORS[acc.length % COLORS.length] });
    }
    return acc;
  }, []);

 
  const monthlyData = events.reduce<MonthlyChartData[]>((acc, event) => {
    const date = new Date(event.start_date);
    
    const monthName = date.toLocaleString("es-ES", { month: "short" });
    
    const existing = acc.find((item) => item.name === monthName);
    
    if (existing) {
      existing.cantidad++;
    } else {
      acc.push({ name: monthName, cantidad: 1 });
    }
    return acc;
  }, []);

  return {
    totalEvents: events.length,
    categoryData,
    monthlyData,
    isLoading
  };
}