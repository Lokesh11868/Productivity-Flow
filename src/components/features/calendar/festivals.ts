// festivals.ts
export interface Festival {
  id: string;
  title: string;
  date: Date;
  color: string;
}

export const festivals: Festival[] = [
  // Indian Festivals 2025
  { id: 'ind-1', title: 'Makar Sankranti', date: new Date(2025, 0, 14), color: '#FF5733' },
  { id: 'ind-2', title: 'Pongal', date: new Date(2025, 0, 14), color: '#FF6F33' },
  { id: 'ind-3', title: 'Republic Day', date: new Date(2025, 0, 26), color: '#3385FF' },
  { id: 'ind-4', title: 'Holi', date: new Date(2025, 2, 14), color: '#FF33A6' },
  { id: 'ind-5', title: 'Ugadi', date: new Date(2025, 2, 30), color: '#33FFB5' },
  { id: 'ind-6', title: 'Gudi Padwa', date: new Date(2025, 2, 30), color: '#33FF8A' },
  { id: 'ind-7', title: 'Ram Navami', date: new Date(2025, 3, 6), color: '#FFBD33' },
  { id: 'ind-8', title: 'Mahavir Jayanti', date: new Date(2025, 3, 10), color: '#337BFF' },
  { id: 'ind-9', title: 'Good Friday', date: new Date(2025, 3, 18), color: '#9E33FF' },
  { id: 'ind-10', title: 'Easter', date: new Date(2025, 3, 20), color: '#33FF57' },
  { id: 'ind-11', title: 'Buddha Purnima', date: new Date(2025, 4, 12), color: '#FF3333' },
  { id: 'ind-12', title: 'Raksha Bandhan', date: new Date(2025, 7, 9), color: '#FF8333' },
  { id: 'ind-13', title: 'Independence Day', date: new Date(2025, 7, 15), color: '#3385FF' },
  { id: 'ind-14', title: 'Janmashtami', date: new Date(2025, 7, 15), color: '#33B5FF' },
  { id: 'ind-15', title: 'Ganesh Chaturthi', date: new Date(2025, 7, 27), color: '#FFA533' },
  { id: 'ind-16', title: 'Dussehra', date: new Date(2025, 9, 2), color: '#FF5733' },
  { id: 'ind-17', title: 'Diwali', date: new Date(2025, 9, 20), color: '#FFBD33' },
  { id: 'ind-18', title: 'Guru Nanak Jayanti', date: new Date(2025, 10, 5), color: '#338AFF' },
  { id: 'ind-19', title: 'Christmas', date: new Date(2025, 11, 25), color: '#FF3333' },

  // Global Festivals 2025
  { id: 'glb-1', title: 'Carnival (Brazil)', date: new Date(2025, 1, 28), color: '#FF33F6' },
  { id: 'glb-2', title: "St. Patrick's Day (Ireland)", date: new Date(2025, 2, 17), color: '#33FF57' },
  { id: 'glb-3', title: 'Songkran (Thailand)', date: new Date(2025, 3, 13), color: '#338AFF' },
  { id: 'glb-4', title: 'Glastonbury Festival (UK)', date: new Date(2025, 5, 25), color: '#FF8333' },
  { id: 'glb-5', title: 'Gion Matsuri (Japan)', date: new Date(2025, 6, 17), color: '#FF3380' },
  { id: 'glb-6', title: 'San Fermín (Spain)', date: new Date(2025, 6, 6), color: '#FF5733' },
  { id: 'glb-7', title: 'La Tomatina (Spain)', date: new Date(2025, 7, 27), color: '#FF6F33' },
  { id: 'glb-8', title: 'Oktoberfest (Germany)', date: new Date(2025, 8, 20), color: '#FFBD33' },
  { id: 'glb-9', title: 'Halloween (USA)', date: new Date(2025, 9, 31), color: '#FF3333' },
  { id: 'glb-10', title: 'Hanukkah (Jewish Festival)', date: new Date(2025, 11, 24), color: '#338AFF' },
];
