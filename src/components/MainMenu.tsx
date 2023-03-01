import { useMemo, useState } from "react";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useCallback } from "react";

export const MainMenu = ({ defaultValue }: { defaultValue: string }) => {
  const [current, setCurrent] = useState(defaultValue);
  const [searchParams] = useSearchParams();

  const urlSearchParams = useMemo(() => {
    const urlSearchParams = new URLSearchParams();
    const cal = searchParams.get("cal");
    if (cal) {
      urlSearchParams.set("cal", cal);
    }
    const y = searchParams.get("y");
    if (y) {
      urlSearchParams.set("y", y);
    }
    const m = searchParams.get("m");
    if (m) {
      urlSearchParams.set("m", m);
    }
    const d = searchParams.get("d");
    if (d) {
      urlSearchParams.set("d", d);
    }
    const lp = searchParams.get("lp");
    if (lp === "0" || lp === "1") {
      urlSearchParams.set("lp", lp);
    }
    const g = searchParams.get("g");
    if (g) {
      urlSearchParams.set("g", g);
    }
    return urlSearchParams;
  }, [searchParams]);

  const items: MenuProps["items"] = useMemo(
    () => [
      {
        label: (
          <Link to={`/buildBoard?${urlSearchParams.toString()}`}>起盤</Link>
        ),
        key: "buildBoard",
        icon: <SettingOutlined />,
      },
      {
        label: (
          <Link to={`/dayBoards?${urlSearchParams.toString()}`}>全日命盤</Link>
        ),
        key: "dayBoards",
        icon: <AppstoreOutlined />,
      },
    ],
    [urlSearchParams]
  );

  const onClick: MenuProps["onClick"] = useCallback((e: any) => {
    setCurrent(e.key);
  }, []);

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};
