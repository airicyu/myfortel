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
  const initialDataState = useMemo(() => {
    return searchParamsToDataStateMapper(searchParams);
  }, [searchParams]);

  const [configDataState, setConfigDataState] = useState<ConfigDataStateType>(
    initialDataState.config
  );

  const [runtimeConfigDataState, setRuntimeConfigDataState] =
    useState<RuntimeConfigDataStateType>(initialDataState?.runtimeConfig ?? {});

  const [destinyConfig, setDestinyConfig] = useState<DestinyConfig | null>(
    (configDataState && dataStateToDestinyConfigMapper(configDataState)) ?? null
  );

  const validDestinyBoard = useMemo(() => {
    try {
      return destinyConfig && new DestinyBoard(destinyConfig) && true;
    } catch (e) {
      return false;
    }
  }, [destinyConfig]);

  /**
   * init => try build destiny config from config data
   */
  useEffect(() => {
    setDestinyConfig(dataStateToDestinyConfigMapper(configDataState));
  }, [configDataState]);

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
        {...configDataState}
      ></DestinyConfigInputPanel>

      <div style={{ marginTop: 15 }}></div>

      <RuntimeConfigInputPanel
        updateRuntimeConfig={updateRuntimeConfigDataState}
        {...runtimeConfigDataState}
      ></RuntimeConfigInputPanel>

      {destinyConfig && validDestinyBoard ? (
        <Board
          destinyConfig={destinyConfig}
          runtimeConfigDataState={runtimeConfigDataState}
        ></Board>
      ) : null}
    </>
  );
};
