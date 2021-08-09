import React, { useState, useEffect, Fragment } from "react";
import {
  Group,
  Placeholder,
  RichCell,
  Avatar,
  Spinner,
  PanelHeader,
  PanelHeaderButton,
  Snackbar,
} from "@vkontakte/vkui";
import {
  Icon56GhostOutline,
  Icon28RefreshOutline,
  Icon16Done,
} from "@vkontakte/icons";
import fetch2 from "../components/Fetch";

export default function Feed(props) {
  const [loaded, setLoaded] = useState(false);
  const [feed, setFeed] = useState([]);
  const [loader, setLoader] = useState(
    localStorage.getItem("feed") !== null ? false : true
  );
  const [updated, setUpdated] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // eslint-disable-next-line
  function render(data, push = false, instantLoad = false) {
    let arr = [];
    let i = 0;
    data.forEach((el) => {
      arr.push(
        <a href={el.link} key={i} target="_blank" rel="noreferrer">
          <RichCell
            before={<Avatar size={48} mode="app" src={el.img} />}
            caption={el.description}
            after={el.time}
          >
            {el.message}
          </RichCell>
        </a>
      );
      i = i + 1;
    });
    setFeed(arr);
    if (instantLoad) setLoaded(true);
    else setTimeout(() => setLoaded(true), 100);
    setUpdated(false);
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
          Лента обновлена!
        </Snackbar>
      );
    }
  }

  useEffect(() => {
    if (!loaded && updated === false) {
      const timeout = setTimeout(() => {
        if (!loaded) setLoader(true);
      }, 400);
      setUpdated(true);
      if (
        localStorage.getItem("feed") !== undefined &&
        localStorage.getItem("feed") !== null &&
        localStorage.getItem("feed").length !== 0
      ) {
        render(JSON.parse(localStorage.getItem("feed")), false, true);
        clearTimeout(timeout);
      } else {
        fetch2("loadFeed").then((data) => {
          if (data.response !== false && data.response.length !== 0) {
            render(data.response);
            localStorage.setItem("feed", JSON.stringify(data.response));
            clearTimeout(timeout);
          } else {
            setLoaded(true);
            setUpdated(false);
          }
        });
        if (
          window.location.hash !== null &&
          window.location.hash !== undefined &&
          window.location.hash !== ""
        ) {
          fetch2(
            "getContentMakerServices",
            "tag=" + window.location.hash.substr(1)
          ).then((data) => {
            if (data.response !== "not_found" && data.response.length !== 0)
              props.setActiveModal("contentMakerServices", null, data.response);
          });
        }
      }
    }
  }, [loaded, render, updated, props]);

  return (
    <Fragment>
      <PanelHeader
        separator={props.isDesktop ? true : false}
        left={
          feed.length !== 0 && (
            <PanelHeaderButton
              disabled={disabled}
              onClick={() => {
                setDisabled(true);
                fetch2("loadFeed").then((data) => {
                  if (data.response !== false && data.response.length !== 0) {
                    render(data.response, true);
                    localStorage.setItem("feed", JSON.stringify(data.response));
                    setTimeout(() => setDisabled(false), 3000);
                  }
                });
              }}
            >
              <Icon28RefreshOutline />
            </PanelHeaderButton>
          )
        }
      >
        {props.isDesktop ? "Лента уведомлений" : "Лента"}
      </PanelHeader>
      <Group>
        {loaded ? (
          <Fragment>
            {feed.length === 0 ? (
              <div
                style={{
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Placeholder
                  style={{ marginBottom: -20, marginTop: -20 }}
                  icon={<Icon56GhostOutline />}
                  header="Что-то тут тихо... даже слишком"
                >
                  Как только Вы получите хоть одно уведомление - оно отобразится
                  здесь. В ленте может находиться до 100 уведомлений.
                </Placeholder>
              </div>
            ) : (
              feed
            )}
          </Fragment>
        ) : (
          loader && <Spinner size="medium" />
        )}
      </Group>
    </Fragment>
  );
}
