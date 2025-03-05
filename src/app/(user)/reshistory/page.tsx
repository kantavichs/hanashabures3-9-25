"use client";
import UserDesktopNavbar from "@/components/UserDesktopNavbar";
import UserMobileNavbar from "@/components/UserMobileNavbar";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import html2canvas from 'html2canvas';

type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

// Define the type for our booking data
type BookingData = {
    id: string;
    date: string;
    time: string;
    people: number;
    tableNo: string;
    customerName: string;
    phoneNumber: string;
    status: BookingStatus;
};

export default function BookingHistory() {
    // This will be populated from the API
    const [bookingData, setBookingData] = useState<BookingData[]>([]);
    const [filter, setFilter] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Fetch reservations from the API
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                // In a real application, you would get the customer ID from authentication
                // For now, we'll fetch all reservations
                const response = await fetch('/api/reservations');

                if (response.ok) {
                    const data = await response.json();

                    // Transform the data to match our BookingData type
                    const formattedData: BookingData[] = data.map((reservation: any) => ({
                        id: `B${reservation.resID.toString().padStart(3, '0')}`,
                        date: reservation.resDate,
                        time: reservation.resTime,
                        people: reservation.numberOfPeople,
                        tableNo: reservation.table ? reservation.table.tabTypes : 'Unknown',
                        customerName: reservation.resName,
                        phoneNumber: reservation.customer ? reservation.customer.customerPhone : 'Unknown',
                        status: (reservation.resStatus as BookingStatus) || 'pending',
                    }));

                    setBookingData(formattedData);
                } else {
                    console.error('Failed to fetch reservations');
                    // Use sample data as fallback
                    setBookingData([
                        {
                            id: "B001",
                            date: "2025-03-05",
                            time: "18:00",
                            people: 4,
                            tableNo: "A12",
                            customerName: "คุณสมชาย ใจดี",
                            phoneNumber: "081-234-5678",
                            status: "confirmed",
                        },
                        {
                            id: "B002",
                            date: "2025-03-10",
                            time: "19:30",
                            people: 2,
                            tableNo: "B08",
                            customerName: "คุณสมศรี มีสุข",
                            phoneNumber: "089-876-5432",
                            status: "confirmed",
                        },
                    ]);
                }
            } catch (error) {
                console.error('Error fetching reservations:', error);
                // Use sample data as fallback
                setBookingData([
                    {
                        id: "B001",
                        date: "2025-03-05",
                        time: "18:00",
                        people: 4,
                        tableNo: "A12",
                        customerName: "คุณสมชาย ใจดี",
                        phoneNumber: "081-234-5678",
                        status: "confirmed",
                    },
                ]);
            }
        };

        fetchReservations();
    }, []);

    const filteredBookings = filter === "all"
        ? bookingData
        : bookingData.filter(booking => booking.status === filter);

    const getStatusBadge = (status: BookingStatus) => {
        const statusConfig = {
            confirmed: { label: "ยืนยันแล้ว", className: "bg-green-500 text-white" },
            pending: { label: "รอยืนยัน", className: "bg-yellow-500 text-white" },
            cancelled: { label: "ยกเลิกแล้ว", className: "bg-red-500 text-white" }
        };

        return (
            <Badge className={statusConfig[status].className}>
                {statusConfig[status].label}
            </Badge>
        );
    };

    const formatDate = (dateStr: string) => {
        const options = { year: 'numeric' as 'numeric' | '2-digit', month: 'long' as 'long' | 'short' | 'narrow', day: 'numeric' as 'numeric' | '2-digit' };
        return new Date(dateStr).toLocaleDateString('th-TH', options);
    };

    const handleViewDetails = (booking: typeof bookingData[0]) => {
        if (booking.status === "confirmed") {
            setSelectedBooking(booking);
            setIsDialogOpen(true);
        }
    };

    const handleCaptureDetails = async () => {
        if (!selectedBooking) return;

        const detailsElement = document.getElementById('booking-details');
        if (detailsElement) {
            try {
                const canvas = await html2canvas(detailsElement);
                const image = canvas.toDataURL("image/png");

                // สร้าง element ลิงก์สำหรับดาวน์โหลด
                const downloadLink = document.createElement('a');
                downloadLink.href = image;
                downloadLink.download = `booking-${selectedBooking.id}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } catch (err) {
                console.error("ไม่สามารถแคปเจอร์รายละเอียดได้:", err);
                alert("เกิดข้อผิดพลาดในการแคปเจอร์รายละเอียด");
            }
        }
    };

    return (
        <>
            <div className="hidden lg:flex fixed top-0 left-0 right-0">
                <UserDesktopNavbar />
            </div>

            <div className="lg:hidden fixed top-0 left-0 right-0 z-10">
                <UserMobileNavbar />
            </div>

            <div className="container mx-auto px-4 py-16 mt-10">
                <h1 className="text-3xl font-bold mb-6">ประวัติการจอง</h1>

                <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center">
                        <span className="mr-2">สถานะ:</span>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="เลือกสถานะ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ทั้งหมด</SelectItem>
                                <SelectItem value="confirmed">ยืนยันแล้ว</SelectItem>
                                <SelectItem value="pending">รอยืนยัน</SelectItem>
                                <SelectItem value="cancelled">ยกเลิกแล้ว</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button variant="outline">จองโต๊ะเพิ่ม</Button>
                </div>

                {/* for big screen */}
                <div className="hidden md:block">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>รายการจองทั้งหมด</CardTitle>
                            <p className="text-sm text-gray-500">แสดงประวัติการจองโต๊ะล่าสุดของคุณ</p>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[70vh] overflow-y-auto">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-white z-10">
                                        <TableRow>
                                            <TableHead>รหัสการจอง</TableHead>
                                            <TableHead>วันที่</TableHead>
                                            <TableHead>เวลา</TableHead>
                                            <TableHead>จำนวนคน</TableHead>
                                            <TableHead>โต๊ะ</TableHead>
                                            <TableHead>สถานะ</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBookings.map((booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell className="font-medium">{booking.id}</TableCell>
                                                <TableCell>{formatDate(booking.date)}</TableCell>
                                                <TableCell>{booking.time} น.</TableCell>
                                                <TableCell>{booking.people} คน</TableCell>
                                                <TableCell>{booking.tableNo}</TableCell>
                                                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        {booking.status === "confirmed" && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleViewDetails(booking)}
                                                            >
                                                                ดูรายละเอียด
                                                            </Button>
                                                        )}
                                                        {(booking.status === "confirmed" || booking.status === "pending") && (
                                                            <>
                                                                <Button variant="destructive" size="sm">ยกเลิก</Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* for small screen */}
                <div className="md:hidden space-y-4 max-h-[80vh] overflow-y-auto pb-4">
                    {filteredBookings.map((booking) => (
                        <Card key={booking.id} className="w-full">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>{booking.id}</CardTitle>
                                    {getStatusBadge(booking.status)}
                                </div>
                                <p className="text-sm text-gray-500">
                                    {formatDate(booking.date)} | {booking.time} น.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">จำนวนคน:</span>
                                        <span>{booking.people} คน</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">โต๊ะ:</span>
                                        <span>{booking.tableNo}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                {booking.status === "confirmed" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewDetails(booking)}
                                    >
                                        ดูรายละเอียด
                                    </Button>
                                )}
                                {(booking.status === "confirmed" || booking.status === "pending") && (
                                    <>
                                        <Button variant="destructive" size="sm">ยกเลิก</Button>
                                    </>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Modal รายละเอียดการจอง */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>รายละเอียดการจอง</DialogTitle>
                            <DialogDescription>
                                รหัสการจอง: {selectedBooking?.id}
                            </DialogDescription>
                        </DialogHeader>

                        <div id="booking-details" className="p-4 border rounded-lg bg-white">
                            <div className="mb-4 text-center">
                                <h3 className="text-xl font-bold">ร้านชาบูอร่อย</h3>
                                <p className="text-sm text-gray-500">ใบยืนยันการจอง</p>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-gray-600">รหัสการจอง:</div>
                                    <div className="font-medium">{selectedBooking?.id}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-gray-600">ชื่อผู้จอง:</div>
                                    <div className="font-medium">{selectedBooking?.customerName}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-gray-600">เบอร์โทรศัพท์:</div>
                                    <div className="font-medium">{selectedBooking?.phoneNumber}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-gray-600">วันที่:</div>
                                    <div className="font-medium">{selectedBooking ? formatDate(selectedBooking.date) : ''}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-gray-600">เวลา:</div>
                                    <div className="font-medium">{selectedBooking?.time} น.</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-gray-600">จำนวนคน:</div>
                                    <div className="font-medium">{selectedBooking?.people} คน</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-gray-600">โต๊ะ:</div>
                                    <div className="font-medium">{selectedBooking?.tableNo}</div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm">
                                    <p>กรุณาแสดงรายละเอียดนี้เมื่อมาถึงร้าน</p>
                                    <p>ขอบคุณที่ใช้บริการ</p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="sm:justify-between">
                            <DialogClose asChild>
                                <Button variant="outline">ปิด</Button>
                            </DialogClose>
                            <Button
                                variant="default"
                                onClick={handleCaptureDetails}
                            >
                                บันทึกรายละเอียด
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );

}