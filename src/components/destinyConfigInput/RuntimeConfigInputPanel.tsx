import { Segmented, Card, Slider, Button } from "antd";
import { defaultCalendar } from "fortel-ziweidoushu";
import { useCallback, useState, useEffect } from "react";
import { RuntimeConfigDataStateType } from "../../view/buildBoard/stateMapper";
import { LunarDateInput } from "./LunarDateInput";
import { SolarDateInput } from "./SolarDateInput";
import type { SliderMarks } from "antd/es/slider";
import { CalendarType } from "fortel-ziweidoushu";
import { DateTime } from "luxon";
import { LineSeparator } from "./LineSeparator";

const marks: SliderMarks = {
  0: {
    style: {
      color: "#888",
    },
    label: "不顯示",
  },
  1: {
    style: {
      color: "#a00",
    },
    label: "大運",
  },
  2: {
    style: {
      color: "#00a",
    },
    label: "流年",
  },
  3: {
    style: {
      color: "#073",
    },
    label: "流月",
  },
  4: {
    style: {
      color: "#8000ff",
    },
    label: "流日",
  },
};

declare type DataState = {
  calendarType: CalendarType;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  lunarLeap: boolean;
  solarYear: number;
  solarMonth: number;
  solarDay: number;
  scope: number;
};

