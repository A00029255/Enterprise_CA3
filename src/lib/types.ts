export type TextScale = "sm" | "base" | "lg";

export type AccessibilityPreferences = {
  high_contrast: boolean;
  text_scale: TextScale;
};

export type TimetableGroup = {
  id: string;
  code: string;
  title: string;
};

export type TimetableEntry = {
  id: string;
  group_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  module_code: string;
  module_name: string;
  lecturer_name: string;
  room_name: string;
};

export type MapLocation = {
  id: string;
  name: string;
  tag: string;
  latitude: number;
  longitude: number;
  description: string | null;
};