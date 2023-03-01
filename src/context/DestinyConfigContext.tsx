import { DestinyConfig } from "fortel-ziweidoushu";
import { createContext, useState } from "react";

declare type DestinyConfigContextType = {
  destinyConfig: DestinyConfig | null;
  setDestinyConfig: (value: DestinyConfig | null) => void;
};

export const DestinyConfigContext = createContext<DestinyConfigContextType>({
  destinyConfig: null,
  setDestinyConfig: () => {},
});

export const DestinyConfigContextProvider = (props: any) => {
  const [destinyConfig, setDestinyConfig] = useState<DestinyConfig | null>(
    null
  );

  return (
    <>
      <DestinyConfigContext.Provider
        value={{
          destinyConfig,
          setDestinyConfig,
        }}
      >
        {props.children}
      </DestinyConfigContext.Provider>
    </>
  );
};
