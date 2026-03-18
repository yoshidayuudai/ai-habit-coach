type Habit = {
  id: number;
  name: string;
};

type Log = {
  habitId: number;
  date: string;
};

export const habits: Habit[] = [];
export const logs: Log[] = [];