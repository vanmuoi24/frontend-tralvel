export type BookingStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "DONE" | "CANCELLED";

export type IBookingRequest = {
  serviceName: string;
  itemName: string;
  requestedTime: string;
  people: number;
  phone: string;
  email?: string;
  wechat?: string;
  telegram?: string;
  note?: string;
};

export type IBooking = IBookingRequest & {
  id: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};
