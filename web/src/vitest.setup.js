import { vi } from "vitest";
const window = {
    location: {
        protocol: "http",
        host: "location"
    }
};
vi.stubGlobal("window", window);
