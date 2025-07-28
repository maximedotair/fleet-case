"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Monitor, Database, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    name: "Devices",
    href: "/devices",
    icon: Monitor,
  },
  {
    name: "E-commerce",
    href: "/ecommerce",
    icon: Database,
  },
  {
    name: "Predictions",
    href: "/predictions",
    icon: TrendingUp,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white">Fleet Management</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-800",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold mx-2"
                      )}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}