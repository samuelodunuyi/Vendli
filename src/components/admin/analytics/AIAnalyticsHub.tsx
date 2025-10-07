
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesForecastingDashboard } from "./SalesForecastingDashboard";
import { FraudDetectionPanel } from "./FraudDetectionPanel";
import { ConversationalAI } from "./ConversationalAI";
import { Brain, Shield, MessageSquare } from "lucide-react";

interface AIAnalyticsHubProps {
  storeFilter?: string;
}

export function AIAnalyticsHub({ storeFilter }: AIAnalyticsHubProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">AI Analytics Hub</h1>
      </div>

      <Tabs defaultValue="forecasting" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecasting" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Sales Forecasting
          </TabsTrigger>
          <TabsTrigger value="fraud" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Fraud Detection
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Voice Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecasting">
          <SalesForecastingDashboard storeFilter={storeFilter} />
        </TabsContent>

        <TabsContent value="fraud">
          <FraudDetectionPanel />
        </TabsContent>

        <TabsContent value="voice">
          <ConversationalAI />
        </TabsContent>
      </Tabs>
    </div>
  );
}
