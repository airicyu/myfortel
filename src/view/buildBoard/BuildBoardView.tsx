import { DestinyBoard, DestinyConfig } from "fortel-ziweidoushu";
import { Board } from "../../components/Board";
import { DestinyConfigInputPanel } from "../../components/destinyConfigInput/DestinyConfigInputPanel";
import { useEffect, useState, useCallback, useMemo } from "react";
import { MainMenu } from "../../components/MainMenu";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  searchParamsToDataStateMapper,
  dataStateToDestinyConfigMapper,
  dataStateToSearchParamsMapper,
  ConfigDataStateType,
  RuntimeConfigDataStateType,
} from "./stateMapper";
import { RuntimeConfigInputPanel } from "../../components/destinyConfigInput/RuntimeConfigInputPanel";

export const BuildBoardView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * parse search params => config data
   */
  const dataState = useMemo(() => {
    return searchParamsToDataStateMapper(searchParams);
  }, [searchParams]);

  // console.log("location.search ", location.search);
  // console.log("dataState ", dataState);

  const [configDataState, setConfigDataState] =
    useState<ConfigDataStateType | null>(dataState?.config ?? null);

  const [runtimeConfigDataState, setRuntimeConfigDataState] =
    useState<RuntimeConfigDataStateType>(dataState?.runtimeConfig ?? {});

  const [destinyConfig, setDestinyConfig] = useState<DestinyConfig | null>(
    dataStateToDestinyConfigMapper(dataState.config)
  );

  const [destinyBoard, setDestinyBoard] = useState<DestinyBoard | null>(
    (destinyConfig && new DestinyBoard(destinyConfig)) ?? null
  );

  /**
   * init => try build destiny config from config data
   */
  useEffect(() => {
    setDestinyConfig(dataStateToDestinyConfigMapper(dataState.config));
  }, [dataState.config]);

  useEffect(() => {
    if (destinyConfig) {
      setDestinyBoard(new DestinyBoard(destinyConfig));
    } else {
      setDestinyBoard(null);
    }
  }, [destinyConfig]);

  const updateConfig = useCallback(
    (updatedState: ConfigDataStateType) => {
      if (JSON.stringify(updatedState) !== JSON.stringify(configDataState)) {
        console.log("configDataState updated", updatedState);
        setConfigDataState(updatedState);
        setRuntimeConfigDataState({});
      }
    },
    [configDataState]
  );

  const updateRuntimeConfigDataState = useCallback(
    (updatedState: RuntimeConfigDataStateType) => {
      if (
        JSON.stringify(updatedState) !== JSON.stringify(runtimeConfigDataState)
      ) {
        console.log("RuntimeConfigDataStateType updated", updatedState);
        setRuntimeConfigDataState(updatedState);
      }
    },
    [runtimeConfigDataState]
  );

  useEffect(() => {
    if (configDataState) {
      const newQuery = dataStateToSearchParamsMapper(
        configDataState,
        runtimeConfigDataState
      ).toString();

      if (location.search !== "?" + newQuery) {
        console.log("updateConfig->navigate", location.search, newQuery);
        navigate(`/buildBoard?${newQuery}`);
      }
    }
  }, [configDataState, location.search, navigate, runtimeConfigDataState]);

  return (
    <>
      <MainMenu defaultValue="buildBoard" />
      <DestinyConfigInputPanel
        updateConfig={updateConfig}
        {...dataState.config}
      ></DestinyConfigInputPanel>

      <div style={{ marginTop: 15 }}></div>

      <RuntimeConfigInputPanel
        updateRuntimeConfig={updateRuntimeConfigDataState}
        {...dataState.runtimeConfig}
      ></RuntimeConfigInputPanel>

      {destinyConfig ? (
        <Board
          destinyConfig={destinyConfig}
          runtimeConfigDataState={runtimeConfigDataState}
        ></Board>
      ) : null}
    </>
  );
};
