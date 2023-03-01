import {
  ConfigType,
  DayTimeGround,
  DestinyBoard,
  Temple,
} from "fortel-ziweidoushu";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MainMenu } from "../../components/MainMenu";
import { DayDestinyConfigInputPanel } from "../../components/destinyConfigInput/DayDestinyConfigInputPanel";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ConfigDataStateType,
  dataStateToDestinyConfigMapper,
  dataStateToSearchParamsMapper,
  destinyConfigToSearchParamsMapper,
  searchParamsToDataStateMapper,
} from "./stateMapper";
import { Table } from "antd";
import "./DayBoardsView.css";

const configTypes = [ConfigType.GROUND, ConfigType.SKY, ConfigType.HUMAN];

const bornTimeTextMapping = (bornTimeGround: DayTimeGround) => {
  return `${("" + bornTimeGround.hourStart).padStart(2, "0")}:00-${(
    "" + bornTimeGround.hourEnd
  ).padStart(2, "0")}:00`;
};

const destinyTempleCellDescription = (destinyBoard: DestinyBoard) => {
  const destinyTempleCell = destinyBoard.getCellByTemple(Temple.TEMPLE_DESTINY);
  if (destinyTempleCell.majorStars.length === 0) {
    return (
      <div>
        無主星在{destinyTempleCell.ground.displayName}對
        <strong>{destinyTempleCell.oppositeCell.majorStars.join("/")}</strong>
      </div>
    );
  } else if (destinyTempleCell.oppositeCell.majorStars.length === 0) {
    return (
      <div>
        <strong>{destinyTempleCell.majorStars.join("/")}</strong>在
        {destinyTempleCell.ground.displayName}
      </div>
    );
  } else {
    return (
      <div>
        <strong>{destinyTempleCell.majorStars.join("/")}</strong>在
        {destinyTempleCell.ground.displayName}對
        {destinyTempleCell.oppositeCell.majorStars.join("/")}
      </div>
    );
  }
};

const configTypeDisplay = new Map<ConfigType, string>();
configTypeDisplay.set(ConfigType.GROUND, "地盤");
configTypeDisplay.set(ConfigType.SKY, "天盤");
configTypeDisplay.set(ConfigType.HUMAN, "人盤");

export const DayBoardsView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * parse search params => config data
   */
  const dataState = useMemo(() => {
    return searchParamsToDataStateMapper(searchParams);
  }, [searchParams]);

  console.log("location.search ", location.search);
  console.log("dataState ", dataState);

  const [configDataState, setConfigDataState] =
    useState<ConfigDataStateType | null>(dataState ?? null);

  const updateConfig = useCallback(
    (updatedState: ConfigDataStateType) => {
      if (JSON.stringify(updatedState) !== JSON.stringify(configDataState)) {
        console.log("configDataState updated", updatedState);
        setConfigDataState(updatedState);
      }
    },
    [configDataState]
  );

  useEffect(() => {
    if (configDataState) {
      const newQuery =
        dataStateToSearchParamsMapper(configDataState).toString();

      if (location.search !== "?" + newQuery) {
        console.log("updateConfig->navigate", location.search, newQuery);
        navigate(`/myfortel/dayBoards?${newQuery}`);
      }
    }
  }, [configDataState, location.search, navigate]);

  const dayBoards = useMemo(() => {
    const allBoards: DestinyBoard[] = [];

    if (
      dataState &&
      ((dataState.lunarYear && dataState.lunarMonth && dataState.lunarDay) ||
        (dataState.solarYear && dataState.solarMonth && dataState.solarDay))
    ) {
      for (const dayTimeGround of DayTimeGround.values()) {
        for (const configType of configTypes) {
          const destinyConfig = dataStateToDestinyConfigMapper(
            dataState,
            dayTimeGround,
            configType
          );

          if (destinyConfig) {
            try {
              allBoards.push(new DestinyBoard(destinyConfig));
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    }

    return allBoards;
  }, [dataState]);

  const columns = [
    {
      title: "命盤",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "出生時間",
      dataIndex: "bornTimeText",
      key: "bornTimeText",
    },
    {
      title: "命宮主星",
      dataIndex: "destinyTempleMajorStars",
      key: "destinyTempleMajorStars",
    },
  ];

  const tableRecords = dayBoards.map((desintyBoard) => {
    return {
      key:
        desintyBoard.config.bornTimeGround.index +
        "_" +
        desintyBoard.config.configType.charAt(0),
      link: (
        <Link
          to={`/myfortel/buildBoard?${destinyConfigToSearchParamsMapper(
            desintyBoard.config
          ).toString()}`}
        >
          {desintyBoard.config.bornTimeGround.displayName}
          {configTypeDisplay.get(desintyBoard.config.configType)}
        </Link>
      ),
      bornTimeGround: desintyBoard.config.bornTimeGround,
      bornTimeText: bornTimeTextMapping(desintyBoard.config.bornTimeGround),
      destinyTempleMajorStars: destinyTempleCellDescription(desintyBoard),
    };
  });

  return (
    <>
      <MainMenu defaultValue="dayBoards" />
      <DayDestinyConfigInputPanel
        updateConfig={updateConfig}
        {...dataState}
      ></DayDestinyConfigInputPanel>
      <Table
        dataSource={tableRecords}
        columns={columns}
        bordered
        pagination={false}
        rowClassName={(record, index) => {
          return Math.ceil(record.bornTimeGround.hourStart / 2) % 2 === 0
            ? "even-row"
            : "odd-row";
        }}
      />
    </>
  );
};
