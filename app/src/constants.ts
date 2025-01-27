export const usernameStorageKey = "username";
export const pagePaths = {
  heartBeatGraph: "/heartBeatGraphPage",
  signin: "/signinPage",
};

export const specialCharsRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

export const heartBeatZones = [
  { name: "Zone 1 (Resting)", range: [40, 60], color: "#D3F9D8" },
  { name: "Zone 2 (Warm-up)", range: [61, 100], color: "#A3D9FF" },
  { name: "Zone 3 (Fat Burn)", range: [101, 140], color: "#FFD3B4" },
  { name: "Zone 4 (Cardio)", range: [141, 160], color: "#FFB4A3" },
  { name: "Zone 5 (Peak)", range: [161, 180], color: "#FFA3A3" },
];
