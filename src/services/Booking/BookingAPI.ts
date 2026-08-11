import instance from "@/services/Axios/Axios";
import type { AxiosResponse } from "@/types/ResponseAPI";
import type { BookingStatus, IBooking, IBookingRequest } from "@/types/TypeBooking";

const CreateBooking = (data: IBookingRequest): Promise<{ data: AxiosResponse<IBooking> }> => {
  return instance.post("/bookings", data);
};

const GetAdminBookings = (): Promise<{ data: AxiosResponse<IBooking[]> }> => {
  return instance.get("/admin/bookings");
};

const UpdateAdminBookingStatus = (bookingId: string, status: BookingStatus): Promise<{ data: AxiosResponse<IBooking> }> => {
  return instance.patch(`/admin/bookings/${bookingId}/status`, { status });
};

const DeleteAdminBooking = (bookingId: string): Promise<{ data: AxiosResponse<void> }> => {
  return instance.delete(`/admin/bookings/${bookingId}`);
};

export { CreateBooking, DeleteAdminBooking, GetAdminBookings, UpdateAdminBookingStatus };
