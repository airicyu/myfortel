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

export const RuntimeConfigInputPanel = (
  props: RuntimeConfigDataStateType & {
    updateRuntimeConfig: (dataState: RuntimeConfigDataStateType) => void;
  }
) => {
  const [calendarType, setCalendarType] = useState<CalendarType>(
    props.calendarType ?? CalendarType.SOLAR
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

  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    console.log("props updated", props);
    const now = DateTime.now();
    const lunarDate = defaultCalendar.solar2lunar(now.year, now.month, now.day);

    setCalendarType(props.calendarType ?? CalendarType.SOLAR);
    setLunarYear(props.lunarYear ?? lunarDate.lunarYear);
    setLunarMonth(props.lunarMonth ?? lunarDate.lunarMonth);
    setLunarDay(props.lunarDay ?? lunarDate.lunarDay);
    setLunarLeap(props.leap ?? lunarDate.isLeapMonth);
    setSolarYear(props.solarYear ?? now.year);
    setSolarMonth(props.solarMonth ?? now.month);
    setSolarDay(props.solarDay ?? now.day);
    setScope(props.scope ?? 0);
  }, [props]);

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
    if (isRefresh) {
      setIsRefresh(false);
      updateRuntimeConfig();
    }
  }, [isRefresh, updateRuntimeConfig]);

  const goToday = useCallback(() => {
    setCalendarType(CalendarType.SOLAR);
    setSolarYear(DateTime.now().year);
    setSolarMonth(DateTime.now().month);
    setSolarDay(DateTime.now().day);
    setIsRefresh(true);
  }, []);

  const goPrevTenYear = useCallback(() => {
    setCalendarType(CalendarType.LUNAR);
    onChangeCalendarType(CalendarType.LUNAR);
    if (lunarYear) {
      setLunarYear(lunarYear - 10);
    }
    setLunarLeap(false);
    setScope(1);
    setIsRefresh(true);
  }, [lunarYear, onChangeCalendarType]);

  const goNextTenYear = useCallback(() => {
    setCalendarType(CalendarType.LUNAR);
    onChangeCalendarType(CalendarType.LUNAR);
    if (lunarYear) {
      setLunarYear(lunarYear + 10);
    }
    setLunarLeap(false);
    setScope(1);
    setIsRefresh(true);
  }, [lunarYear, onChangeCalendarType]);

  const goPrevYear = useCallback(() => {
    setCalendarType(CalendarType.LUNAR);
    onChangeCalendarType(CalendarType.LUNAR);
    if (lunarYear) {
      setLunarYear(lunarYear - 1);
    }
    setLunarLeap(false);
    setScope(2);
    setIsRefresh(true);
  }, [lunarYear, onChangeCalendarType]);

  const goNextYear = useCallback(() => {
    setCalendarType(CalendarType.LUNAR);
    onChangeCalendarType(CalendarType.LUNAR);
    if (lunarYear) {
      setLunarYear(lunarYear + 1);
    }
    setLunarLeap(false);
    setScope(2);
    setIsRefresh(true);
  }, [lunarYear, onChangeCalendarType]);

  const goPrevMonth = useCallback(() => {
    setCalendarType(CalendarType.LUNAR);
    onChangeCalendarType(CalendarType.LUNAR);
    if (lunarYear && lunarMonth) {
      if (lunarMonth > 1) {
        setLunarMonth(lunarMonth - 1);
      } else {
        setLunarYear(lunarYear - 1);
        setLunarMonth(12);
      }
    }
    setLunarLeap(false);
    setScope(3);
    setIsRefresh(true);
  }, [lunarMonth, lunarYear, onChangeCalendarType]);

  const goNextMonth = useCallback(() => {
    setCalendarType(CalendarType.LUNAR);
    onChangeCalendarType(CalendarType.LUNAR);
    if (lunarYear && lunarMonth) {
      if (lunarMonth < 12) {
        setLunarMonth(lunarMonth + 1);
      } else {
        setLunarYear(lunarYear + 1);
        setLunarMonth(1);
      }
    }
    setLunarLeap(false);
    setScope(3);
    setIsRefresh(true);
  }, [lunarMonth, lunarYear, onChangeCalendarType]);

  const goPrevDay = useCallback(() => {
    setCalendarType(CalendarType.LUNAR);
    onChangeCalendarType(CalendarType.LUNAR);
    if (lunarYear && lunarMonth && lunarDay) {
      const solarDate = defaultCalendar.lunar2solar(
        lunarYear,
        lunarMonth,
        lunarDay,
        lunarLeap
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
      setLunarYear(lunarDate.lunarYear);
      setLunarMonth(lunarDate.lunarMonth);
      setLunarDay(lunarDate.lunarDay);
      setLunarLeap(lunarDate.isLeapMonth);
      setScope(4);
      setIsRefresh(true);
    }
  }, [lunarDay, lunarLeap, lunarMonth, lunarYear, onChangeCalendarType]);

  const goNextDay = useCallback(() => {
    setCalendarType(CalendarType.LUNAR);
    onChangeCalendarType(CalendarType.LUNAR);
    if (lunarYear && lunarMonth && lunarDay) {
      const solarDate = defaultCalendar.lunar2solar(
        lunarYear,
        lunarMonth,
        lunarDay,
        lunarLeap
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
      setLunarYear(lunarDate.lunarYear);
      setLunarMonth(lunarDate.lunarMonth);
      setLunarDay(lunarDate.lunarDay);
      setLunarLeap(lunarDate.isLeapMonth);
      setScope(4);
      setIsRefresh(true);
    }
  }, [lunarDay, lunarLeap, lunarMonth, lunarYear, onChangeCalendarType]);

  return (
    <Card style={{ width: 600 }} title="流曜顯示">
      <Slider
        style={{ width: 200 }}
        marks={marks}
        value={scope}
        min={0}
        max={4}
        onChange={(value) => {
          setScope(value);
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
          value={calendarType}
          onChange={(value) => {
            onChangeCalendarType(value);
            setIsRefresh(true);
          }}
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
              onChangeYear={(value) => {
                setLunarYear(value);
                setIsRefresh(true);
              }}
              onChangeMonth={(value) => {
                setLunarMonth(value);
                setIsRefresh(true);
              }}
              onChangeDay={(value) => {
                setLunarDay(value);
                setIsRefresh(true);
              }}
              onChangeLeap={(value) => {
                setLunarLeap(value);
                setIsRefresh(true);
              }}
            />
          </div>

          <div className={calendarType !== CalendarType.SOLAR ? "hide" : ""}>
            <SolarDateInput
              year={solarYear}
              month={solarMonth}
              day={solarDay}
              onChangeYear={(value) => {
                setSolarYear(value);
                setIsRefresh(true);
              }}
              onChangeMonth={(value) => {
                setSolarMonth(value);
                setIsRefresh(true);
              }}
              onChangeDay={(value) => {
                setSolarDay(value);
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
