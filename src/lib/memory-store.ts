import bcrypt from "bcryptjs";

export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: string;
  membershipTier: string;
  loyaltyPoints: number;
  tripsCount: number;
  phone?: string;
  location?: string;
  bio?: string;
  wishlist: string[];
  createdAt: Date;
}

export interface MemoryBooking {
  _id: string;
  bookingReference: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  destinationId: string;
  destinationTitle: string;
  destinationSlug: string;
  destinationImage: string;
  travelDate: string;
  guestsCount: number;
  pricePerGuest: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  stripeSessionId?: string;
  createdAt: Date;
}

// Global persistent cache in Node process
declare global {
  // eslint-disable-next-line no-var
  var memoryStore:
    | {
        users: MemoryUser[];
        bookings: MemoryBooking[];
        aiPlans: any[];
      }
    | undefined;
}

const defaultPasswordHash = bcrypt.hashSync("LuxuryTravel2026!", 10);

const initialUsers: MemoryUser[] = [
  {
    id: "user-demo-1",
    name: "Victoria Sterling",
    email: "vip.nomad@herotravel.com",
    password: defaultPasswordHash,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    role: "vip",
    membershipTier: "blackcard",
    loyaltyPoints: 1250,
    tripsCount: 3,
    phone: "+44 20 7946 0912",
    location: "Mayfair, London",
    bio: "Passionate globetrotter with an affinity for private Riva yacht excursions, high alpine wellness, and Michelin gastronomy.",
    wishlist: ["amalfi-coast-cliffside-escape", "swiss-alps-alpine-panorama"],
    createdAt: new Date(),
  },
];

const initialBookings: MemoryBooking[] = [
  {
    _id: "bk-1",
    bookingReference: "HT-AMALFI-882",
    userId: "user-demo-1",
    customerName: "Victoria Sterling",
    customerEmail: "vip.nomad@herotravel.com",
    destinationId: "amalfi-coast-cliffside-escape",
    destinationTitle: "Amalfi Coast Private Cliffside Escape",
    destinationSlug: "amalfi-coast-cliffside-escape",
    destinationImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
    travelDate: "May 15, 2026",
    guestsCount: 2,
    pricePerGuest: 3450,
    totalPrice: 6900,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(),
  },
];

if (!global.memoryStore) {
  global.memoryStore = {
    users: initialUsers,
    bookings: initialBookings,
    aiPlans: [],
  };
}

export const memoryStore = global.memoryStore;
