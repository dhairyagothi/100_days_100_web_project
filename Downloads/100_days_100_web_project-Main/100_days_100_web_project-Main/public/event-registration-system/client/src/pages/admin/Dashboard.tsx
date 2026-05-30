import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminRegistrations, useAnalytics } from "@/hooks/use-registrations";
import { useAuth } from "@/hooks/use-auth";
import { AdminNav } from "@/components/AdminNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Code, Lightbulb, Search, Filter, Building2 } from "lucide-react";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("All");
  const [collegeFilter, setCollegeFilter] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  const { data: registrations, isLoading: regsLoading } = useAdminRegistrations({
    search: search || undefined,
    domain: domainFilter !== "All" ? (domainFilter as 'Tech' | 'Non-Tech') : undefined,
    college: collegeFilter || undefined,
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-background font-sans pb-12">
      <AdminNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Real-time Zenith 2026 registration analytics and management.</p>
        </div>

        {/* Analytics Section */}
        {analyticsLoading || !analytics ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
            <Skeleton className="col-span-1 sm:col-span-2 h-[280px] w-full rounded-xl" />
            <Skeleton className="h-[280px] w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="shadow-sm border-border/50">
                <CardContent className="p-5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Total Registrations</p>
                    <p className="text-3xl sm:text-4xl font-display font-bold">{analytics.totalRegistrations}</p>
                  </div>
                  <div className="bg-primary/15 p-3 rounded-full shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/50">
                <CardContent className="p-5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Technical</p>
                    <p className="text-3xl sm:text-4xl font-display font-bold text-primary">{analytics.domainSplit.tech}</p>
                  </div>
                  <div className="bg-primary/15 p-3 rounded-full shrink-0">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/50">
                <CardContent className="p-5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Non-Technical</p>
                    <p className="text-3xl sm:text-4xl font-display font-bold text-accent">{analytics.domainSplit.nonTech}</p>
                  </div>
                  <div className="bg-accent/15 p-3 rounded-full shrink-0">
                    <Lightbulb className="w-5 h-5 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="col-span-1 lg:col-span-2 shadow-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-base sm:text-lg">Registrations Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] sm:h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.dailyRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="date"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(val) => format(new Date(val), 'MMM d')}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                        <RechartsTooltip
                          cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                          labelFormatter={(val) => format(new Date(val), 'MMMM d, yyyy')}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-base sm:text-lg">Domain Split</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] sm:h-[280px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Technical', value: analytics.domainSplit.tech },
                            { name: 'Non-Technical', value: analytics.domainSplit.nonTech }
                          ]}
                          cx="50%"
                          cy="45%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[0, 1].map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                          itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Data Table Section */}
        <Card className="shadow-sm border-border/50 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-border bg-card flex flex-col gap-3">
            <h2 className="text-lg sm:text-xl font-bold font-display">Attendee List</h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-0 sm:min-w-[180px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search names or emails..."
                  className="pl-9 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              {/* College Filter */}
              <div className="relative flex-1 min-w-0 sm:min-w-[160px]">
                <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  placeholder="Filter by college..."
                  className="pl-9 w-full"
                  value={collegeFilter}
                  onChange={(e) => setCollegeFilter(e.target.value)}
                  data-testid="input-college-filter"
                />
              </div>
              {/* Domain Filter */}
              <div className="relative flex items-center min-w-0 sm:min-w-[150px]">
                <Filter className="absolute left-2.5 z-10 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Select value={domainFilter} onValueChange={setDomainFilter}>
                  <SelectTrigger className="pl-9 w-full" data-testid="select-domain-filter">
                    <SelectValue placeholder="Domain Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Domains</SelectItem>
                    <SelectItem value="Tech">Technical</SelectItem>
                    <SelectItem value="Non-Tech">Non-Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[110px] whitespace-nowrap">Reg ID</TableHead>
                  <TableHead>Attendee</TableHead>
                  <TableHead className="hidden sm:table-cell">Institution</TableHead>
                  <TableHead className="hidden md:table-cell">Year</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-right hidden sm:table-cell whitespace-nowrap">Registered On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !registrations || registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No registrations found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  registrations.map((reg) => (
                    <TableRow key={reg.id} className="hover:bg-muted/30 transition-colors group" data-testid={`row-registration-${reg.id}`}>
                      <TableCell className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                        {reg.registrationId}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{reg.name}</p>
                        <p className="text-xs text-muted-foreground">{reg.email}</p>
                        <p className="text-xs text-muted-foreground sm:hidden mt-0.5">{reg.college}</p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell max-w-[180px] truncate text-sm" title={reg.college}>
                        {reg.college}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{reg.year}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={reg.domain === 'Tech' ? 'bg-primary/15 text-primary border-0 whitespace-nowrap' : 'bg-accent/15 text-accent border-0 whitespace-nowrap'}
                        >
                          {reg.domain === 'Tech' ? 'Technical' : 'Non-Technical'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                        {format(new Date(reg.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