export const RuntimeConfigInputPanel = (
  props: RuntimeConfigDataStateType & {
    updateRuntimeConfig: (dataState: RuntimeConfigDataStateType) => void;
  }
) => {
  const [dataState, setDataState] = useState<DataState>({
    calendarType: props.calendarType ?? CalendarType.SOLAR,
    lunarYear: props.lunarYear ?? 1990,
    lunarMonth: props.lunarMonth ?? 1,
    lunarDay: props.lunarDay ?? 1,
    lunarLeap: props.leap ?? false,
    solarYear: props.solarYear ?? 1990,
    solarMonth: props.solarMonth ?? 1,
    solarDay: props.solarDay ?? 1,
    scope: props.scope ?? 0,
  });

  // const {
  //   calendarType,
  //   lunarYear,
  //   lunarMonth,
  //   lunarDay,
  //   lunarLeap,
  //   solarYear,
  //   solarMonth,
  //   solarDay,
  //   scope,
  // } = dataState;

  // const [calendarType, setCalendarType] = useState<CalendarType>(
  //   props.calendarType ?? CalendarType.SOLAR
  // );

  // const [lunarYear, setLunarYear] = useState<number | null>(
  //   props.lunarYear ?? 1990
  // );
  // const [lunarMonth, setLunarMonth] = useState<number | null>(
  //   props.lunarMonth ?? 1
  // );
  // const [lunarDay, setLunarDay] = useState<number | null>(props.lunarDay ?? 1);
  // const [lunarLeap, setLunarLeap] = useState<boolean>(props.leap ?? false);

  // const [solarYear, setSolarYear] = useState<number | null>(
  //   props.solarYear ?? 1990
  // );
  // const [solarMonth, setSolarMonth] = useState<number | null>(
  //   props.solarMonth ?? 1
  // );
  // const [solarDay, setSolarDay] = useState<number | null>(props.solarDay ?? 1);

  // const [scope, setScope] = useState<number>(props.scope ?? 0);

  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    console.log("props updated", props);
    const now = DateTime.now();
    const lunarDate = defaultCalendar.solar2lunar(now.year, now.month, now.day);

    setDataState({
      calendarType: props.calendarType ?? CalendarType.SOLAR,
      lunarYear: props.lunarYear ?? lunarDate.lunarYear,
      lunarMonth: props.lunarMonth ?? lunarDate.lunarMonth,
      lunarDay: props.lunarDay ?? lunarDate.lunarDay,
      lunarLeap: props.leap ?? lunarDate.isLeapMonth,
      solarYear: props.solarYear ?? now.year,
      solarMonth: props.solarMonth ?? now.month,
      solarDay: props.solarDay ?? now.day,
      scope: props.scope ?? 0,
    });
  }, [props]);

  const updateRuntimeConfig = useCallback(() => {
    props.updateRuntimeConfig({
      calendarType: dataState.calendarType,
      lunarYear: dataState.lunarYear ?? undefined,
      lunarMonth: dataState.lunarMonth ?? undefined,
      lunarDay: dataState.lunarDay ?? undefined,
      leap: dataState.lunarLeap,
      solarYear: dataState.solarYear ?? undefined,
      solarMonth: dataState.solarMonth ?? undefined,
      solarDay: dataState.solarDay ?? undefined,
      scope: dataState.scope,
    });
  }, [dataState]);

  const syncSolarLunarCalendar = useCallback(
    (dataState: DataState): DataState => {
      if (dataState.calendarType === CalendarType.LUNAR) {
        if (dataState.lunarYear && dataState.lunarMonth && dataState.lunarDay) {
          try {
            const solarDate = defaultCalendar.lunar2solar(
              dataState.lunarYear,
              dataState.lunarMonth,
              dataState.lunarDay,
              dataState.lunarLeap
            );
            if (solarDate) {
              return {
                ...dataState,
                solarYear: solarDate.solarYear,
                solarMonth: solarDate.solarMonth,
                solarDay: solarDate.solarDay,
              };
            }
          } catch (e) {
            console.debug("convert date error", e);
          }
        }
      } else if (dataState.calendarType === CalendarType.SOLAR) {
        try {
          if (
            dataState.solarYear &&
            dataState.solarMonth &&
            dataState.solarDay
          ) {
            const lunarDate = defaultCalendar.solar2lunar(
              dataState.solarYear,
              dataState.solarMonth,
              dataState.solarDay
            );
            if (lunarDate) {
              return {
                ...dataState,
                calendarType: CalendarType.SOLAR,
                lunarYear: lunarDate.lunarYear,
                lunarMonth: lunarDate.lunarMonth,
                lunarDay: lunarDate.lunarDay,
                lunarLeap: lunarDate.isLeapMonth,
              };
            }
          }
        } catch (e) {
          console.debug("convert date error", e);
        }
      }
      return {
        ...dataState,
      };
    },
    []
  );

  const onChangeCalendarType = useCallback(
    (value: string | number) => {
      if (
        dataState.calendarType === CalendarType.LUNAR &&
        value === CalendarType.SOLAR
      ) {
        setDataState(
          syncSolarLunarCalendar({
            ...dataState,
            calendarType: CalendarType.SOLAR,
          })
        );
      } else if (
        dataState.calendarType === CalendarType.SOLAR &&
        value === CalendarType.LUNAR
      ) {
        setDataState(
          syncSolarLunarCalendar({
            ...dataState,
            calendarType: CalendarType.LUNAR,
          })
        );
      }
    },
    [dataState, syncSolarLunarCalendar]
  );

  useEffect(() => {
    if (isRefresh) {
      setIsRefresh(false);
      updateRuntimeConfig();
    }
  }, [isRefresh, updateRuntimeConfig]);

  const goToday = useCallback(() => {
    const { year, month, day } = DateTime.now();
    const lunarDate = defaultCalendar.solar2lunar(year, month, day);
    setDataState(
      syncSolarLunarCalendar({
        ...dataState,
        calendarType: CalendarType.SOLAR,
        solarYear: year,
        solarMonth: month,
        solarDay: day,
        lunarYear: lunarDate.lunarYear,
        lunarMonth: lunarDate.lunarMonth,
        lunarDay: lunarDate.lunarDay,
        lunarLeap: lunarDate.isLeapMonth,
        scope: 4,
      })
    );
    setIsRefresh(true);
  }, [dataState, syncSolarLunarCalendar]);

  const goPrevTenYear = useCallback(() => {
    setDataState(
      syncSolarLunarCalendar({
        ...dataState,
        calendarType: CalendarType.LUNAR,
        lunarYear: dataState.lunarYear - 10,
        lunarLeap: false,
        scope: 1,
      })
    );
    setIsRefresh(true);
  }, [dataState, syncSolarLunarCalendar]);

  const goNextTenYear = useCallback(() => {
    setDataState(
      syncSolarLunarCalendar({
        ...dataState,
        calendarType: CalendarType.LUNAR,
        lunarYear: dataState.lunarYear + 10,
        lunarLeap: false,
        scope: 1,
      })
    );
    setIsRefresh(true);
  }, [dataState, syncSolarLunarCalendar]);

  const goPrevYear = useCallback(() => {
    setDataState(
      syncSolarLunarCalendar({
        ...dataState,
        calendarType: CalendarType.LUNAR,
        lunarYear: dataState.lunarYear - 1,
        lunarLeap: false,
        scope: 2,
      })
    );
    setIsRefresh(true);
  }, [dataState, syncSolarLunarCalendar]);

  const goNextYear = useCallback(() => {
    setDataState(
      syncSolarLunarCalendar({
        ...dataState,
        calendarType: CalendarType.LUNAR,
        lunarYear: dataState.lunarYear + 1,
        lunarLeap: false,
        scope: 2,
      })
    );
    setIsRefresh(true);
  }, [dataState, syncSolarLunarCalendar]);

  const goPrevMonth = useCallback(() => {
    setDataState(
      syncSolarLunarCalendar({
        ...dataState,
        calendarType: CalendarType.LUNAR,
        lunarYear:
          dataState.lunarMonth > 1
            ? dataState.lunarYear
            : dataState.lunarYear - 1,
        lunarMonth: dataState.lunarMonth > 1 ? dataState.lunarMonth - 1 : 12,
        lunarLeap: false,
        scope: 3,
      })
    );
    setIsRefresh(true);
  }, [dataState, syncSolarLunarCalendar]);

  const goNextMonth = useCallback(() => {
    setDataState(
      syncSolarLunarCalendar({
        ...dataState,
        calendarType: CalendarType.LUNAR,
        lunarYear:
          dataState.lunarMonth < 12
            ? dataState.lunarYear
            : dataState.lunarYear + 1,
        lunarMonth: dataState.lunarMonth < 12 ? dataState.lunarMonth + 1 : 1,
        lunarLeap: false,
        scope: 3,
      })
    );
    setIsRefresh(true);
  }, [dataState, syncSolarLunarCalendar]);

  const goPrevDay = useCallback(() => {
    const solarDate = defaultCalendar.lunar2solar(
      dataState.lunarYear,
      dataState.lunarMonth,
      dataState.lunarDay,
      dataState.lunarLeap
    );
    const { year, month, day } = DateTime.fromObject({
      year: solarDate.solarYear,
      month: solarDate.solarMonth,
      day: solarDate.solarDay,
      hour: 0,
      minute: 0,
      second: 0,
    }).minus({ day: 1 });
    const lunarDate = defaultCalendar.solar2lunar(year, month, day);
    setDataState(
      syncSolarLunarCalendar({
        ...dataState,
        calendarType: CalendarType.LUNAR,
        lunarYear: lunarDate.lunarYear,
        lunarMonth: lunarDate.lunarMonth,
        lunarDay: lunarDate.lunarDay,
        lunarLeap: lunarDate.isLeapMonth,
        scope: 4,
      })
    );
    setIsRefresh(true);
  }, [dataState, syncSolarLunarCalendar]);

  const goNextDay = useCallback(() => {
    const solarDate = defaultCalendar.lunar2solar(
      dataState.lunarYear,
      dataState.lunarMonth,
      dataState.lunarDay,
      dataState.lunarLeap
    );
    const { year, month, day } = DateTime.fromObject({
      year: solarDate.solarYear,
      month: solarDate.solarMonth,
      day: solarDate.solarDay,
      hour: 0,
      minute: 0,
      second: 0,
    }).plus({ day: 1 });
    const lunarDate = defaultCalendar.solar2lunar(year, month, day);
    setDataState(
      syncSolarLunarCalendar({
        ...dataState,
        calendarType: CalendarType.LUNAR,
        lunarYear: lunarDate.lunarYear,
        lunarMonth: lunarDate.lunarMonth,
        lunarDay: lunarDate.lunarDay,
        lunarLeap: lunarDate.isLeapMonth,
        scope: 4,
      })
    );
    setIsRefresh(true);
  }, [dataState, syncSolarLunarCalendar]);

  return (
    <Card style={{ width: 600 }} title="流曜顯示">
      <Slider
        style={{ width: 200 }}
        marks={marks}
        value={dataState.scope}
        min={0}
        max={4}
        onChange={(value) => {
          setDataState({ ...dataState, scope: value });
          setIsRefresh(true);
        }}
        tooltip={{ formatter: null }}
      />
      <div>
        <Segmented
          options={[
            { label: "農曆", value: CalendarType.LUNAR },
            { label: "西曆", value: CalendarType.SOLAR },
          ]}
          value={dataState.calendarType}
          onChange={(value) => {
            onChangeCalendarType(value);
            setIsRefresh(true);
          }}
        />
        <div
          className="inline-block"
          style={{ paddingLeft: 20, paddingRight: 0 }}
        >
          <div
            className={
              dataState.calendarType !== CalendarType.LUNAR ? "hide" : ""
            }
          >
            <LunarDateInput
              year={dataState.lunarYear}
              month={dataState.lunarMonth}
              day={dataState.lunarDay}
              leap={dataState.lunarLeap}
              onChangeYear={(value) => {
                setDataState({ ...dataState, lunarYear: value });
                setIsRefresh(true);
              }}
              onChangeMonth={(value) => {
                setDataState({ ...dataState, lunarMonth: value });
                setIsRefresh(true);
              }}
              onChangeDay={(value) => {
                setDataState({ ...dataState, lunarDay: value });
                setIsRefresh(true);
              }}
              onChangeLeap={(value) => {
                setDataState({ ...dataState, lunarLeap: value });
                setIsRefresh(true);
              }}
            />
          </div>

          <div
            className={
              dataState.calendarType !== CalendarType.SOLAR ? "hide" : ""
            }
          >
            <SolarDateInput
              year={dataState.solarYear}
              month={dataState.solarMonth}
              day={dataState.solarDay}
              onChangeYear={(value) => {
                setDataState({ ...dataState, solarYear: value });
                setIsRefresh(true);
              }}
              onChangeMonth={(value) => {
                setDataState({ ...dataState, solarMonth: value });
                setIsRefresh(true);
              }}
              onChangeDay={(value) => {
                setDataState({ ...dataState, solarDay: value });
                setIsRefresh(true);
              }}
            />
          </div>
        </div>
      </div>
      <LineSeparator />
      <div>
        <div className="inline-block" style={{ width: "100px", float: "left" }}>
          <Button onClick={goToday}>今日</Button>
        </div>
        <div className="inline-block" style={{ width: "400px", float: "left" }}>
          <div className="inline-block" style={{ width: "90px" }}>
            <div>
              <Button onClick={goPrevTenYear} style={{ width: "80px" }}>
                上十年
              </Button>
            </div>
            <div style={{ marginTop: 5 }}>
              <Button onClick={goNextTenYear} style={{ width: "80px" }}>
                下十年
              </Button>
            </div>
          </div>
          <div className="inline-block" style={{ width: "90px" }}>
            <div>
              <Button onClick={goPrevYear} style={{ width: "80px" }}>
                上年
              </Button>
            </div>
            <div style={{ marginTop: 5 }}>
              <Button onClick={goNextYear} style={{ width: "80px" }}>
                下年
              </Button>
            </div>
          </div>
          <div className="inline-block" style={{ width: "90px" }}>
            <div>
              <Button onClick={goPrevMonth} style={{ width: "80px" }}>
                上月
              </Button>
            </div>
            <div style={{ marginTop: 5 }}>
              <Button onClick={goNextMonth} style={{ width: "80px" }}>
                下月
              </Button>
            </div>
          </div>
          <div className="inline-block" style={{ width: "90px" }}>
            <div>
              <Button onClick={goPrevDay} style={{ width: "80px" }}>
                上日
              </Button>
            </div>
            <div style={{ marginTop: 5 }}>
              <Button onClick={goNextDay} style={{ width: "80px" }}>
                下日
              </Button>
            </div>
          </div>
        </div>
        <div style={{ clear: "both" }}></div>
      </div>
    </Card>
  );
};
