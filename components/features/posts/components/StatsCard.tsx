import { Type, FileText, Clock, Calendar } from "lucide-react";
import React from "react";
import { Card, CardBody } from "@heroui/react";

interface StatsCardProps {
  wordCount: number;
  charCount: number;
  readingTime: number;
  currentDate: string;
}

const StatsCard = ({
  wordCount,
  charCount,
  readingTime,
  currentDate,
}: StatsCardProps) => {
  const stats = [
    {
      icon: Type,
      label: "Words",
      value: wordCount,
    },
    {
      icon: FileText,
      label: "Characters",
      value: charCount,
    },
    {
      icon: Clock,
      label: "Read",
      value: `${readingTime} min`,
    },
    {
      icon: Calendar,
      label: "Date",
      value: currentDate,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} shadow="sm" className="dark:bg-gray-750 dark:border-gray-700">
            <CardBody>
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <div>
                  <p className="text-sm text-default-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCard;
