import React, { useState, useEffect, Fragment } from "react";
import {
  Group,
  Placeholder,
  RichCell,
  Avatar,
  Spinner,
  Separator,
  Button,
  PanelHeader,
  PanelHeaderButton,
} from "@vkontakte/vkui";
import {
  Icon56NotificationOutline,
  Icon28SettingsOutline,
} from "@vkontakte/icons";
import fetch2 from "../components/Fetch";
import isset from "../components/Isset";

/*eslint eqeqeq: "off"*/

export default function Subscriptions(props) {
  const [loaded, setLoaded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loader, setLoader] = useState(
    localStorage.getItem("subscriptions") !== null ? false : true
  );

  const [updated, setUpdated] = useState(false);

  const [settings, setSettings] = useState({
    group_notifications: 0,
    notifications: 0,
  });

  // eslint-disable-next-line
  function render(data, instantLoad = false) {
    let arr = [];
    data.forEach((el) => {
      arr.push(
        <RichCell
          key={el.id}
          before={<Avatar size={48} mode="app" src={el.img} />}
          caption={el.description}
          onClick={() =>
            props.setActiveModal("remove", {
              img: el.img,
              data: el.data,
              name: el.description,
              service_id: el.service_id,
            })
          }
        >
          {el.name}
        </RichCell>
      );
    });
    setNotifications(arr);
    if (arr.length !== 0 && props.tour === 2) {
      props.setActiveModal("tour3");
    }
    if (instantLoad) setLoaded(true);
    else setTimeout(() => setLoaded(true), 100);
    setUpdated(false);
  }

  useEffect(() => {
    if (loaded && props.updated && updated === false) {
      setTimeout(() => {
        if (!loaded) setLoader(true);
      }, 400);
      setUpdated(true);
      fetch2("loadNotifications").then((data) => {
        if (isset(data.result.nofitications)) {
          render(data.result.nofitications);
          localStorage.setItem(
            "subscriptions",
            JSON.stringify(data.result.nofitications)
          );
          localStorage.setItem("settings", JSON.stringify(data.result.user));
        } else {
          setLoaded(true);
        }
      });
    } else {
      if (!loaded && updated === false) {
        const timeout = setTimeout(() => {
          if (!loaded) setLoader(true);
        }, 400);
        setUpdated(true);
        if (
          localStorage.getItem("subscriptions") !== undefined &&
          localStorage.getItem("subscriptions") !== null &&
          localStorage.getItem("subscriptions").length !== 0
        ) {
          if (
            localStorage.getItem("settings") !== undefined &&
            localStorage.getItem("settings") !== null &&
            localStorage.getItem("settings").length !== 0
          ) {
            setSettings({
              group_notifications: JSON.parse(localStorage.getItem("settings"))
                .group_notifications,
              notifications: JSON.parse(localStorage.getItem("settings"))
                .notifications,
            });
            render(JSON.parse(localStorage.getItem("subscriptions")), true);
            clearTimeout(timeout);
            setLoaded(true);
          } else {
            fetch2("getStatusOfNotifications").then((data) => {
              setSettings({
                group_notifications: data.result.group_notifications,
                notifications: data.result.notifications,
              });
              localStorage.setItem("settings", JSON.stringify(data.result));
              render(JSON.parse(localStorage.getItem("subscriptions")));
              clearTimeout(timeout);
            });
          }
        } else {
          fetch2("loadNotifications").then((data) => {
            if (isset(data.result.nofitications)) {
              render(data.result.nofitications);
              clearTimeout(timeout);
              localStorage.setItem(
                "subscriptions",
                JSON.stringify(data.result.nofitications)
              );
              localStorage.setItem(
                "settings",
                JSON.stringify(data.result.user)
              );
            } else {
              setLoaded(true);
            }
          });
        }
      }
    }
  }, [render, props, loaded, updated, setLoader]);

  return (
    <Fragment>
      <PanelHeader
        left={
          (settings.group_notifications != 0 ||
            settings.notifications != 0) && (
            <PanelHeaderButton
              onClick={() =>
                props.go("settings", {
                  group_notifications: settings.group_notifications,
                  notifications: settings.notifications,
                })
              }
            >
              <Icon28SettingsOutline />
            </PanelHeaderButton>
          )
        }
        separator={props.isDesktop ? true : false}
      >
        {props.isDesktop ? "Ваши подписки" : "Подписки"}
      </PanelHeader>
      <Group>
        {loaded ? (
          <Fragment>
            {notifications.length !== 0 ? (
              <Fragment>
                {settings.group_notifications == 0 &&
                  settings.notifications == 0 && (
                    <Fragment>
                      <Placeholder
                        style={{ marginBottom: -20, marginTop: -20 }}
                        icon={<Icon56NotificationOutline />}
                        header="Включите уведомления!"
                        action={
                          <Button
                            size="m"
                            onClick={() =>
                              props.go("settings", {
                                group_notifications:
                                  settings.group_notifications,
                                notifications: settings.notifications,
                              })
                            }
                          >
                            Перейти в настройки
                          </Button>
                        }
                      >
                        Сейчас у Вас отключены уведомления. Мы не сможем
                        уведомить Вас, если что-то произойдет в том или ином
                        сервисе.
                      </Placeholder>
                      <Separator />
                    </Fragment>
                  )}
                <Placeholder
                  header="Подключенные сервисы"
                  style={{ marginBottom: -20, marginTop: -20 }}
                >
                  Здесь отображён список всех подключенных сервисов. Если Вы
                  захотите отключить какой-либо сервис - просто нажмите на него.
                </Placeholder>
                {notifications}
              </Fragment>
            ) : (
              <div
                style={{
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Placeholder
                  header="Тут совсем ничего нет!"
                  icon={<Icon56NotificationOutline />}
                >
                  Подключите свой первый сервис и начните получать уведомления.
                  Мы не дадим Вам пропустить что-то важное!
                </Placeholder>
              </div>
            )}
          </Fragment>
        ) : (
          loader && <Spinner size="medium" />
        )}
      </Group>
    </Fragment>
  );
}
