import React, { useState, useEffect, Fragment } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  Group,
  platform,
  Banner,
  RichCell,
  Avatar,
  PanelHeader,
  Button,
  Snackbar,
  SimpleCell,
  Header,
  Spinner,
} from "@vkontakte/vkui";
import {
  Icon28FavoriteOutline,
  Icon28Users3Outline,
  Icon16Done,
  Icon28UserStarBadgeOutline,
  Icon28MessageAddBadgeOutline,
  Icon28UserOutgoingOutline,
  Icon28QuestionOutline,
  Icon28LightbulbOutline,
  Icon28ChainOutline,
  Icon28MailOutline,
} from "@vkontakte/icons";
import fetch2 from "../components/Fetch";

/*eslint eqeqeq: "off"*/
export default function Profile(props) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState({ pro: 0, status: 0 });
  const [loader, setLoader] = useState(
    localStorage.getItem("profile") !== null ? false : true
  );
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!loaded && updated === false) {
      const timeout = setTimeout(() => {
        if (!loaded) setLoader(true);
      }, 400);
      setUpdated(true);
      if (
        localStorage.getItem("profile") !== undefined &&
        localStorage.getItem("profile") !== null &&
        localStorage.getItem("profile").length !== 0
      ) {
        let data = JSON.parse(localStorage.getItem("profile"));
        setData({ pro: data.pro, status: data.status });
        setLoaded(true);
        clearTimeout(timeout);
      } else {
        fetch2("getProfile").then((data) => {
          if (data.response !== false && data.response.length !== 0) {
            setData({
              pro: data.response.pro,
              status: data.response.status,
            });
            localStorage.setItem("profile", JSON.stringify(data.response));
            if (data.response.status == 1)
              localStorage.setItem("link", data.response.link);
            setTimeout(() => setLoaded(true), 100);
            clearTimeout(timeout);
          } else {
            setLoaded(true);
            setUpdated(false);
          }
        });
      }
    }
  }, [loaded, updated]);

  return (
    <Fragment>
      <PanelHeader separator={props.isDesktop ? true : false}>
        ??????????????
      </PanelHeader>
      <Group style={{ paddingLeft: 5, paddingRight: 5 }}>
        {loaded ? (
          <Fragment>
            {platform() !== "ios" && data.pro == 0 && (
              <Banner
                mode="image"
                header="???????????? ???????????????? ???????????????? ?????????????????????????"
                subheader="???????????????????? ???????????????? VK Donut ?????????? ????????????!"
                background={
                  <div
                    style={{
                      backgroundColor: "#71AAEB",
                      backgroundSize: 320,
                    }}
                  />
                }
                actions={
                  <Button
                    mode="overlay_primary"
                    onClick={() => {
                      props.setActiveModal("donut");
                    }}
                  >
                    ??????????????????
                  </Button>
                }
              />
            )}
            <RichCell
              disabled
              multiline
              before={<Avatar size={72} src={props.user.photo_100} />}
              text={
                platform() !== "ios" &&
                (data.pro == 1
                  ? "????????????????: ????????????????????????"
                  : "????????????????: ??????????????????????")
              }
              caption={
                data.status == 1
                  ? "???????????????????? ???????????????????????? ??????????????-??????????????"
                  : data.status == 0
                  ? "???????????????????????? ??????????????-?????????????? ??????????????????????"
                  : (data.status == 2 ||
                      localStorage.getItem("request") === false) &&
                    "???????????? ???????????? ???? ???????????????????????? ??????????????-??????????????"
              }
            >
              <span
                dangerouslySetInnerHTML={{ __html: props.user.first_name }}
              />{" "}
              <span
                dangerouslySetInnerHTML={{ __html: props.user.last_name }}
              />
            </RichCell>
            {data.status == 1 && (
              <Fragment>
                <Header mode="secondary">?????????????? ??????????????-??????????????</Header>
                <SimpleCell
                  onClick={() => {
                    if (localStorage.getItem("link") === null) {
                      props.setActiveModal("setLink");
                    } else {
                      props.setActiveModal("refLink", {
                        link: localStorage.getItem("link"),
                      });
                    }
                  }}
                  expandable
                  before={<Icon28ChainOutline />}
                >
                  ???????????? ???? ????????????????
                </SimpleCell>
                <SimpleCell
                  onClick={() => props.setActiveModal("startMailing")}
                  expandable
                  before={<Icon28MailOutline />}
                >
                  ???????????????? ?????? ??????????????????????
                </SimpleCell>
              </Fragment>
            )}
            <Header mode="secondary">?????????????????? ??????????????</Header>
            {localStorage.getItem("favorites") == 0 && (
              <SimpleCell
                onClick={() =>
                  bridge.send("VKWebAppAddToFavorites").then((data) => {
                    if (data.result === true) {
                      localStorage.setItem("favorites", 1);
                      props.setSnackbar(
                        <Snackbar
                          layout="vertical"
                          duration={2000}
                          className={!props.isDesktop ? "snackBar-fix" : ""}
                          onClose={() => props.setSnackbar(null)}
                          before={
                            <Avatar
                              size={24}
                              style={{ background: "var(--accent)" }}
                            >
                              <Icon16Done fill="#fff" width={14} height={14} />
                            </Avatar>
                          }
                        >
                          ???????????? ???????????????? ?? ??????????????????????!
                        </Snackbar>
                      );
                    }
                  })
                }
                expandable
                before={<Icon28FavoriteOutline />}
              >
                ???????????????? ?? ??????????????????
              </SimpleCell>
            )}
            <SimpleCell
              onClick={() =>
                bridge.send("VKWebAppAddToCommunity").then((data) => {
                  if (data.group_id !== undefined && data.group_id !== null) {
                    props.setSnackbar(
                      <Snackbar
                        layout="vertical"
                        duration={2000}
                        className={!props.isDesktop ? "snackBar-fix" : ""}
                        onClose={() => props.setSnackbar(null)}
                        before={
                          <Avatar
                            size={24}
                            style={{ background: "var(--accent)" }}
                          >
                            <Icon16Done fill="#fff" width={14} height={14} />
                          </Avatar>
                        }
                      >
                        ???????????? ???????????????? ?? ????????????????????!
                      </Snackbar>
                    );
                  }
                })
              }
              expandable
              before={<Icon28Users3Outline />}
            >
              ???????????????????? ???????????? ?? ????????????
            </SimpleCell>
            {data.status == 0 && localStorage.getItem("request") === null && (
              <SimpleCell
                expandable
                before={<Icon28UserStarBadgeOutline />}
                onClick={() => props.setActiveModal("contentMakerRequest")}
              >
                ?????????? ??????????????-????????????????
              </SimpleCell>
            )}
            <SimpleCell
              onClick={() => props.setActiveModal("tour1")}
              expandable
              before={<Icon28LightbulbOutline />}
            >
              ???????????? ????????
            </SimpleCell>
            <Header mode="secondary">????????????</Header>
            <a
              href="https://vk.com/@notificationsapp-start-guide"
              target="_blank"
              rel="noreferrer"
            >
              <SimpleCell expandable before={<Icon28QuestionOutline />}>
                ?????????????? FAQ
              </SimpleCell>
            </a>
            <a
              href="https://vk.com/club206215182"
              target="_blank"
              rel="noreferrer"
            >
              <SimpleCell expandable before={<Icon28UserOutgoingOutline />}>
                ?????????????? ?? ????????????????????
              </SimpleCell>
            </a>
            <a
              href="https://vk.com/id172118960"
              target="_blank"
              rel="noreferrer"
            >
              <SimpleCell expandable before={<Icon28MessageAddBadgeOutline />}>
                ?????????? ?? ??????????????????????????
              </SimpleCell>
            </a>
          </Fragment>
        ) : (
          loader && <Spinner size="medium" />
        )}
      </Group>
    </Fragment>
  );
}
