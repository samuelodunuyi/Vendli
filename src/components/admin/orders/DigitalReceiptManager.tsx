
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Star, Send, Eye, BarChart3 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface DigitalReceiptManagerProps {
  orderId: number;
  customerEmail?: string;
  customerPhone?: string;
  onSendReceipt: (method: "email" | "sms", details: any) => void;
}

interface FeedbackSurvey {
  id: string;
  title: string;
  questions: SurveyQuestion[];
  responseRate: number;
  averageRating: number;
}

interface SurveyQuestion {
  id: string;
  question: string;
  type: "rating" | "text" | "choice";
  required: boolean;
  options?: string[];
}

export function DigitalReceiptManager({ 
  orderId, 
  customerEmail, 
  customerPhone,
  onSendReceipt 
}: DigitalReceiptManagerProps) {
  const [receiptMethod, setReceiptMethod] = useState<"email" | "sms">("email");
  const [emailAddress, setEmailAddress] = useState(customerEmail || "");
  const [phoneNumber, setPhoneNumber] = useState(customerPhone || "");
  const [includeFeedback, setIncludeFeedback] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState("standard");
  const [customMessage, setCustomMessage] = useState("");

  // Mock feedback surveys
  const surveys: FeedbackSurvey[] = [
    {
      id: "standard",
      title: "Standard Experience Survey",
      responseRate: 68,
      averageRating: 4.2,
      questions: [
        { id: "q1", question: "How satisfied were you with your purchase?", type: "rating", required: true },
        { id: "q2", question: "How would you rate our customer service?", type: "rating", required: true },
        { id: "q3", question: "Any additional comments?", type: "text", required: false }
      ]
    },
    {
      id: "detailed",
      title: "Detailed Product Feedback",
      responseRate: 45,
      averageRating: 4.0,
      questions: [
        { id: "q1", question: "Product quality rating", type: "rating", required: true },
        { id: "q2", question: "Value for money", type: "rating", required: true },
        { id: "q3", question: "Likelihood to recommend", type: "choice", required: true, options: ["Very Likely", "Likely", "Neutral", "Unlikely", "Very Unlikely"] },
        { id: "q4", question: "What could we improve?", type: "text", required: false }
      ]
    },
    {
      id: "quick",
      title: "Quick 1-Minute Survey",
      responseRate: 82,
      averageRating: 4.5,
      questions: [
        { id: "q1", question: "Overall experience rating", type: "rating", required: true },
        { id: "q2", question: "Would you shop with us again?", type: "choice", required: true, options: ["Yes", "No", "Maybe"] }
      ]
    }
  ];

  const handleSendReceipt = () => {
    if (receiptMethod === "email" && !emailAddress.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    if (receiptMethod === "sms" && !phoneNumber.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    const receiptDetails = {
      method: receiptMethod,
      contact: receiptMethod === "email" ? emailAddress : phoneNumber,
      includeFeedback,
      surveyId: selectedSurvey,
      customMessage: customMessage.trim()
    };

    onSendReceipt(receiptMethod, receiptDetails);
    toast.success(`Digital receipt sent via ${receiptMethod.toUpperCase()}`);
  };

  const selectedSurveyData = surveys.find(s => s.id === selectedSurvey);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Digital Receipt & Feedback - Order {orderId}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="send">Send Receipt</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4 mt-4">
            {/* Delivery Method */}
            <div className="space-y-2">
              <Label>Delivery Method</Label>
              <Select value={receiptMethod} onValueChange={(value: "email" | "sms") => setReceiptMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contact Details */}
            {receiptMethod === "email" ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="customer@example.com"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+234 XXX XXX XXXX"
                />
              </div>
            )}

            {/* Feedback Options */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeFeedback"
                  checked={includeFeedback}
                  onChange={(e) => setIncludeFeedback(e.target.checked)}
                />
                <Label htmlFor="includeFeedback">Include feedback survey link</Label>
              </div>

              {includeFeedback && (
                <div className="space-y-3 ml-6">
                  <div className="space-y-2">
                    <Label>Select Survey</Label>
                    <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {surveys.map((survey) => (
                          <SelectItem key={survey.id} value={survey.id}>
                            {survey.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSurveyData && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-4">
                        <span>Response Rate: {selectedSurveyData.responseRate}%</span>
                        <span>Avg Rating: {selectedSurveyData.averageRating}/5</span>
                      </div>
                      <div>{selectedSurveyData.questions.length} questions</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="customMessage">Custom Message (Optional)</Label>
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personalized thank you message..."
                rows={3}
              />
            </div>

            {/* Send Button */}
            <Button onClick={handleSendReceipt} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Send Digital Receipt
            </Button>
          </TabsContent>

          <TabsContent value="surveys" className="space-y-4 mt-4">
            <div className="space-y-4">
              {surveys.map((survey) => (
                <div key={survey.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{survey.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Response Rate: {survey.responseRate}%</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {survey.averageRating}/5
                        </span>
                      </div>
                    </div>
                    <Badge variant={survey.id === selectedSurvey ? "default" : "secondary"}>
                      {survey.questions.length} questions
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {survey.questions.map((question, index) => (
                      <div key={question.id} className="flex items-center gap-2">
                        <span className="text-gray-500">{index + 1}.</span>
                        <span>{question.question}</span>
                        {question.required && <span className="text-red-500">*</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Total Responses</span>
                  </div>
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-xs text-gray-500">This month</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-sm">Avg Rating</span>
                  </div>
                  <div className="text-2xl font-bold">4.3</div>
                  <div className="text-xs text-gray-500">Out of 5</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">Response Rate</span>
                  </div>
                  <div className="text-2xl font-bold">67%</div>
                  <div className="text-xs text-gray-500">Industry avg: 45%</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <h4 className="font-medium">Recent Feedback Highlights:</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>"Great customer service and fast delivery!"</li>
                <li>"Product quality exceeded expectations"</li>
                <li>"Easy checkout process, very satisfied"</li>
                <li>"Would definitely recommend to friends"</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
