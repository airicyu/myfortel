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
  bornTime: number | null;
  configType: number | null;
  gender: Gender | null;
};

export declare type RuntimeConfigDataStateType = {
  calendarType?: CalendarType | undefined;
  lunarYear?: number | undefined;
  lunarMonth?: number | undefined;
  lunarDay?: number | undefined;
  leap?: boolean | undefined;
  solarYear?: number | undefined;
  solarMonth?: number | undefined;
  solarDay?: number | undefined;
  scope?: number | undefined;
};

export declare type ViewDataStateType = {
  config: ConfigDataStateType;
  runtimeConfig: RuntimeConfigDataStateType;
};

export const searchParamsToDataStateMapper = (
  searchParams: URLSearchParams
): ViewDataStateType => {
  const calendarType =
    searchParams.get("cal") === "S" ? CalendarType.SOLAR : CalendarType.LUNAR;

  const year = strToNumOrNull(searchParams.get("y"));
  const month = strToNumOrNull(searchParams.get("m"));
  const day = strToNumOrNull(searchParams.get("d"));
  const leap = searchParams.get("lp") === "1";
  const bornTime = strToNumOrNull(searchParams.get("bt"));
  const configType = strToNumOrNull(searchParams.get("cf")) ?? 1;

  const gender = searchParams.get("g") === Gender.F ? Gender.F : Gender.M;

  const lunarYear = calendarType === CalendarType.LUNAR ? year : null;
  const lunarMonth = calendarType === CalendarType.LUNAR ? month : null;
  const lunarDay = calendarType === CalendarType.LUNAR ? day : null;
  const solarYear = calendarType === CalendarType.SOLAR ? year : null;
  const solarMonth = calendarType === CalendarType.SOLAR ? month : null;
  const solarDay = calendarType === CalendarType.SOLAR ? day : null;

  let runtimeCalendarType =
    searchParams.get("rcal") === "S" ? CalendarType.SOLAR : CalendarType.LUNAR;
  const runtimeYear = strToNumOrNull(searchParams.get("ry"));
  const runtimeMonth = strToNumOrNull(searchParams.get("rm"));
  const runtimeDay = strToNumOrNull(searchParams.get("rd"));
  const runtimeLeap = searchParams.get("rlp") === "1";
  const runtimeLunarYear =
    calendarType === CalendarType.LUNAR ? runtimeYear : null;
  const runtimeLunarMonth =
    calendarType === CalendarType.LUNAR ? runtimeMonth : null;
  const runtimeLunarDay =
    calendarType === CalendarType.LUNAR ? runtimeDay : null;
  let runtimeSolarYear =
    calendarType === CalendarType.SOLAR ? runtimeYear : null;
  let runtimeSolarMonth =
    calendarType === CalendarType.SOLAR ? runtimeMonth : null;
  let runtimeSolarDay = calendarType === CalendarType.SOLAR ? runtimeDay : null;

  if (!runtimeYear || !runtimeMonth || !runtimeDay) {
    const now = new Date();
    runtimeCalendarType = CalendarType.SOLAR;
    runtimeSolarYear = now.getFullYear();
    runtimeSolarMonth = now.getMonth() + 1;
    runtimeSolarDay = now.getDate();
  }

  const scope = strToNumOrNull(searchParams.get("sc")) ?? 0;

  return {
    config: {
      calendarType,
      lunarYear,
      lunarMonth,
      lunarDay,
      leap,
      solarYear,
      solarMonth,
      solarDay,
      bornTime,
      configType,
      gender,
    },
    runtimeConfig: {
      calendarType: runtimeCalendarType,
      lunarYear: runtimeLunarYear ?? undefined,
      lunarMonth: runtimeLunarMonth ?? undefined,
      lunarDay: runtimeLunarDay ?? undefined,
      leap: runtimeLeap,
      solarYear: runtimeSolarYear ?? undefined,
      solarMonth: runtimeSolarMonth ?? undefined,
      solarDay: runtimeSolarDay ?? undefined,
      scope,
    },
  };
};

export const dataStateToDestinyConfigMapper = (
  dataState: ConfigDataStateType
): DestinyConfig | null => {
  try {
    const _bornTimeGround =
      (typeof dataState.bornTime === "number" &&
        DayTimeGround.get(dataState.bornTime)) ||
      undefined;

    const _configType =
      (typeof dataState.configType === "number" &&
        [ConfigType.GROUND, ConfigType.SKY, ConfigType.HUMAN][
          dataState.configType
        ]) ||
      undefined;

    const _gender = dataState.gender === Gender.M ? Gender.M : Gender.F;

    if (dataState.calendarType === CalendarType.LUNAR) {
      return DestinyConfigBuilder.withlunar({
        year: dataState.lunarYear!,
        month: dataState.lunarMonth!,
        day: dataState.lunarDay!,
        isLeapMonth: dataState.leap,
        bornTimeGround: _bornTimeGround,
        configType: _configType!,
        gender: _gender,
      });
    } else if (dataState.calendarType === CalendarType.SOLAR) {
      return DestinyConfigBuilder.withSolar({
        year: dataState.solarYear!,
        month: dataState.solarMonth!,
        day: dataState.solarDay!,
        bornTimeGround: _bornTimeGround,
        configType: _configType!,
        gender: _gender,
      });
    }
  } catch (e) {
    console.error(e);
  }
  return null;
};

export const dataStateToSearchParamsMapper = (
  configDataState: ConfigDataStateType,
  runtimeConfigDataState: RuntimeConfigDataStateType
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
  const bt = numToStrOrEmpty(configDataState.bornTime);
  const cf = numToStrOrEmpty(configDataState.configType);
  const g = configDataState.gender === Gender.F ? "F" : "M";

  const extraRuntimeParams: any = {};

  if (runtimeConfigDataState.scope && runtimeConfigDataState.scope > 0) {
    extraRuntimeParams.rcal =
      runtimeConfigDataState.calendarType &&
      runtimeConfigDataState.calendarType.charAt(0);

    extraRuntimeParams.ry = numToStrOrEmpty(
      runtimeConfigDataState.calendarType === CalendarType.LUNAR
        ? runtimeConfigDataState.lunarYear
        : runtimeConfigDataState.solarYear
    );

    extraRuntimeParams.rm = numToStrOrEmpty(
      runtimeConfigDataState.calendarType === CalendarType.LUNAR
        ? runtimeConfigDataState.lunarMonth
        : runtimeConfigDataState.solarMonth
    );

    extraRuntimeParams.rd = numToStrOrEmpty(
      runtimeConfigDataState.calendarType === CalendarType.LUNAR
        ? runtimeConfigDataState.lunarDay
        : runtimeConfigDataState.solarDay
    );

    extraRuntimeParams.rlp = runtimeConfigDataState.leap ? "1" : "0";

    extraRuntimeParams.sc = runtimeConfigDataState.scope;
  }

  return new URLSearchParams({
    cal,
    y,
    m,
    d,
    lp,
    bt,
    cf,
    g,
    ...extraRuntimeParams,
  });
};
