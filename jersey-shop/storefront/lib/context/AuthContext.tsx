"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  division: string;
  isDefault: boolean;
}

export interface UserOrder {
  id: string;
  date: string;
  items: {
    name: string;
    size: string;
    quantity: number;
    price: number;
    customName?: string;
    customNumber?: string;
  }[];
  total: number;
  paymentMethod: string;
  status: "Pending COD" | "Processing" | "Printing" | "Dispatched" | "Delivered";
  trackingNumber?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  addresses: UserAddress[];
  orders: UserOrder[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, role?: "customer" | "admin") => boolean;
  logout: () => void;
  register: (name: string, email: string, phone: string) => boolean;
  updateProfile: (data: Partial<User>) => void;
  addOrderToUser: (order: UserOrder) => void;
  addAddress: (address: Omit<UserAddress, "id">) => void;
}

const DEMO_CUSTOMER: User = {
  id: "usr-001",
  name: "Tanvir Ahmed",
  email: "customer@ninetykits.com",
  phone: "01711223344",
  role: "customer",
  addresses: [
    {
      id: "addr-1",
      label: "Home (Uttara)",
      fullName: "Tanvir Ahmed",
      phone: "01711223344",
      address: "House 12, Road 5, Sector 11",
      district: "Dhaka",
      division: "Dhaka",
      isDefault: true,
    },
  ],
  orders: [
    {
      id: "NK-892410",
      date: "14 Aug 2026",
      items: [
        {
          name: "Brazil Home Kit 2026 World Edition",
          size: "L",
          quantity: 1,
          price: 1700,
          customName: "NEYMAR JR",
          customNumber: "10",
        },
      ],
      total: 1760,
      paymentMethod: "bKash",
      status: "Printing",
      trackingNumber: "PTH-892410-BD",
    },
    {
      id: "NK-718290",
      date: "02 Aug 2026",
      items: [
        {
          name: "Argentina 3-Star World Champions Home Kit",
          size: "M",
          quantity: 1,
          price: 1900,
          customName: "MESSI",
          customNumber: "10",
        },
      ],
      total: 1960,
      paymentMethod: "bKash",
      status: "Delivered",
      trackingNumber: "PTH-718290-BD",
    },
  ],
};

const DEMO_ADMIN: User = {
  id: "adm-001",
  name: "Operations Admin",
  email: "admin@ninetykits.com",
  phone: "01800909090",
  role: "admin",
  addresses: [],
  orders: [],
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("ninetykits_auth_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const login = (email: string, role: "customer" | "admin" = "customer"): boolean => {
    let targetUser: User;
    if (role === "admin" || email.toLowerCase().includes("admin")) {
      targetUser = { ...DEMO_ADMIN, email };
    } else {
      targetUser = { ...DEMO_CUSTOMER, email };
    }
    setUser(targetUser);
    localStorage.setItem("ninetykits_auth_user", JSON.stringify(targetUser));
    return true;
  };

  const register = (name: string, email: string, phone: string): boolean => {
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone,
      role: "customer",
      addresses: [],
      orders: [],
    };
    setUser(newUser);
    localStorage.setItem("ninetykits_auth_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ninetykits_auth_user");
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("ninetykits_auth_user", JSON.stringify(updated));
  };

  const addOrderToUser = (order: UserOrder) => {
    if (!user) return;
    const updatedOrders = [order, ...(user.orders || [])];
    const updated = { ...user, orders: updatedOrders };
    setUser(updated);
    localStorage.setItem("ninetykits_auth_user", JSON.stringify(updated));
  };

  const addAddress = (address: Omit<UserAddress, "id">) => {
    if (!user) return;
    const newAddr: UserAddress = {
      ...address,
      id: `addr-${Date.now().toString().slice(-4)}`,
    };
    const currentAddresses = user.addresses || [];
    const updatedAddresses = address.isDefault
      ? currentAddresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
      : currentAddresses.concat(newAddr);
    const updated = { ...user, addresses: updatedAddresses };
    setUser(updated);
    localStorage.setItem("ninetykits_auth_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        register,
        updateProfile,
        addOrderToUser,
        addAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
