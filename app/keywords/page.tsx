"use client";
import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";

// Optimized Strict Micro-Targeted Keyword Dataset Matrix
const KEYWORDS_DATASET = [
  // Batch 1: Tech & Gadgets
  { name: "Power Banks", keyword: "Power Bank Portable", desc: "Ultra fast charging portable power", icon: "Battery", category: "Tech" },
  { name: "Wireless Earbuds", keyword: "Earbuds Wireless Bluetooth", desc: "Premium noise cancelling audio", icon: "Headphones", category: "Tech" },
  { name: "Smart Watches", keyword: "Smart Watch Sport", desc: "Fitness tracking luxury wearables", icon: "Watch", category: "Tech" },
  { name: "Phone Cases", keyword: "Phone Case Shockproof", desc: "Stylish shockproof protection", icon: "Smartphone", category: "Tech" },
  { name: "Fast Chargers", keyword: "Fast Charger GaN", desc: "GaN technology rapid charging", icon: "Zap", category: "Tech" },
  { name: "Bluetooth Speakers", keyword: "Speaker Bluetooth Portable", desc: "Portable waterproof sound systems", icon: "Volume2", category: "Tech" },
  { name: "Action Cameras", keyword: "Action Camera 4K", desc: "4K adventure waterproof cameras", icon: "Camera", category: "Tech" },
  { name: "Wireless Mice", keyword: "Mouse Wireless Ergonomic", desc: "Ergonomic silent click devices", icon: "Mouse", category: "Tech" },
  { name: "Mechanical Keyboards", keyword: "Mechanical Keyboard RGB", desc: "RGB gaming typing experience", icon: "Keyboard", category: "Tech" },
  { name: "Portable SSDs", keyword: "External Portable SSD", desc: "Ultra fast external storage", icon: "HardDrive", category: "Tech" },
  { name: "Ring Lights", keyword: "Ring Light LED", desc: "Content creator professional lighting", icon: "Lightbulb", category: "Tech" },
  { name: "Mini Projectors", keyword: "Mini Projector Portable", desc: "Portable home theater experience", icon: "Monitor", category: "Tech" },
  { name: "Wireless Chargers", keyword: "Wireless Charger Magnetic", desc: "Magnetic fast charging pads", icon: "BatteryCharging", category: "Tech" },
  { name: "Laptop Stands", keyword: "Laptop Stand Aluminum", desc: "Ergonomic portable aluminum stands", icon: "Laptop", category: "Tech" },
  { name: "Noise Cancelling Headphones", keyword: "Headphones Noise Cancelling", desc: "Premium over ear audio", icon: "Headphones", category: "Tech" },
  { name: "Webcams", keyword: "Webcam 4K Streaming", desc: "4K streaming quality cameras", icon: "Camera", category: "Tech" },
  { name: "USB Hubs", keyword: "USB Hub Multiport", desc: "Multiport high speed expansion", icon: "Cable", category: "Tech" },
  { name: "Tablet Cases", keyword: "Tablet Case Protective", desc: "Protective slim keyboard cases", icon: "Tablet", category: "Tech" },
  { name: "E Ink Readers", keyword: "E-Ink Reader Tablet", desc: "Paperlike digital reading", icon: "BookOpen", category: "Tech" },
  { name: "Gaming Headsets", keyword: "Gaming Headset Microphone", desc: "Surround sound mic headsets", icon: "Headphones", category: "Tech" },
  // Batch 2: Smart Home & Solar
  { name: "Smart Bulbs", keyword: "Smart Bulb RGB", desc: "Voice controlled RGB lighting", icon: "Lamp", category: "Smart Home" },
  { name: "LED Strip Lights", keyword: "LED Strip Lights", desc: "Color changing home ambiance", icon: "Lightbulb", category: "Smart Home" },
  { name: "Security Cameras", keyword: "Security Camera Wireless", desc: "AI wireless home monitoring", icon: "Camera", category: "Smart Home" },
  { name: "Robot Vacuums", keyword: "Robot Vacuum Cleaner", desc: "Smart automatic cleaning", icon: "Bot", category: "Smart Home" },
  { name: "Smart Plugs", keyword: "Smart Plug WiFi", desc: "Voice activated power control", icon: "Plug", category: "Smart Home" },
  { name: "Solar Panels", keyword: "Solar Panel Monocrystalline", desc: "Portable high efficiency power", icon: "Sun", category: "Solar Energy" },
  { name: "Solar Chargers", keyword: "Solar Charger Powerbank", desc: "Outdoor device solar power", icon: "Sun", category: "Solar Energy" },
  { name: "Power Stations", keyword: "Portable Power Station", desc: "Portable solar generators", icon: "BatteryCharging", category: "Solar Energy" },
  { name: "Solar Lights", keyword: "Solar Lights Outdoor", desc: "Outdoor motion sensor lighting", icon: "Sun", category: "Solar Energy" },
  { name: "Humidifiers", keyword: "Humidifier Ultrasonic", desc: "Quiet ultrasonic cool mist", icon: "Droplet", category: "Smart Home" },
  { name: "Air Purifiers", keyword: "Air Purifier HEPA", desc: "HEPA smart air cleaners", icon: "Wind", category: "Smart Home" },
  { name: "Smart Locks", keyword: "Smart Lock Fingerprint", desc: "Keyless fingerprint entry", icon: "Lock", category: "Smart Home" },
  { name: "Doorbell Cameras", keyword: "Video Doorbell Camera", desc: "Video visitor security", icon: "Bell", category: "Smart Home" },
  { name: "Thermostats", keyword: "Smart Thermostat WiFi", desc: "Energy saving temperature control", icon: "Thermometer", category: "Smart Home" },
  { name: "Solar Lanterns", keyword: "Solar Lantern Camping", desc: "Camping emergency light", icon: "Sun", category: "Solar Energy" },
  { name: "Portable Fans", keyword: "Portable Fan Rechargeable", desc: "Rechargeable neck fans", icon: "Wind", category: "Smart Home" },
  { name: "Massage Chairs", keyword: "Massage Chair Electric", desc: "Full body relaxation seating", icon: "Chair", category: "Smart Home" },
  { name: "Pet Cameras", keyword: "Pet Camera WiFi", desc: "Treat dispensing home cams", icon: "Camera", category: "Smart Home" },
  { name: "Sound Machines", keyword: "White Noise Sound Machine", desc: "White noise sleep therapy", icon: "VolumeX", category: "Smart Home" },
  { name: "Smart Scales", keyword: "Smart Scale Body", desc: "Body composition analysis", icon: "Scale", category: "Smart Home" },
  // Batch 3: Beauty & Skincare
  { name: "Face Serums", keyword: "Face Serum Vitamin", desc: "Vitamin C glowing skin", icon: "Sparkles", category: "Skincare" },
  { name: "Moisturizers", keyword: "Face Moisturizer Cream", desc: "Hydrating luxury creams", icon: "Droplet", category: "Skincare" },
  { name: "Eye Masks", keyword: "Under Eye Mask", desc: "Collagen under eye care", icon: "Eye", category: "Skincare" },
  { name: "LED Face Masks", keyword: "LED Mask Light Therapy", desc: "Red light therapy device", icon: "Mask", category: "Skincare" },
  { name: "Lip Gloss", keyword: "Lip Gloss Plumping", desc: "Plumping hydrating shine", icon: "Heart", category: "Makeup" },
  { name: "Mascara", keyword: "Mascara Waterproof", desc: "Volume lengthening lashes", icon: "Eye", category: "Makeup" },
  { name: "Foundations", keyword: "Liquid Foundation Makeup", desc: "Long wear flawless coverage", icon: "Palette", category: "Makeup" },
  { name: "Hair Straighteners", keyword: "Hair Straightener Flat Iron", desc: "Ceramic ionic styling", icon: "Scissors", category: "Makeup" },
  { name: "Facial Cleansers", keyword: "Facial Cleanser Foam", desc: "Deep pore cleansing brush", icon: "Sparkles", category: "Skincare" },
  { name: "Retinol Creams", keyword: "Retinol Cream Face", desc: "Anti aging night repair", icon: "Sparkles", category: "Skincare" },
  { name: "Hyaluronic Serums", keyword: "Hyaluronic Acid Serum", desc: "Intense hydration boosters", icon: "Droplet", category: "Skincare" },
  { name: "BB Creams", keyword: "BB Cream Foundation", desc: "Multi function skin tint", icon: "Palette", category: "Makeup" },
  { name: "Eyelash Extensions", keyword: "Eyelash Extension DIY", desc: "Natural volume clusters", icon: "Eye", category: "Makeup" },
  { name: "Lip Balms", keyword: "Lip Balm Moisturizing", desc: "SPF nourishing care", icon: "Heart", category: "Makeup" },
  { name: "Curling Irons", keyword: "Curling Iron Hair", desc: "Beach wave hair tools", icon: "Scissors", category: "Makeup" },
  { name: "Nail Polish Sets", keyword: "Gel Nail Polish Set", desc: "Long lasting gel colors", icon: "Sparkles", category: "Makeup" },
  { name: "Sheet Masks", keyword: "Facial Sheet Mask", desc: "Hydrating facial treatments", icon: "Mask", category: "Skincare" },
  { name: "Jade Rollers", keyword: "Jade Roller Face", desc: "Facial lymphatic drainage", icon: "Skincare" },
  { name: "Sunscreens", keyword: "Sunscreen SPF 50", desc: "SPF50 daily protection", icon: "Sun", category: "Skincare" },
  { name: "Hair Oils", keyword: "Hair Growth Oil", desc: "Nourishing growth serums", icon: "Scissors", category: "Skincare" },
  // Batch 4: Fitness & Outdoors
  { name: "Resistance Bands", keyword: "Resistance Bands Fitness", desc: "Home gym strength training", icon: "Dumbbell", category: "Fitness" },
  { name: "Yoga Mats", keyword: "Yoga Mat Non Slip", desc: "Non slip premium exercise", icon: "Dumbbell", category: "Fitness" },
  { name: "Massage Guns", keyword: "Massage Gun Deep Tissue", desc: "Deep tissue percussion relief", icon: "Zap", category: "Fitness" },
  { name: "Jump Ropes", keyword: "Jump Rope Speed", desc: "Speed training fitness ropes", icon: "Activity", category: "Fitness" },
  { name: "Dumbbell Sets", keyword: "Dumbbell Weight Set", desc: "Adjustable home weights", icon: "Dumbbell", category: "Fitness" },
  { name: "Camping Tents", keyword: "Camping Tent Waterproof", desc: "Waterproof outdoor shelters", icon: "Tent", category: "Outdoors" },
  { name: "Sleeping Bags", keyword: "Sleeping Bag Camping", desc: "Warm lightweight camping", icon: "Moon", category: "Outdoors" },
  { name: "Hiking Backpacks", keyword: "Hiking Backpack Waterproof", desc: "Durable trekking daypacks", icon: "Backpack", category: "Outdoors" },
  { name: "Camping Chairs", keyword: "Camping Chair Folding", desc: "Portable folding comfort", icon: "Chair", category: "Outdoors" },
  { name: "Hammocks", keyword: "Camping Hammock Portable", desc: "Lightweight travel relaxation", icon: "Tent", category: "Outdoors" },
  { name: "Trekking Poles", keyword: "Trekking Poles Hiking", desc: "Adjustable hiking support", icon: "Compass", category: "Outdoors" },
  { name: "Inflatable Kayaks", keyword: "Inflatable Kayak Boat", desc: "Portable adventure paddling", icon: "Anchor", category: "Outdoors" },
  { name: "Fishing Rods", keyword: "Fishing Rod Carbon", desc: "Telescopic portable gear", icon: "Anchor", category: "Outdoors" },
  { name: "Portable Coolers", keyword: "Cooler Bag Insulated", desc: "Insulated picnic travel", icon: "Snowflake", category: "Outdoors" },
  { name: "Protein Shakers", keyword: "Protein Shaker Bottle", desc: "Leakproof gym bottles", icon: "Bottle", category: "Fitness" },
  { name: "Pull Up Bars", keyword: "Pull Up Bar Doorway", desc: "Doorway home strength", icon: "Dumbbell", category: "Fitness" },
  { name: "Yoga Blocks", keyword: "Yoga Blocks Foam", desc: "Supportive foam props", icon: "Dumbbell", category: "Fitness" },
  { name: "Kettlebells", keyword: "Kettlebell Weight Fitness", desc: "Strength training weights", icon: "Dumbbell", category: "Fitness" },
  { name: "Compression Socks", keyword: "Compression Socks Running", desc: "Circulation boosting wear", icon: "Footprints", category: "Fitness" },
  { name: "Posture Correctors", keyword: "Posture Corrector Back", desc: "Adjustable back support", icon: "Activity", category: "Fitness" },
  // Batch 5: Kitchen, Car, Fashion & Home
  { name: "Air Fryers", keyword: "Air Fryer Electric", desc: "Healthy oil free cooking", icon: "ChefHat", category: "Kitchen" },
  { name: "Electric Kettles", keyword: "Electric Kettle Stainless", desc: "Temperature control boiling", icon: "Coffee", category: "Kitchen" },
  { name: "Knife Sets", keyword: "Kitchen Knife Set", desc: "Sharp stainless steel blades", icon: "Utensils", category: "Kitchen" },
  { name: "Portable Blenders", keyword: "Portable Blender USB", desc: "Rechargeable smoothie makers", icon: "Utensils", category: "Kitchen" },
  { name: "Slow Cookers", keyword: "Slow Cooker Pot", desc: "Set and forget meals", icon: "ChefHat", category: "Kitchen" },
  { name: "Car Phone Mounts", keyword: "Car Phone Holder", desc: "360 dashboard car holders", icon: "Smartphone", category: "Car Accessories" },
  { name: "Dash Cams", keyword: "Dash Cam 4K", desc: "4K night vision recorders", icon: "Camera", category: "Car Accessories" },
  { name: "Car Vacuums", keyword: "Car Vacuum Cleaner", desc: "Portable powerful cleaners", icon: "Wind", category: "Car Accessories" },
  { name: "Tire Inflators", keyword: "Tire Inflator Digital", desc: "Digital air compressors", icon: "Gauge", category: "Car Accessories" },
  { name: "Car Organizers", keyword: "Car Trunk Organizer", desc: "Trunk seat storage", icon: "Package", category: "Car Accessories" },
  { name: "Jewelry Sets", keyword: "Jewelry Set Crystal", desc: "Stainless steel elegance", icon: "Gem", category: "Fashion" },
  { name: "Sunglasses", keyword: "Sunglasses Polarized", desc: "Polarized UV protection", icon: "Glasses", category: "Fashion" },
  { name: "Wrist Watches", keyword: "Quartz Wrist Watch", desc: "Fashion quartz timepieces", icon: "Watch", category: "Fashion" },
  { name: "Crossbody Bags", keyword: "Crossbody Bag Women", desc: "Stylish vegan leather", icon: "ShoppingBag", category: "Fashion" },
  { name: "RFID Wallets", keyword: "RFID Wallet Leather", desc: "Slim minimalist protection", icon: "Wallet", category: "Fashion" },
  { name: "Weighted Blankets", keyword: "Weighted Blanket Therapy", desc: "Calming deep sleep comfort", icon: "Bed", category: "Home" },
  { name: "Bamboo Sheets", keyword: "Bamboo Bed Sheets", desc: "Luxury cooling bedding", icon: "Bed", category: "Home" },
  { name: "Essential Oil Diffusers", keyword: "Essential Oil Diffuser", desc: "Aromatherapy ultrasonic", icon: "Leaf", category: "Home" },
  { name: "Neck Massagers", keyword: "Neck Massager Electric", desc: "Shiatsu electric relief", icon: "Activity", category: "Home" },
  { name: "Foot Massagers", keyword: "Foot Massager Heated", desc: "Heated deep kneading", icon: "Footprints", category: "Home" }
];

