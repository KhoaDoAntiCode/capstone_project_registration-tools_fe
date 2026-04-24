// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { LogOut, ChevronRight, LayoutDashboard, FileText, Users } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { NAV_ITEMS } from "@/types/capstone.constants";

// // icon map vì NAV_ITEMS là const (không lưu được JSX)
// const NAV_ICONS = {
//   overview: LayoutDashboard,
//   manage: FileText,
//   council: Users,
// } as const;

// interface SidebarProps {
//   open: boolean;
// }

// export function Sidebar({ open }: SidebarProps) {
//   const pathname = usePathname();

//   return (
//     <aside
//       className={cn(
//         "fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-100 flex flex-col shadow-sm transition-all duration-300",
//         open ? "w-56" : "w-0 overflow-hidden"
//       )}
//     >
//       {/* Logo */}
//       <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 shrink-0">
//         <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
//           <span className="text-white font-bold text-sm">FPT</span>
//         </div>
//         <div className="overflow-hidden">
//           <p className="font-bold text-gray-800 text-sm leading-tight whitespace-nowrap">FPT University</p>
//           <p className="text-xs text-gray-400 whitespace-nowrap">Quản lý luận văn</p>
//         </div>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
//         {NAV_ITEMS.map((item) => {
//           const Icon = NAV_ICONS[item.id];
//           const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

//           return (
//             <Link
//               key={item.id}
//               href={item.href}
//               className={cn(
//                 "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
//                 isActive
//                   ? "bg-orange-50 text-orange-600"
//                   : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
//               )}
//             >
//               <Icon size={17} className="shrink-0" />
//               <span>{item.label}</span>
//               {isActive && (
//                 <ChevronRight size={14} className="ml-auto text-orange-400" />
//               )}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout */}
//       <div className="p-3 border-t border-gray-100 shrink-0">
//         <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all whitespace-nowrap">
//           <LogOut size={17} className="shrink-0" />
//           <span>Đăng xuất</span>
//         </button>
//       </div>
//     </aside>
//   );
// }