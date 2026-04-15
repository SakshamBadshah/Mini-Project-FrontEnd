export const API_BASE = "http://localhost:5000/api";

export const CATEGORIES = [
  { id: "all",     label: "All",      emoji: "🍽️" },
  { id: "pizza",   label: "Pizza",    emoji: "🍕" },
  { id: "burger",  label: "Burgers",  emoji: "🍔" },
  { id: "sushi",   label: "Sushi",    emoji: "🍣" },
  { id: "indian",  label: "Indian",   emoji: "🍛" },
  { id: "chinese", label: "Chinese",  emoji: "🥡" },
  { id: "dessert", label: "Desserts", emoji: "🍰" },
  { id: "drinks",  label: "Drinks",   emoji: "🥤" },
];


export const MENU_ITEMS = [
  {
    _id: "1", name: "Margherita Pizza",
    desc: "Classic tomato, mozzarella, fresh basil on thin crust",
    price: 299, category: "pizza", emoji: "🍕",
    rating: 4.8, time: "25 min", badge: "Bestseller", veg: true,
  },
  {
    _id: "2", name: "Smoky BBQ Burger",
    desc: "Grilled beef patty, smoked cheddar, caramelized onions",
    price: 249, category: "burger", emoji: "🍔",
    rating: 4.6, time: "20 min", badge: null, veg: false,
  },
  {
    _id: "3", name: "Dragon Roll",
    desc: "Spicy tuna, cucumber, topped with avocado & tobiko",
    price: 449, category: "sushi", emoji: "🍣",
    rating: 4.9, time: "30 min", badge: "Chef's Pick", veg: false,
  },
  {
    _id: "4", name: "Butter Chicken",
    desc: "Tender chicken in rich tomato-cream sauce, garlic naan",
    price: 329, category: "indian", emoji: "🍛",
    rating: 4.7, time: "35 min", badge: null, veg: false,
  },
  {
    _id: "5", name: "Kung Pao Noodles",
    desc: "Stir-fried egg noodles with tofu, peanuts & chilli oil",
    price: 199, category: "chinese", emoji: "🥡",
    rating: 4.5, time: "18 min", badge: "New", veg: true,
  },
  {
    _id: "6", name: "Choco Lava Cake",
    desc: "Warm dark chocolate cake with vanilla ice cream",
    price: 149, category: "dessert", emoji: "🍰",
    rating: 4.9, time: "15 min", badge: "Popular", veg: true,
  },
  {
    _id: "7", name: "Watermelon Mint Cooler",
    desc: "Fresh watermelon blended with mint and lime",
    price: 99, category: "drinks", emoji: "🥤",
    rating: 4.4, time: "5 min", badge: null, veg: true,
  },
  {
    _id: "8", name: "Pepperoni Supreme",
    desc: "Double pepperoni, roasted peppers, jalapeños",
    price: 349, category: "pizza", emoji: "🍕",
    rating: 4.7, time: "28 min", badge: "Spicy 🌶️", veg: false,
  },
  {
    _id: "9", name: "Crispy Fried Chicken",
    desc: "Southern-style fried chicken with honey mustard",
    price: 279, category: "burger", emoji: "🍗",
    rating: 4.6, time: "22 min", badge: null, veg: false,
  },
  {
    _id: "10", name: "Palak Paneer",
    desc: "Cottage cheese in spiced spinach gravy with jeera rice",
    price: 289, category: "indian", emoji: "🥘",
    rating: 4.5, time: "30 min", badge: null, veg: true,
  },
  {
    _id: "11", name: "Mango Lassi",
    desc: "Chilled Alphonso mango blended with yogurt & cardamom",
    price: 119, category: "drinks", emoji: "🥭",
    rating: 4.8, time: "5 min", badge: "Summer Hit", veg: true,
  },
  {
    _id: "12", name: "Tiramisu Cup",
    desc: "Espresso-soaked ladyfingers, mascarpone cream, cocoa",
    price: 169, category: "dessert", emoji: "☕",
    rating: 4.7, time: "10 min", badge: null, veg: true,
  },
];


export const SAMPLE_ORDERS = [
  {
    _id: "ORD-2801", date: "30 Mar 2026",
    items: ["🍣", "🥡"], total: 648,
    status: "Preparing", restaurant: "Sushi World",
  },
  {
    _id: "ORD-2841", date: "28 Mar 2026",
    items: ["🍕", "🥤", "🍰"], total: 547,
    status: "Delivered", restaurant: "Pizza Palace",
  },
  {
    _id: "ORD-2795", date: "25 Mar 2026",
    items: ["🍔", "🍗", "🥤"], total: 627,
    status: "Delivered", restaurant: "Burger Hub",
  },
];
