import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Direction = "ltr" | "rtl";

interface DirectionContextType {
  direction: Direction;
  setDirection: (direction: Direction) => void;
  toggleDirection: () => void;
}

export const DirectionContext =
  createContext<DirectionContextType | null>(null);

interface DirectionProviderProps {
  children: ReactNode;
}

export function DirectionProvider({
  children,
}: DirectionProviderProps) {
  const [direction, setDirection] = useState<Direction>(() => {
    return (localStorage.getItem("direction") as Direction) || "ltr";
  });

  useEffect(() => {
    localStorage.setItem("direction", direction);
    document.documentElement.dir = direction;
  }, [direction]);

  const toggleDirection = () => {
    setDirection((prev) => (prev === "ltr" ? "rtl" : "ltr"));
  };

  const value = useMemo(
    () => ({
      direction,
      setDirection,
      toggleDirection,
    }),
    [direction]
  );

  return (
    <DirectionContext.Provider value={value}>
      {children}
    </DirectionContext.Provider>
  );
}