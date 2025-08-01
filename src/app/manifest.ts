import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CampusConnect",
    short_name: "CampusConnect",
    description: "Cordy",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#151b4d",
  };
}
