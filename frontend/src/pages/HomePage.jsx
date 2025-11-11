import PrimaryButton from "../components/PrimaryButton";           
import HabitCard from "../components/HabitCard";
import ContentCard from "../components/ContentCard";
import { CalendarWidget } from "../components/CalendarWidget";
import { Plus, Home } from "lucide-react";
import habitImage from "../assets/habit-card-1.jpg";

const HomePage = () => {
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) greeting = "Good afternoon";
  else if (currentHour >= 18) greeting = "Good evening";

  const todoHabits = [
    { title: "Uống nước", description: "description / Not done yet", icon: "💧", iconColor: "water" },
    { title: "Một habit tê", description: "description / Not done yet", icon: "✏️", iconColor: "exercise" },
    { title: "Đày sômmmm", description: "description / Not done yet", icon: "☕", iconColor: "coffee" },
    { title: "Uống nước", description: "description / Not done yet", icon: "🔥", iconColor: "fire" },
  ];

  const learningContent = Array.from({ length: 4 }, () => ({
    title: "Nhan đề bài",
    description: "Một mẫu ngắn nói dụng của bài viết vào đây, tất cả dồng này tính hết nên ko cần kết nối gi cả.",
    image: habitImage,
  }));

  const communityHabits = Array.from({ length: 3 }, () => ({
    title: "Nhan đề bài",
    description: "Một mẫu ngắn nói dụng của bài viết vào đây, tất cả dồng này tính hết nên ko cần kết nối gi cả.",
    image: habitImage,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">HaBiD</h1>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-4xl font-bold text-foreground text-center mb-12">
          {greeting}, username
        </h2>

        {/* To Do */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Home className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground">To do</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {todoHabits.map((h, i) => (
              <HabitCard key={i} {...h} />
            ))}
          </div>
        </section>

        {/* Learn from Online */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Home className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground">Learn from Online</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningContent.map((c, i) => (
              <ContentCard key={i} {...c} />
            ))}
          </div>
        </section>

        {/* Future Works */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Home className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground">Future Works</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <CalendarWidget />
            </div>
            <div className="lg:col-span-2 flex items-center justify-center">
              <p className="text-muted-foreground text-lg">No work for now &lt;3</p>
            </div>
          </div>
        </section>

        {/* Community Habits */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Home className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground">
              Try out these communities favorite habits
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityHabits.map((h, i) => (
              <ContentCard key={i} {...h} />
            ))}
          </div>
        </section>
      </main>

      {/* FAB */}
      <PrimaryButton
        className="fixed bottom-8 right-8 h-14 px-6 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        New habit
        <Plus className="ml-2 h-5 w-5" />
      </PrimaryButton>
    </div>
  );
};

export default HomePage;