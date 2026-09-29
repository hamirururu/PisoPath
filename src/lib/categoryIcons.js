import {
  Bike, Bus, Car, Film, Gamepad2, GraduationCap, HeartPulse, Home,
  Receipt, ShoppingBag, ShoppingCart, Smartphone, Sparkles, Tag,
  TrainFront, UtensilsCrossed,
} from "lucide-react";

export const categoryIcons = {
  Transportation: Bus,
  Food: UtensilsCrossed,
  Groceries: ShoppingCart,
  Shopping: ShoppingBag,
  Electronics: Smartphone,
  "Personal Care": Sparkles,
  Bills: Receipt,
  "Mobile Load": Smartphone,
  Entertainment: Film,
  Gaming: Gamepad2,
  Education: GraduationCap,
  Healthcare: HeartPulse,
  Household: Home,
  Other: Tag,
};

export function getCategoryIcon(category) {
  return categoryIcons[category] || Tag;
}

const transportIcons = {
  Jeepney: Bus,
  Tricycle: Bike,
  Bus,
  "UV Express": Car,
  MRT: TrainFront,
  LRT: TrainFront,
  Taxi: Car,
  Grab: Car,
  Angkas: Bike,
  Motorcycle: Bike,
  Other: Car,
};

export function getTransportIcon(type) {
  return transportIcons[type] || Car;
}