const FILTER_CATEGORIES = ["All", "Tech", "Smart Home", "Solar Energy", "Skincare", "Makeup", "Fitness", "Outdoors", "Kitchen", "Car Accessories", "Fashion", "Home"];

export default function KeywordsHubPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredItems = activeTab === "All" 
    ? KEYWORDS_DATASET 
    : KEYWORDS_DATASET.filter(item => item.category === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-[#f5f5f5]">
      {/* Premium Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl mb-3">
          Explore by <span className="text-orange-500">Quick Tags</span>
        </h1>
        <p className="text-sm text-gray-500">
          Skip complex sub-menus. Click any micro-niche card to access high-rating exact products straight from the live pipeline.
        </p>
      </div>

      {/* Category Horizontal Navigation Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {FILTER_CATEGORIES.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              activeTab === tab 
                ? "bg-orange-500 text-white border-orange-500 shadow-xs" 
                : "bg-white border-gray-200 text-gray-600 hover:border-orange-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Thin Premium Cards Grid System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredItems.map((item) => {
          const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
          const cleanSlug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

          return (
            <Link
              key={item.name}
              href={`/keywords/${cleanSlug}`}
              onClick={() => {
                sessionStorage.setItem("sp_active_tag", item.keyword);
                sessionStorage.setItem("sp_active_name", item.name);
              }}
              className="group bg-white border border-gray-100 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all duration-200 relative overflow-hidden flex items-center gap-3.5 border-l-4 border-l-orange-500/80"
            >
              <div className="p-2.5 rounded-lg bg-gray-50 text-gray-700 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors shrink-0">
                <IconComponent size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors truncate">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  #{item.name.toLowerCase().replace(/\s+/g, "")}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {item.desc}
                </p>
              </div>

              <div className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all text-sm font-bold shrink-0 pl-1">
                →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
