"use client"

import { 
  Mail, 
  FileText, 
  TrendingUp, 
  Send,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const stats = [
  { 
    name: "Total Emails Sent", 
    value: "2,847", 
    change: "+12.5%", 
    trend: "up",
    icon: Mail,
    description: "This month"
  },
  { 
    name: "Templates Created", 
    value: "12", 
    change: "+2", 
    trend: "up",
    icon: FileText,
    description: "Active templates"
  },
  { 
    name: "Success Rate", 
    value: "98.2%", 
    change: "+0.8%", 
    trend: "up",
    icon: TrendingUp,
    description: "Delivery rate"
  },
  { 
    name: "Pending", 
    value: "23", 
    change: "-5", 
    trend: "down",
    icon: Clock,
    description: "Emails in queue"
  },
]

const recentActivity = [
  { 
    id: 1,
    recipient: "sarah@techcorp.com", 
    subject: "Application for Senior Developer Role",
    template: "Job Application",
    status: "delivered",
    time: "2 minutes ago"
  },
  { 
    id: 2,
    recipient: "hr@startup.io", 
    subject: "Full Stack Developer Position",
    template: "Job Application",
    status: "delivered",
    time: "15 minutes ago"
  },
  { 
    id: 3,
    recipient: "jobs@enterprise.com", 
    subject: "Interest in Engineering Position",
    template: "Follow Up",
    status: "pending",
    time: "1 hour ago"
  },
  { 
    id: 4,
    recipient: "recruit@agency.net", 
    subject: "Re: Interview Availability",
    template: "Custom",
    status: "delivered",
    time: "2 hours ago"
  },
  { 
    id: 5,
    recipient: "invalid@email", 
    subject: "Application for PM Role",
    template: "Job Application",
    status: "failed",
    time: "3 hours ago"
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s your email activity overview.
          </p>
        </div>
        <Link href="/dashboard/send">
          <Button>
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-primary" : "text-muted-foreground"
                }`}>
                  {stat.change}
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest email sends and their status</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.status === "delivered" 
                    ? "bg-primary/10" 
                    : activity.status === "pending" 
                      ? "bg-warning/10" 
                      : "bg-destructive/10"
                }`}>
                  {activity.status === "delivered" ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : activity.status === "pending" ? (
                    <Clock className="w-5 h-5 text-warning" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{activity.recipient}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {activity.template}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground truncate mt-0.5">
                    {activity.subject}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                  {activity.time}
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/send">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Send New Email</div>
                  <div className="text-sm text-muted-foreground">
                    Compose and send to recipients
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/templates">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Create Template</div>
                  <div className="text-sm text-muted-foreground">
                    Build reusable email templates
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/contacts">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full sm:col-span-2 lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Import Contacts</div>
                  <div className="text-sm text-muted-foreground">
                    Add recipients from CSV
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
