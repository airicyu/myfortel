import { CalendarType } from "fortel-ziweidoushu";
import {
  Gender,
  DestinyConfig,
  ConfigType,
  DayTimeGround,
  DestinyConfigBuilder,
} from "fortel-ziweidoushu";
// import { CALENDAR_TYPE, CALENDAR_TYPE_TYPE } from "../../util/constants";
import { numToStrOrEmpty, strToNumOrNull } from "../../util/numberUtils";

export declare type ConfigDataStateType = {
  calendarType: CalendarType;
  lunarYear: number | null;
  lunarMonth: number | null;
  lunarDay: number | null;
  leap: boolean;
  solarYear: number | null;
  solarMonth: number | null;
  solarDay: number | null;
  gender: Gender | null;
};

export const searchParamsToDataStateMapper = (
  searchParams: URLSearchParams
): ConfigDataStateType => {
  const calendarType =
    searchParams.get("cal") === "S" ? CalendarType.SOLAR : CalendarType.LUNAR;

  const year = strToNumOrNull(searchParams.get("y"));
  const month = strToNumOrNull(searchParams.get("m"));
  const day = strToNumOrNull(searchParams.get("d"));
  const leap = searchParams.get("lp") === "1";

  const gender = searchParams.get("g") === Gender.F ? Gender.F : Gender.M;

  const lunarYear = calendarType === CalendarType.LUNAR ? year : null;
  const lunarMonth = calendarType === CalendarType.LUNAR ? month : null;
  const lunarDay = calendarType === CalendarType.LUNAR ? day : null;
  const solarYear = calendarType === CalendarType.SOLAR ? year : null;
  const solarMonth = calendarType === CalendarType.SOLAR ? month : null;
  const solarDay = calendarType === CalendarType.SOLAR ? day : null;
  return {
    calendarType,
    lunarYear,
    lunarMonth,
    lunarDay,
    leap,
    solarYear,
    solarMonth,
    solarDay,
    gender,
  };
};

export const dataStateToDestinyConfigMapper = (
  dataState: ConfigDataStateType,
  bornTimeGround: DayTimeGround,
  configType: ConfigType
): DestinyConfig | null => {
  try {
    const _gender = dataState.gender === Gender.M ? Gender.M : Gender.F;

    if (dataState.calendarType === CalendarType.LUNAR) {
      return DestinyConfigBuilder.withlunar({
        year: dataState.lunarYear!,
        month: dataState.lunarMonth!,
        day: dataState.lunarDay!,
        isLeapMonth: dataState.leap,
        bornTimeGround,
        configType,
        gender: _gender,
      });
    } else if (dataState.calendarType === CalendarType.SOLAR) {
      return DestinyConfigBuilder.withSolar({
        year: dataState.solarYear!,
        month: dataState.solarMonth!,
        day: dataState.solarDay!,
        bornTimeGround,
        configType,
        gender: _gender,
      });
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const dataStateToSearchParamsMapper = (
  configDataState: ConfigDataStateType
) => {
  const cal =
    configDataState.calendarType && configDataState.calendarType.charAt(0);
  const y = numToStrOrEmpty(
    configDataState.calendarType === CalendarType.LUNAR
      ? configDataState.lunarYear
      : configDataState.solarYear
  );
  const m = numToStrOrEmpty(
    configDataState.calendarType === CalendarType.LUNAR
      ? configDataState.lunarMonth
      : configDataState.solarMonth
  );
  const d = numToStrOrEmpty(
    configDataState.calendarType === CalendarType.LUNAR
      ? configDataState.lunarDay
      : configDataState.solarDay
  );
  const lp = configDataState.leap ? "1" : "0";
  const g = configDataState.gender === Gender.F ? "F" : "M";

  return new URLSearchParams({
    cal,
    y,
    m,
    d,
    lp,
    g,
  });
};

export const destinyConfigToSearchParamsMapper = (
  destinyConfig: DestinyConfig
) => {
  let configTypeCode = 1;
  if (destinyConfig.configType === ConfigType.GROUND) {
    configTypeCode = 0;
  } else if (destinyConfig.configType === ConfigType.SKY) {
    configTypeCode = 1;
  } else if (destinyConfig.configType === ConfigType.HUMAN) {
    configTypeCode = 2;
  }

  return new URLSearchParams({
    cal: "L",
    y: "" + destinyConfig.year,
    m: "" + destinyConfig.month,
    d: "" + destinyConfig.day,
    lp: destinyConfig.isLeapMonth ? "1" : "0",
    bt: "" + destinyConfig.bornTimeGround.index,
    cf: "" + configTypeCode,
    g: destinyConfig.gender === Gender.F ? "F" : "M",
  });
};
