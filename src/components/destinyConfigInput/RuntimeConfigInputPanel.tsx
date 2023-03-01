import { Segmented, Card, Slider } from "antd";
import { defaultCalendar } from "fortel-ziweidoushu";
import { useCallback, useState, useEffect } from "react";
import { RuntimeConfigDataStateType } from "../../view/buildBoard/stateMapper";
import { LunarDateInput } from "./LunarDateInput";
import { SolarDateInput } from "./SolarDateInput";
import type { SliderMarks } from "antd/es/slider";
import { CalendarType } from "fortel-ziweidoushu";

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

export const RuntimeConfigInputPanel = (
  props: RuntimeConfigDataStateType & {
    updateRuntimeConfig: (dataState: RuntimeConfigDataStateType) => void;
  }
) => {
  const [calendarType, setCalendarType] = useState<CalendarType>(
    props.calendarType ?? CalendarType.LUNAR
  );

  const [lunarYear, setLunarYear] = useState<number | null>(
    props.lunarYear ?? 1990
  );
  const [lunarMonth, setLunarMonth] = useState<number | null>(
    props.lunarMonth ?? 1
  );
  const [lunarDay, setLunarDay] = useState<number | null>(props.lunarDay ?? 1);
  const [lunarLeap, setLunarLeap] = useState<boolean>(props.leap ?? false);

  const [solarYear, setSolarYear] = useState<number | null>(
    props.solarYear ?? 1990
  );
  const [solarMonth, setSolarMonth] = useState<number | null>(
    props.solarMonth ?? 1
  );
  const [solarDay, setSolarDay] = useState<number | null>(props.solarDay ?? 1);

  const [scope, setScope] = useState<number>(props.scope ?? 0);

  const updateRuntimeConfig = useCallback(() => {
    props.updateRuntimeConfig({
      calendarType,
      lunarYear: lunarYear ?? undefined,
      lunarMonth: lunarMonth ?? undefined,
      lunarDay: lunarDay ?? undefined,
      leap: lunarLeap,
      solarYear: solarYear ?? undefined,
      solarMonth: solarMonth ?? undefined,
      solarDay: solarDay ?? undefined,
      scope,
    });
  }, [
    calendarType,
    lunarDay,
    lunarLeap,
    lunarMonth,
    lunarYear,
    props,
    scope,
    solarDay,
    solarMonth,
    solarYear,
  ]);

  const onChangeCalendarType = useCallback(
    (value: string | number) => {
      if (calendarType === CalendarType.LUNAR && value === CalendarType.SOLAR) {
        if (lunarYear && lunarMonth && lunarDay) {
          try {
            const solarDate = defaultCalendar.lunar2solar(
              lunarYear,
              lunarMonth,
              lunarDay,
              lunarLeap
            );
            if (solarDate) {
              setSolarYear(solarDate.solarYear);
              setSolarMonth(solarDate.solarMonth);
              setSolarDay(solarDate.solarDay);
            }
            setCalendarType(CalendarType.SOLAR);
          } catch (e) {
            console.debug("convert date error", e);
          }
        }
      } else if (
        calendarType === CalendarType.SOLAR &&
        value === CalendarType.LUNAR
      ) {
        try {
          if (solarYear && solarMonth && solarDay) {
            const lunarDate = defaultCalendar.solar2lunar(
              solarYear,
              solarMonth,
              solarDay
            );
            if (lunarDate) {
              setLunarYear(lunarDate.lunarYear);
              setLunarMonth(lunarDate.lunarMonth);
              setLunarDay(lunarDate.lunarDay);
              setLunarLeap(lunarDate.isLeapMonth);
            }
            setCalendarType(CalendarType.LUNAR);
          }
        } catch (e) {
          console.debug("convert date error", e);
        }
      }
    },
    [
      calendarType,
      lunarYear,
      lunarMonth,
      lunarDay,
      lunarLeap,
      solarYear,
      solarMonth,
      solarDay,
    ]
  );

  useEffect(() => {
    // console.log("runtimeconfiginputpanel updateRuntimeConfig");
    updateRuntimeConfig();
  }, [
    calendarType,
    lunarDay,
    lunarLeap,
    lunarMonth,
    lunarYear,
    solarDay,
    solarMonth,
    solarYear,
    scope,
    updateRuntimeConfig,
  ]);

  return (
    <Card style={{ width: 600 }} title="流曜顯示">
      <Slider
        style={{ width: 200 }}
        marks={marks}
        defaultValue={scope}
        min={0}
        max={4}
        onChange={setScope}
        tooltip={{ formatter: null }}
      />
      <Segmented
        options={[
          { label: "農曆", value: CalendarType.LUNAR },
          { label: "西曆", value: CalendarType.SOLAR },
        ]}
        defaultValue={calendarType}
        onChange={onChangeCalendarType}
      />
      <div
        className="inline-block"
        style={{ paddingLeft: 20, paddingRight: 0 }}
      >
        <div className={calendarType !== CalendarType.LUNAR ? "hide" : ""}>
          <LunarDateInput
            year={lunarYear}
            month={lunarMonth}
            day={lunarDay}
            leap={lunarLeap}
            onChangeYear={setLunarYear}
            onChangeMonth={setLunarMonth}
            onChangeDay={setLunarDay}
            onChangeLeap={setLunarLeap}
          />
        </div>

        <div className={calendarType !== CalendarType.SOLAR ? "hide" : ""}>
          <SolarDateInput
            year={solarYear}
            month={solarMonth}
            day={solarDay}
            onChangeYear={setSolarYear}
            onChangeMonth={setSolarMonth}
            onChangeDay={setSolarDay}
          />
        </div>
      </div>
    </Card>
  );
};
