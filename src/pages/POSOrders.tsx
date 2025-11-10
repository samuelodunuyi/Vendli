/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  SimpleGrid,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
  VStack,
  HStack,
  Select,
} from "@chakra-ui/react";
import { Search, ShoppingCart } from "lucide-react";
import { POSHeader } from "@/components/pos/POSHeader";
import { Order, useGetOrdersQuery } from "@/redux/services/orders.services";
import { useAppSelector } from "@/redux/store";
import { ReturnDialog } from "@/components/ReturnDialog";

enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Failed = 2,
  Refunded = 3,
  Partial = 4,
}

enum PaymentOption {
  "CASH" = 0,
  "CARD" = 1,
  "BANK TRANSFER" = 2,
}

const POSOrders = () => {
  const currentTime = new Date().toLocaleTimeString();
  const storeId = useAppSelector((state) => state.auth.user?.storeId);
  const { data } = useGetOrdersQuery({ storeId }, { skip: !storeId });
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | "">("");

  const openModal = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleReturnTransaction = (txnId: number, reason: string, approver: string) => {
    console.log(txnId, reason, approver);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Pending:
        return "yellow";
      case PaymentStatus.Paid:
        return "green";
      case PaymentStatus.Failed:
        return "red";
      case PaymentStatus.Refunded:
        return "blue";
      case PaymentStatus.Partial:
        return "orange";
      default:
        return "gray";
    }
  };

  // Filtered orders based on search, date range, and payment status
  const filteredOrders = data?.orders?.filter((order: any) => {
    const orderTime = new Date(order.orderDate).setHours(0, 0, 0, 0);
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() : null;

    if (start && end && (orderTime < start || orderTime > end)) return false;
    if (start && !end && orderTime < start) return false;
    if (end && !start && orderTime > end) return false;
    if (paymentStatusFilter !== "" && order.paymentStatus !== paymentStatusFilter) return false;

    // Search logic
    const query = searchQuery.toLowerCase();
    const matchId = order.id?.toString().includes(query);
    const matchCustomer =
      order.customer?.firstName?.toLowerCase().includes(query) ||
      order.customer?.lastName?.toLowerCase().includes(query);
    const matchStatus = PaymentStatus[order.paymentStatus]?.toLowerCase().includes(query);

    return matchId || matchCustomer || matchStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <POSHeader currentTime={currentTime} isOffline={false} />

      <Box p={{ base: 4, md: 6 }} bg="gray.50" minH="100vh">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={3}>
          <Flex align="center" gap={3}>
            <ShoppingCart size={24} color="#2563eb" />
            <Text fontSize="xl" fontWeight="bold">
              Orders
            </Text>
          </Flex>
          <Flex align="center" gap={3} flex="1" justify="flex-end">
            <Input
              placeholder="Search orders by ID, customer, or status..."
              width={{ base: "100%", md: "300px" }}
              borderRadius="8px"
              fontSize="sm"
              bg="white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button colorScheme="blue" display={{ base: "none", md: "inline-flex" }}>
              <Search size={16} />
            </Button>
          </Flex>
        </Flex>

        {/* Filters */}
        <Flex gap={3} flexWrap="wrap" mb={6} align="center">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            width={{ base: "100%", md: "150px" }}
            bg="white"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            width={{ base: "100%", md: "150px" }}
            bg="white"
          />
          <Select
            placeholder="Payment Status"
            value={paymentStatusFilter === "" ? "" : paymentStatusFilter}
            onChange={(e) =>
              setPaymentStatusFilter(e.target.value === "" ? "" : Number(e.target.value) as PaymentStatus)
            }
            width={{ base: "100%", md: "180px" }}
            bg="white"
          >
            <option value={PaymentStatus.Pending}>Pending</option>
            <option value={PaymentStatus.Paid}>Paid</option>
            <option value={PaymentStatus.Failed}>Failed</option>
            <option value={PaymentStatus.Refunded}>Refunded</option>
            <option value={PaymentStatus.Partial}>Partial</option>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setPaymentStatusFilter("");
              setSearchQuery("");
            }}
          >
            Reset
          </Button>
        </Flex>

        {/* Orders List */}
        {isMobile ? (
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            {filteredOrders?.map((order: any) => (
              <Box
                key={order.id}
                bg="white"
                p={4}
                borderRadius="12px"
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontWeight="600" color="blue.600">
                    ORD-{order.id}
                  </Text>
                  <Badge
                    colorScheme={getPaymentStatusColor(order.paymentStatus)}
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                    fontWeight="600"
                  >
                    {PaymentStatus[order.paymentStatus]}
                  </Badge>
                </Flex>
                <Text fontSize="sm" color="gray.600">
                  Customer: <strong>{order.customer?.firstName} {order.customer?.lastName}</strong>
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Payment: {PaymentOption[order.paymentOption]}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total: ₦
                  {order.orderItems
                    .reduce((acc: number, item: any) => acc + item.priceAtOrder * item.quantity, 0)
                    .toLocaleString()}
                </Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {new Date(order.orderDate).toLocaleDateString()}
                </Text>
                <Flex mt={3} gap={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    flex="1"
                    onClick={() => openModal(order)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    flex="1"
                    onClick={() => {
                      setSelectedTransaction(order);
                      setShowReturnDialog(true);
                    }}
                  >
                    Return
                  </Button>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Box bg="white" borderRadius="12px" boxShadow="sm" p={4}>
            <Table variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Customer</Th>
                  <Th isNumeric>Total (₦)</Th>
                  <Th>Payment</Th>
                  <Th>Payment Status</Th>
                  <Th>Date</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders?.map((order: any) => (
                  <Tr key={order.id} _hover={{ bg: "gray.50" }}>
                    <Td fontWeight="500" color="blue.600">
                      ORD-{order.id}
                    </Td>
                    <Td>
                      {order.customer
                        ? `${order.customer.firstName} ${order.customer.lastName}`
                        : "N/A"}
                    </Td>
                    <Td isNumeric>
                      {order.orderItems
                        .reduce(
                          (acc: number, item: any) =>
                            acc + item.priceAtOrder * item.quantity,
                          0
                        )
                        .toLocaleString()}
                    </Td>
                    <Td>{PaymentOption[order.paymentOption]}</Td>
                    <Td>
                      <Badge
                        colorScheme={getPaymentStatusColor(order.paymentStatus)}
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="sm"
                        fontWeight="600"
                      >
                        {PaymentStatus[order.paymentStatus]}
                      </Badge>
                    </Td>
                    <Td>{new Date(order.orderDate).toLocaleDateString()}</Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        mr={2}
                        onClick={() => openModal(order)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => {
                          setSelectedTransaction(order);
                          setShowReturnDialog(true);
                        }}
                      >
                        Return
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Order Details Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Order Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedOrder && (
                <VStack align="start" spacing={4}>
                  <Text>
                    <strong>Order ID:</strong> ORD-{selectedOrder.storeId}
                  </Text>
                  <Text>
                    <strong>Customer:</strong>{" "}
                    {selectedOrder.customer
                      ? `${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`
                      : "N/A"}
                  </Text>
                  <Text>
                    <strong>Payment:</strong>{" "}
                    {PaymentOption[selectedOrder.paymentOption]}
                  </Text>
                  <Text>
                    <strong>Payment Status:</strong>{" "}
                    {PaymentStatus[selectedOrder.paymentStatus]}
                  </Text>
                  <Text>
                    <strong>Status:</strong>{" "}
                    {selectedOrder.status === 0
                      ? "Pending"
                      : selectedOrder.status === 1
                      ? "Completed"
                      : "Cancelled"}
                  </Text>
                  <Text>
                    <strong>Order Date:</strong>{" "}
                    {new Date(selectedOrder.orderDate).toLocaleString()}
                  </Text>

                  <Box>
                    <Text fontWeight="600" mb={2}>
                      Items:
                    </Text>
                    <VStack spacing={3} align="start">
                      {selectedOrder.orderItems.map((item: any) => (
                        <HStack key={item.id} spacing={3}>
                          <Image
                            boxSize="50px"
                            objectFit="cover"
                            src={item.productImageUrl}
                            alt={item.productName}
                          />
                          <Box>
                            <Text fontWeight="500">{item.productName}</Text>
                            <Text fontSize="sm">
                              Qty: {item.quantity} | ₦
                              {item.priceAtOrder.toLocaleString()}
                            </Text>
                          </Box>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Return Dialog */}
        <ReturnDialog
          open={showReturnDialog}
          onOpenChange={setShowReturnDialog}
          transaction={selectedTransaction}
          type="return"
          onApprove={handleReturnTransaction}
        />
      </Box>
    </div>
  );
};

export default POSOrders;
