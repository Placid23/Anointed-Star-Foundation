import PageTitle from '@/components/shared/PageTitle';
import SectionWrapper from '@/components/shared/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Users, Award, Download } from 'lucide-react';
import { BarChart, PieChart } from 'lucide-react'; // Using lucide for placeholders

// Placeholder data for charts
const impactStats = [
  { metric: "Lives Touched", value: "10,000+", icon: Users },
  { metric: "Projects Completed", value: "150+", icon: Award },
  { metric: "Communities Empowered", value: "50+", icon: TrendingUp },
];

const successStories = [
  {
    quote: "Thanks to the vocational training, I now have a stable job and can support my family. Anointed Star Hub changed my life!",
    name: "Amina K.",
    program: "Youth Empowerment Initiative",
    imageHint: "smiling person"
  },
  {
    quote: "The health clinic in our village has been a blessing. We now have access to medical care we never had before.",
    name: "John B.",
    program: "Community Health Program",
    imageHint: "community health"
  }
];

export default function ImpactPage() {
  return (
    <>
      <SectionWrapper>
        <PageTitle
          title="Our Impact"
          subtitle="Discover the tangible difference Anointed Star Hub is making in communities, backed by data and real stories."
        />
      </SectionWrapper>

      <SectionWrapper className="bg-secondary/50">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {impactStats.map((stat) => (
            <Card key={stat.metric} className="text-center shadow-lg">
              <CardHeader>
                <stat.icon className="h-12 w-12 text-primary mx-auto mb-3" />
                <CardTitle className="text-4xl font-bold text-accent">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-foreground/80">{stat.metric}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>
      
      <SectionWrapper>
        <h2 className="text-3xl font-semibold text-primary mb-10 text-center">Visualizing Our Success</h2>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Program Beneficiaries Growth</CardTitle>
              <CardDescription>Annual increase in individuals reached by our programs.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center bg-muted/30 rounded-b-lg">
              {/* Placeholder for Bar Chart */}
              <BarChart className="h-32 w-32 text-muted-foreground" data-ai-hint="bar chart growth" />
              <p className="text-muted-foreground ml-4">Bar chart illustrating growth over years.</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Resource Allocation</CardTitle>
              <CardDescription>Distribution of funds across different program areas.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center bg-muted/30 rounded-b-lg">
              {/* Placeholder for Pie Chart */}
              <PieChart className="h-32 w-32 text-muted-foreground" data-ai-hint="pie chart funding" />
              <p className="text-muted-foreground ml-4">Pie chart showing resource distribution.</p>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-primary/10">
        <h2 className="text-3xl font-semibold text-primary mb-10 text-center">Success Stories</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
          {successStories.map((story, index) => (
             <Card key={index} className="shadow-lg">
                <CardContent className="pt-6">
                  <blockquote className="italic text-foreground/90 text-lg border-l-4 border-accent pl-4 py-2 mb-4">
                    "{story.quote}"
                  </blockquote>
                  <p className="text-right font-semibold text-primary">- {story.name}</p>
                  <p className="text-right text-sm text-muted-foreground">{story.program} Beneficiary</p>
                </CardContent>
             </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Downloadable Reports</h2>
        <p className="text-center text-lg text-foreground/80 max-w-2xl mx-auto mb-10">
          For a deeper dive into our activities, financials, and impact, please download our annual reports.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Button size="lg" variant="outline" className="group">
            <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" /> Annual Report 2023 (PDF)
          </Button>
          <Button size="lg" variant="outline" className="group">
            <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" /> Impact Study 2022 (PDF)
          </Button>
        </div>
      </SectionWrapper>
    </>
  );
}
