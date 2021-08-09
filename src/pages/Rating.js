import React, { useState, useEffect, Fragment } from "react";
import {
  Group,
  Avatar,
  RichCell,
  SubnavigationBar,
  SubnavigationButton,
  Spinner,
  PanelHeader,
  PanelHeaderButton,
  Snackbar,
  Placeholder,
} from "@vkontakte/vkui";
import {
  Icon28RefreshOutline,
  Icon16Done,
  Icon56Stars3Outline,
} from "@vkontakte/icons";
import fetch2 from "../components/Fetch";

export default function Feed(props) {
  const [loaded, setLoaded] = useState(false);
  const [youtube, setYoutube] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [loader, setLoader] = useState(
    localStorage.getItem("rating") !== null ? false : true
  );
  const [twitch, setTwitch] = useState([]);
  const [tiktok, setTiktok] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [activePanel, setActivePanel] = useState("youtube");

  // eslint-disable-next-line
  function render(data, push = false, instantLoad = false) {
    let arr = [];
    let arr2 = [];
    let arr3 = [];
    let i = 1;
    data.response.youtube.forEach((el) => {
      arr.push(
        <a
          href={"https://www.youtube.com/channel/" + el.data}
          target="_blank"
          rel="noreferrer"
          key={el.id}
        >
          <RichCell
            before={<Avatar size={48} mode="app" src={el.img} />}
            after={"#" + i}
            caption={"Подписчиков в сервисе: " + el.count}
          >
            {el.description}
          </RichCell>
        </a>
      );
      i = i + 1;
    });
    i = 1;
    data.response.twitch.forEach((el) => {
      arr2.push(
        <a
          href={"https://twitch.tv/" + el.description}
          target="_blank"
          rel="noreferrer"
          key={el.id}
        >
          <RichCell
            after={"#" + i}
            before={<Avatar size={48} mode="app" src={el.img} />}
            caption={"Подписчиков в сервисе: " + el.count}
          >
            {el.description}
          </RichCell>
        </a>
      );
      i = i + 1;
    });
    i = 1;
    data.response.tiktok.forEach((el) => {
      arr3.push(
        <a
          href={"https://www.tiktok.com/@" + el.description}
          target="_blank"
          rel="noreferrer"
          key={el.id}
        >
          <RichCell
            after={"#" + i}
            before={<Avatar size={48} mode="app" src={el.img} />}
            caption={"Подписчиков в сервисе: " + el.count}
          >
            {el.description}
          </RichCell>
        </a>
      );
      i = i + 1;
    });
    setYoutube(arr);
    setTwitch(arr2);
    setTiktok(arr3);
    setUpdated(false);
    if (instantLoad) setLoaded(true);
    else setTimeout(() => setLoaded(true), 100);
    if (push) {
      props.setSnackbar(
        <Snackbar
          layout="vertical"
          duration={2000}
          className={!props.isDesktop ? "snackBar-fix" : ""}
          onClose={() => props.setSnackbar(null)}
          before={
            <Avatar size={24} style={{ background: "var(--accent)" }}>
              <Icon16Done fill="#fff" width={14} height={14} />
            </Avatar>
          }
        >
          Рейтинг обновлен!
        </Snackbar>
      );
    }
  }

  useEffect(() => {
    if (!loaded && !updated) {
      setUpdated(true);
      const timeout = setTimeout(() => {
        if (!loaded) setLoader(true);
      }, 400);
      if (
        localStorage.getItem("tab") !== undefined &&
        localStorage.getItem("tab") !== null
      )
        setActivePanel(localStorage.getItem("tab"));
      if (
        localStorage.getItem("rating") !== undefined &&
        localStorage.getItem("rating") !== null &&
        localStorage.getItem("rating").length !== 0
      ) {
        render(JSON.parse(localStorage.getItem("rating")), false, true);
        clearTimeout(timeout);
        setLoaded(true);
      } else {
        fetch2("getRating").then((data) => {
          if (data.response !== false) {
            render(data);
            localStorage.setItem("rating", JSON.stringify(data));
            clearTimeout(timeout);
          } else {
            setLoaded(true);
          }
        });
      }
    }
  }, [loaded, render, setLoader, updated]);

  return (
    <Fragment>
      <PanelHeader
        separator={props.isDesktop ? true : false}
        left={
          loaded && (
            <PanelHeaderButton
              disabled={disabled}
              onClick={() => {
                setDisabled(true);
                fetch2("getRating").then((data) => {
                  if (data.response !== false) {
                    render(data, true);
                    localStorage.setItem("rating", JSON.stringify(data));
                    setTimeout(() => setDisabled(false), 3000);
                  } else {
                    setLoaded(true);
                  }
                });
              }}
            >
              <Icon28RefreshOutline />
            </PanelHeaderButton>
          )
        }
      >
        Популярные
      </PanelHeader>
      <Group>
        {loaded ? (
          <Fragment>
            <SubnavigationBar>
              <SubnavigationButton
                size="l"
                style={{ width: "33%" }}
                selected={activePanel === "youtube"}
                onClick={() => {
                  localStorage.setItem("tab", "youtube");
                  setActivePanel("youtube");
                }}
              >
                YouTube
              </SubnavigationButton>

              <SubnavigationButton
                size="l"
                style={{ width: "33%" }}
                selected={activePanel === "twitch"}
                onClick={() => {
                  localStorage.setItem("tab", "twitch");
                  setActivePanel("twitch");
                }}
              >
                Twitch
              </SubnavigationButton>

              <SubnavigationButton
                style={{ width: "33%" }}
                selected={activePanel === "tiktok"}
                size="l"
                onClick={() => {
                  localStorage.setItem("tab", "tiktok");
                  setActivePanel("tiktok");
                }}
              >
                TikTok
              </SubnavigationButton>
            </SubnavigationBar>
            {activePanel === "twitch" &&
              (twitch.length !== 0 ? (
                twitch
              ) : (
                <Placeholder
                  icon={<Icon56Stars3Outline />}
                  header="Никого нет!"
                >
                  Как только кто-нибудь включит уведомления Twitch-стримера, он
                  отобразится здесь.
                </Placeholder>
              ))}
            {activePanel === "youtube" &&
              (youtube.length !== 0 ? (
                youtube
              ) : (
                <Placeholder
                  icon={<Icon56Stars3Outline />}
                  header="Никого нет!"
                >
                  Как только кто-нибудь включит уведомления от любого ютубера,
                  он отобразится здесь.
                </Placeholder>
              ))}
            {activePanel === "tiktok" &&
              (tiktok.length !== 0 ? (
                tiktok
              ) : (
                <Placeholder
                  icon={<Icon56Stars3Outline />}
                  header="Никого нет!"
                >
                  Как только кто-нибудь включит уведомления от любого тиктока,
                  он отобразится здесь.
                </Placeholder>
              ))}
          </Fragment>
        ) : (
          loader && <Spinner size="medium" />
        )}
      </Group>
    </Fragment>
  );
}
