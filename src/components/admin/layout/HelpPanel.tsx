
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Search, Book, MessageCircle, Phone, Mail, FileText, Video } from "lucide-react";

export function HelpPanel() {
  const helpCategories = [
    {
      title: "Getting Started",
      icon: Book,
      items: [
        "System Overview",
        "Quick Start Guide",
        "Setting Up Your Store",
        "User Roles & Permissions"
      ]
    },
    {
      title: "Inventory Management",
      icon: FileText,
      items: [
        "Adding Products",
        "Stock Management",
        "Transfers Between Stores",
        "Low Stock Alerts"
      ]
    },
    {
      title: "Sales & POS",
      icon: MessageCircle,
      items: [
        "Processing Sales",
        "Payment Methods",
        "Returns & Refunds",
        "Receipt Printing"
      ]
    },
    {
      title: "Reporting",
      icon: FileText,
      items: [
        "Sales Reports",
        "Inventory Reports",
        "Financial Analytics",
        "Custom Reports"
      ]
    }
  ];

  const recentUpdates = [
    {
      title: "New Multi-Store Features",
      description: "Learn about the latest inventory tracking updates",
      type: "Feature",
      date: "2 days ago"
    },
    {
      title: "Payment Integration Guide",
      description: "Step-by-step Paystack integration setup",
      type: "Guide",
      date: "1 week ago"
    }
  ];

  return (
    <div className="space-y-6 py-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search help articles..."
          className="pl-10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-20 flex-col">
          <MessageCircle className="h-6 w-6 mb-2" />
          <span className="text-xs">Live Chat</span>
        </Button>
        <Button variant="outline" className="h-20 flex-col">
          <Video className="h-6 w-6 mb-2" />
          <span className="text-xs">Video Tutorials</span>
        </Button>
      </div>

      <Separator />

      {/* Recent Updates */}
      <div className="space-y-3">
        <h4 className="font-medium flex items-center">
          <HelpCircle className="h-4 w-4 mr-2" />
          What's New
        </h4>
        <div className="space-y-2">
          {recentUpdates.map((update, index) => (
            <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{update.title}</h5>
                  <p className="text-xs text-gray-600 mt-1">{update.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {update.type}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">{update.date}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Help Categories */}
      <div className="space-y-3">
        <h4 className="font-medium">Browse by Category</h4>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {helpCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-2 font-medium text-sm">
                    <IconComponent className="h-4 w-4" />
                    <span>{category.title}</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    {category.items.map((item, itemIndex) => (
                      <Button
                        key={itemIndex}
                        variant="ghost"
                        className="w-full justify-start h-8 text-xs text-gray-600 hover:text-blue-600"
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Contact Support */}
      <div className="space-y-3">
        <h4 className="font-medium">Contact Support</h4>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Phone className="h-4 w-4 mr-2" />
            Call Support: +234 700 123 4567
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Mail className="h-4 w-4 mr-2" />
            Email: support@cwretail.com
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <MessageCircle className="h-4 w-4 mr-2" />
            Submit a Ticket
          </Button>
        </div>
      </div>
    </div>
  );
}
