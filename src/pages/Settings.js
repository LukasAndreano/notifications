import React, { useState, useEffect, Fragment } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  Group,
  Placeholder,
  Spinner,
  PanelHeaderBack,
  Switch,
  PanelHeader,
  Cell,
} from "@vkontakte/vkui";
import fetch2 from "../components/Fetch";

/*eslint eqeqeq: "off"*/

export default function Settings(props) {
  const [loaded, setLoaded] = useState(false);
  const [loader, setLoader] = useState(props.isDesktop);
  const [switchLoaded1, setSwitchLoaded1] = useState(true);
  const [switchLoaded2, setSwitchLoaded2] = useState(true);
  const [settings, setSettings] = useState({
    group_notifications: 0,
    notifications: 0,
  });

  useEffect(() => {
    if (!loaded) {
      const timeout = setTimeout(() => {
        if (!loaded) setLoader(true);
      }, 400);
      setSettings({
        notifications: props.data.notifications,
        group_notifications: props.data.group_notifications,
      });
      clearTimeout(timeout);
      setLoaded(true);
    }
  }, [props, loaded, setLoader]);

  return (
    <Fragment>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => props.goBack("subscriptions")} />}
        separator={props.isDesktop ? true : false}
      >
        {props.isDesktop ? "Настройки уведомлений" : "Настройки"}
      </PanelHeader>
      <Group>
        {loaded ? (
          <Fragment>
            <Placeholder style={{ marginTop: -20, marginBottom: -20 }}>
              Уведомления от сообщества будут приходить Вам в личные сообщения,
              а от сервиса в «колокольчик» (раздел уведомлений).
            </Placeholder>
            <Cell
              onClick={() => {
                if (settings.group_notifications == 0) {
                  bridge
                    .send("VKWebAppAllowMessagesFromGroup", {
                      group_id: 206215182,
                    })
                    .then((data) => {
                      if (data.result === true) {
                        fetch2("enableNotificationsFromGroup").then((data) => {
                          if (data.result === "ok") {
                            if (props.tour === 3) {
                              setTimeout(
                                () => props.setActiveModal("tour4"),
                                100
                              );
                            }
                            setSwitchLoaded1(false);
                            localStorage.removeItem("settings");
                            setSettings({
                              group_notifications: 1,
                              notifications: settings.notifications,
                            });
                            setTimeout(() => setSwitchLoaded1(true), 100);
                          }
                        });
                      }
                    });
                } else {
                  fetch2("disableNotificationsFromGroup").then((data) => {
                    if (data.result === "ok") {
                      setSwitchLoaded1(false);
                      localStorage.removeItem("settings");
                      setSettings({
                        group_notifications: 0,
                        notifications: settings.notifications,
                      });
                      setTimeout(() => setSwitchLoaded1(true), 100);
                    }
                  });
                }
              }}
              after={
                switchLoaded1 ? (
                  <Switch
                    className="switchEl"
                    defaultChecked={settings.group_notifications == 1}
                  />
                ) : (
                  <Spinner size="small" style={{ marginRight: 10 }} />
                )
              }
            >
              Уведомления от сообщества
            </Cell>
            <Cell
              onClick={() => {
                if (settings.notifications == 0) {
                  bridge.send("VKWebAppAllowNotifications").then((data) => {
                    if (data.result === true) {
                      fetch2("enableNotificationsFromApp").then((data) => {
                        if (data.result === "ok") {
                          if (props.tour === 3) {
                            setTimeout(
                              () => props.setActiveModal("tour4"),
                              100
                            );
                          }
                          setSwitchLoaded2(false);
                          localStorage.removeItem("settings");
                          setSettings({
                            group_notifications: settings.group_notifications,
                            notifications: 1,
                          });
                          setTimeout(() => setSwitchLoaded2(true), 100);
                        }
                      });
                    }
                  });
                } else {
                  fetch2("disableNotificationsFromApp").then((data) => {
                    if (data.result === "ok") {
                      setSwitchLoaded2(false);
                      localStorage.removeItem("settings");
                      setSettings({
                        group_notifications: settings.group_notifications,
                        notifications: 0,
                      });
                      setTimeout(() => setSwitchLoaded2(true), 100);
                    }
                  });
                }
              }}
              after={
                switchLoaded2 ? (
                  <Switch
                    className="switchEl"
                    defaultChecked={settings.notifications == 1}
                  />
                ) : (
                  <Spinner size="small" style={{ marginRight: 10 }} />
                )
              }
            >
              Уведомления от сервиса
            </Cell>
          </Fragment>
        ) : (
          loader && <Spinner size="medium" />
        )}
      </Group>
    </Fragment>
  );
}
