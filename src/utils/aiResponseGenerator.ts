
export function generateAIResponse(command: string): string {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.includes('sales')) {
    return "Today's sales are ₦2.4 million, up 15% from yesterday. The top-selling category is electronics.";
  } else if (lowerCommand.includes('inventory') || lowerCommand.includes('stock')) {
    return "Current inventory shows 145 products in stock. 4 items need immediate restocking.";
  } else if (lowerCommand.includes('staff') || lowerCommand.includes('schedule')) {
    return "8 staff members are scheduled for today. All positions are covered during peak hours.";
  } else if (lowerCommand.includes('customer')) {
    return "89 customers served today. Average order value is ₦28,500.";
  } else if (lowerCommand.includes('fraud') || lowerCommand.includes('alert')) {
    return "3 fraud alerts detected today. 1 high-priority alert requires immediate attention.";
  } else {
    return "I understand your request. Let me help you with store operations and analytics.";
  }
}
