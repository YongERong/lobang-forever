import { Comment, Favorite, MissedVideoCall, Share, TrendingUp } from "@mui/icons-material";

export const credentials = [
  { NRIC: "lebron", password: "james" },
];

export const SHAPData = [
  { feature: "feat1", importance: 0.5 },
  { feature: "feat2", importance: -0.1 },
  { feature: "feat3", importance: -0.4 }
];

export const metrics = [
  {
    title: "Video views",
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const,
    icon: MissedVideoCall,
    description: "change this month"
  },
  {
    title: "Profile views",
    value: "534",
    change: "-0.5%",
    changeType: "negative" as const,
    icon: TrendingUp,
    description: "change this month"
  },
  {
    title: "Likes",
    value: "890",
    change: "+10%",
    changeType: "positive" as const,
    icon: Favorite,
    description: "change this month"
  },
  {
    title: "Comments",
    value: "200",
    change: "0%",
    changeType: "neutral" as const,
    icon: Comment,
    description: "change this month"
  },
  {
    title: "Shares",
    value: "129",
    change: "-3%",
    changeType: "negative" as const,
    icon: Share,
    description: "change this month"
  }
];
