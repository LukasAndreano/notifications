import React, { useState, useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  SplitLayout,
  SplitCol,
  Cell,
  View,
  PanelHeader,
  Panel,
  Placeholder,
  Tabbar,
  TabbarItem,
  Epic,
  Group,
  Footer,
  Badge,
  withAdaptivity,
  ModalPage,
  usePlatform,
  VKCOM,
  Snackbar,
  PanelHeaderButton,
  Button,
  ModalCard,
  ModalRoot,
  ModalPageHeader,
  Alert,
  Avatar,
} from "@vkontakte/vkui";

import {
  Icon24Dismiss,
  Icon28Notifications,
  Icon28ServicesOutline,
  Icon56ServicesOutline,
  Icon28NewsfeedOutline,
  Icon56UserCircleOutline,
  Icon16Done,
  Icon56CheckCircleOutline,
  Icon28UserCircleOutline,
  Icon56NewsfeedOutline,
  Icon56LikeOutline,
  Icon56GestureOutline,
  Icon28LikeOutline,
} from "@vkontakte/icons";

import fetch2 from "./components/Fetch";

import Subscriptions from "./pages/Subscriptions";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import Feed from "./pages/Feed";
import Rating from "./pages/Rating";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";

import Twitch from "./forms/twitch";
import YouTube from "./forms/youtube";
import TikTok from "./forms/tiktok";
import Request from "./forms/request";
import SetLink from "./forms/setlink";
import RefLink from "./forms/reflink";
import Mailing from "./forms/mailing";
import ContentMakerServices from "./forms/contentmakerservices";

// eslint-disable-next-line
Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

const STORAGE_KEYS = {
  STATUS: "status",
};

const App = withAdaptivity(
  ({ viewWidth }) => {
    const platform = usePlatform();
    const [activeStory, setActiveStory] = useState("feed");
    const isDesktop = viewWidth >= 3;
    const hasHeader = platform !== VKCOM;
    const [popout, setPopout] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setModal] = useState(null);
    const [modalHistory, setModalHistory] = useState([]);
    const [activePanel, setActivePanel] = useState("feed");
    const [history, setHistory] = useState(["feed"]);
    const [updated, setUpdated] = useState(false);
    const [snackbar, setSnackbarInService] = useState(null);
    const [tour, setTour] = useState(0);
    const [user, setUser] = useState([]);

    const [panelHistory, setPanelHistory] = useState({
      subscriptions: ["subscriptions"],
      services: ["services"],
      feed: ["feed"],
      rating: ["rating"],
      profile: ["profile"],
    });

    const pages = ["services", "subscriptions", "feed", "rating", "profile"];

    const [data, setData] = useState({ img: "", name: "", service_id: 0 });
    const [data2, setData2] = useState([]);
    const [goData, setGoData] = useState({});

    useEffect(() => {
      if (!loaded) {
        bridge
          .send("VKWebAppStorageGet", {
            keys: Object.values(STORAGE_KEYS),
          })
          .then((data) => {
            if (data.keys[0].value !== "true") {
              setTimeout(() => {
                if (
                  window.location.hash === null ||
                  window.location.hash === undefined ||
                  window.location.hash === ""
                ) {
                  setActiveModal("tour1");
                  bridge.send("VKWebAppStorageSet", {
                    key: STORAGE_KEYS.STATUS,
                    value: "true",
                  });
                } else {
                  bridge.send("VKWebAppStorageSet", {
                    key: STORAGE_KEYS.STATUS,
                    value: "true",
                  });
                }
              }, 1000);
            }
          });

        bridge.send("VKWebAppGetUserInfo").then((data) => {
          setUser(data);
        });

        window.addEventListener("offline", () => {
          openAction(
            "Уведомление",
            "Вы потеряли подключение к сети. Загрузка контента, обновление ленты, а также отправка некоторых данных может быть недоступна."
          );
        });

        window.addEventListener("online", () => {
          openAction(
            "Уведомление",
            "Вы снова онлайн! Однако для восстановления работы всех функций мы должны перезагрузить приложение. Перезагрузка будет выполнена автоматически через 5с."
          );
          setTimeout(() => {
            setLoaded(false);
            setPopout(null);
            setTimeout(() => setLoaded(true), 300);
          }, 7000);
        });
      }
    }, [loaded, setActiveModal]);

    const onStoryChange = (e) => {
      const panel = e.currentTarget.dataset.story;
      if (panel !== activePanel) {
        const historyData = [...history];
        historyData.push(panel);
        setHistory(historyData);
        setSnackbar(null);
        setActiveStory(panel);
        setActivePanel(panelHistory[panel].slice(-1)[0]);

        if (panel === "services" && tour === 1) {
          setTimeout(() => {
            setActiveModal("tour2");
          }, 500);
        } else if (panel === "feed" && tour === 4) {
          setTimeout(() => {
            setActiveModal("tour5");
          }, 500);
        } else if (panel === "rating" && tour === 5) {
          setTimeout(() => {
            setActiveModal("tour6");
          }, 500);
        } else if (panel === "profile" && tour === 6) {
          setTimeout(() => {
            setActiveModal("tour7");
          }, 500);
        }

        if (panel !== panelHistory[panel].slice(-1)[0])
          window.history.pushState(
            null,
            null,
            "/" +
              panel +
              "/" +
              panelHistory[panel].slice(-1)[0] +
              "?" +
              window.location.href.slice(window.location.href.indexOf("?") + 1)
          );
        else
          window.history.pushState(
            null,
            null,
            "/" +
              panel +
              "?" +
              window.location.href.slice(window.location.href.indexOf("?") + 1)
          );
      }
    };

    function setSnackbar(data) {
      setSnackbarInService(data);
    }

    const goBack = (panel) => {
      const historyData = [...history];
      historyData.remove(activePanel);
      setSnackbar(null);
      setHistory(historyData);
      pages.forEach((el) => {
        if (
          Object.keys(panelHistory[el]).find(
            (key) => panelHistory[el][key] === history[history.length - 1]
          ) !== undefined
        ) {
          let data = panelHistory;
          data[el].pop();
          setPanelHistory(data);
        }
      });
      if (pages.includes(panel))
        window.history.pushState(
          null,
          null,
          "/" +
            panel +
            "?" +
            window.location.href.slice(window.location.href.indexOf("?") + 1)
        );
      setActivePanel(panel);
    };

    const go = (panel, data = null) => {
      const historyData = [...history];
      historyData.push(panel);
      setHistory(historyData);
      const panelData = panelHistory;
      if (pages.includes(activePanel)) panelData[activePanel].push(panel);
      else {
        pages.forEach((el) => {
          if (
            Object.keys(panelHistory[el]).find(
              (key) => panelHistory[el][key] === activePanel
            ) !== undefined
          ) {
            panelData[el].push(panel);
          }
        });
      }
      if (data !== null) setGoData(data);
      if (panel !== activePanel && !pages.includes(panel))
        window.history.pushState(
          null,
          null,
          "/" +
            activePanel +
            "/" +
            panel +
            "?" +
            window.location.href.slice(window.location.href.indexOf("?") + 1)
        );
      setPanelHistory(panelData);
      setActivePanel(panel);
    };

    function back() {
      if (popout !== null) {
        setPopout(null);
      } else {
        if (activeModal !== null) {
          setActiveModal(null);
        } else {
          setSnackbar(null);
          const historyData = [...history];
          if (activeStory === historyData.slice(-1)[0]) {
            historyData.pop();
            const panel = historyData[historyData.length - 1];
            if (panel !== undefined) {
              setLoaded(false);
              setHistory(historyData);
              setActivePanel(panel);
              pages.forEach((el) => {
                if (
                  Object.keys(panelHistory[el]).find(
                    (key) => panelHistory[el][key] === panel
                  ) !== undefined
                ) {
                  setActiveStory(el);
                  setLoaded(true);
                }
              });
            }
          } else {
            historyData.pop();
            const panel = historyData[historyData.length - 1];
            setHistory(historyData);
            setActivePanel(panel);
            if (pages.includes(panel)) {
              const panelData = panelHistory;
              panelData[panel].pop();
              setPanelHistory(panelData);
            }
          }
        }
      }
    }

    window.onpopstate = function () {
      back();
    };

    setTimeout(() => setLoaded(true), 250);

    function openAction(title, text) {
      setPopout(
        <Alert
          onClose={() => {
            setPopout(null);
          }}
          actions={[
            {
              title: "Понятно",
              autoclose: true,
              mode: "cancel",
            },
          ]}
          header={title}
          text={text}
        />
      );
    }

    // eslint-disable-next-line
    function setActiveModal(activeModal, data = null, data2 = null) {
      let modalHistorys = modalHistory ? [...modalHistory] : [];
      if (activeModal === null) {
        document.body.style.overflow = "visible";
        modalHistorys = [];
      } else if (modalHistorys.indexOf(activeModal) !== -1) {
        modalHistorys = modalHistorys.splice(
          0,
          modalHistorys.indexOf(activeModal) + 1
        );
      } else {
        document.body.style.overflow = "hidden";
        modalHistorys.push(activeModal);
      }
      setModal(activeModal);
      if (data !== null) setData(data);
      if (data2 !== null) setData2(data2);
      setModalHistory(modalHistorys);
    }

    const modal = (
      <ModalRoot activeModal={activeModal}>
        <ModalCard
          id="tour1"
          onClose={() => {
            setActiveModal(null);
          }}
          icon={<Icon56GestureOutline />}
          header={"Добро пожаловать в «Уведомления»"}
          className="tw"
          subheader={
            "Сервис позволяет собрать все уведомления в одном месте.\n\nХотите получать уведомления от любимых стримеров на Twitch/YouTube? Легко. Хотите отслеживать тик-токеров? Запросто!\n\nДля Вас мы подготовили небольшой тур, начнём?"
          }
          actions={
            <Button
              style={{ marginTop: -20 }}
              size="l"
              mode="primary"
              onClick={() => {
                setActiveModal(null);
                setTour(1);
                setSnackbar(
                  <Snackbar
                    layout="vertical"
                    duration={3000}
                    className={!isDesktop ? "snackBar-fix" : ""}
                    onClose={() => setSnackbar(null)}
                    before={
                      <Avatar size={24} style={{ background: "#FF3347" }} />
                    }
                  >
                    Перейдите на вкладку «Сервисы». Она помечена цветом как
                    кружок слева.
                  </Snackbar>
                );
              }}
            >
              Начнём!
            </Button>
          }
        />

        <ModalCard
          id="tour2"
          onClose={() => {
            setActiveModal(null);
            setTour(2);
            setSnackbar(
              <Snackbar
                layout="vertical"
                duration={3000}
                className={!isDesktop ? "snackBar-fix" : ""}
                onClose={() => setSnackbar(null)}
                before={<Avatar size={24} style={{ background: "#45BF45" }} />}
              >
                Новое задание: подключить любой сервис, а после чего перейти на
                вкладку «Подписки»
              </Snackbar>
            );
          }}
          icon={<Icon56ServicesOutline />}
          header={"Вкладка «Сервисы»"}
          className="tw"
          subheader={
            "Здесь отображаются все доступные на данный момент сервисы. Чтобы подключить сервис - нажмите на него. Попробуйте сделать это прямо сейчас, а затем перейдите на вкладку «Подписки»!"
          }
          actions={
            <Button
              style={{ marginTop: -20 }}
              size="l"
              mode="primary"
              onClick={() => {
                setActiveModal(null);
                setTour(2);
                setSnackbar(
                  <Snackbar
                    layout="vertical"
                    duration={3000}
                    className={!isDesktop ? "snackBar-fix" : ""}
                    onClose={() => setSnackbar(null)}
                    before={
                      <Avatar size={24} style={{ background: "#45BF45" }} />
                    }
                  >
                    Новое задание: подключить любой сервис, а после чего перейти
                    на вкладку «Подписки»
                  </Snackbar>
                );
              }}
            >
              Хорошо
            </Button>
          }
        />

        <ModalCard
          id="tour3"
          onClose={() => {
            setActiveModal(null);
            setTour(3);
            setSnackbar(
              <Snackbar
                layout="vertical"
                duration={3000}
                className={!isDesktop ? "snackBar-fix" : ""}
                onClose={() => setSnackbar(null)}
                before={<Avatar size={24} style={{ background: "#45BF45" }} />}
              >
                Новое задание: включить любой тип уведомлений
              </Snackbar>
            );
          }}
          icon={<Icon56CheckCircleOutline />}
          header={"Задание выполнено!"}
          className="tw"
          subheader={
            "Вы успешно справились с заданием и подключили один или несколько сервисов. Однако сейчас мы не сможем оповещать Вас, например, через личные сообщения, если в них что-то произойдет. Давайте перейдем в настройки и исправим это?"
          }
          actions={
            <Button
              style={{ marginTop: -20 }}
              size="l"
              mode="primary"
              onClick={() => {
                setActiveModal(null);
                setTour(3);
                setSnackbar(
                  <Snackbar
                    layout="vertical"
                    duration={3000}
                    className={!isDesktop ? "snackBar-fix" : ""}
                    onClose={() => setSnackbar(null)}
                    before={
                      <Avatar size={24} style={{ background: "#45BF45" }} />
                    }
                  >
                    Новое задание: включить любой тип уведомлений
                  </Snackbar>
                );
              }}
            >
              Оки-доки!
            </Button>
          }
        />

        <ModalCard
          id="tour4"
          onClose={() => {
            setActiveModal(null);
            setTour(4);
            setSnackbar(
              <Snackbar
                layout="vertical"
                duration={3000}
                className={!isDesktop ? "snackBar-fix" : ""}
                onClose={() => setSnackbar(null)}
                before={<Avatar size={24} style={{ background: "#45BF45" }} />}
              >
                Новое задание: перейдите на вкладку «Лента»
              </Snackbar>
            );
          }}
          icon={<Icon56CheckCircleOutline />}
          header={"Задание выполнено!"}
          className="tw"
          subheader={
            "Вы успешно справились с заданием и включили уведомления. Кажется, пришло время ознакомить Вас с другими частями сервиса. Давайте перейдем, например, на вкладку «Лента»."
          }
          actions={
            <Button
              style={{ marginTop: -20 }}
              size="l"
              mode="primary"
              onClick={() => {
                setActiveModal(null);
                setTour(4);
                setSnackbar(
                  <Snackbar
                    layout="vertical"
                    duration={3000}
                    className={!isDesktop ? "snackBar-fix" : ""}
                    onClose={() => setSnackbar(null)}
                    before={
                      <Avatar size={24} style={{ background: "#45BF45" }} />
                    }
                  >
                    Новое задание: перейдите на вкладку «Лента»
                  </Snackbar>
                );
              }}
            >
              Без проблем
            </Button>
          }
        />

        <ModalCard
          id="tour5"
          onClose={() => {
            setActiveModal(null);
            setTour(5);
            setSnackbar(
              <Snackbar
                layout="vertical"
                duration={3000}
                className={!isDesktop ? "snackBar-fix" : ""}
                onClose={() => setSnackbar(null)}
                before={<Avatar size={24} style={{ background: "#45BF45" }} />}
              >
                Новое задание: перейдите на вкладку «Популярные»
              </Snackbar>
            );
          }}
          icon={<Icon56NewsfeedOutline />}
          header={"Вкладка «Лента»"}
          className="tw"
          subheader={
            "Здесь будет отображаться список из максимум 100 последних уведомлений. Если Вы захотите посмотреть, что было, допустим, позавчера, то можно сделать это здесь. Теперь давайте перейдем на вкладку «Популярные»."
          }
          actions={
            <Button
              style={{ marginTop: -20 }}
              size="l"
              mode="primary"
              onClick={() => {
                setActiveModal(null);
                setTour(5);
                setSnackbar(
                  <Snackbar
                    layout="vertical"
                    duration={3000}
                    className={!isDesktop ? "snackBar-fix" : ""}
                    onClose={() => setSnackbar(null)}
                    before={
                      <Avatar size={24} style={{ background: "#45BF45" }} />
                    }
                  >
                    Новое задание: перейдите на вкладку «Популярные»
                  </Snackbar>
                );
              }}
            >
              Хорошо
            </Button>
          }
        />

        <ModalCard
          id="tour6"
          onClose={() => {
            setActiveModal(null);
            setTour(6);
            setSnackbar(
              <Snackbar
                layout="vertical"
                duration={3000}
                className={!isDesktop ? "snackBar-fix" : ""}
                onClose={() => setSnackbar(null)}
                before={<Avatar size={24} style={{ background: "#45BF45" }} />}
              >
                Новое задание: перейдите на вкладку «Профиль»
              </Snackbar>
            );
          }}
          icon={<Icon56LikeOutline />}
          header={"Вкладка «Популярные»"}
          className="tw"
          subheader={
            "На этой вкладке отображаются самые популярные каналы/аккаунты/блогеры, которых отслеживают через наш сервис. Если хотите поддержать любимого контент-мейкера - просто включите уведомления. Всё просто!\n\nПро подписки узнали, про работу сервиса узнали, а про профиль нет! Переходите на вкладку «Профиль», чтобы это исправить."
          }
          actions={
            <Button
              style={{ marginTop: -20 }}
              size="l"
              mode="primary"
              onClick={() => {
                setActiveModal(null);
                setTour(6);
                setSnackbar(
                  <Snackbar
                    layout="vertical"
                    duration={3000}
                    className={!isDesktop ? "snackBar-fix" : ""}
                    onClose={() => setSnackbar(null)}
                    before={
                      <Avatar size={24} style={{ background: "#45BF45" }} />
                    }
                  >
                    Новое задание: перейдите на вкладку «Профиль»
                  </Snackbar>
                );
              }}
            >
              Ага, понятно
            </Button>
          }
        />

        <ModalCard
          id="tour7"
          onClose={() => {
            setActiveModal(null);
            setTour(0);
            setSnackbar(
              <Snackbar
                layout="vertical"
                duration={3000}
                className={!isDesktop ? "snackBar-fix" : ""}
                onClose={() => setSnackbar(null)}
                before={<Avatar size={24} style={{ background: "#45BF45" }} />}
              >
                Тур по сервису окончен! Спасибо за прохождение!
              </Snackbar>
            );
          }}
          icon={<Icon56UserCircleOutline />}
          header={"Вкладка «Профиль»"}
          className="tw"
          subheader={
            "Здесь на удивление отображается Ваш профиль и множество полезных функций. Многие из них скрыты, потому что у Вас отсутствует статус «Контент-мейкер». Если у Вас присутствует хотя бы 1000 подписчиков на одной из платформ - Вы можете получить этот статус и получить доступ к функциям. Однако для этого Вам необходимо подать заявку, нажав на специальную кнопку, расположенную в самом низу страницы.\n\nК сожалению, наш с Вами тур подошёл к концу. Спасибо за его прохождение, ещё увидимся!"
          }
          actions={
            <Button
              style={{ marginTop: -20 }}
              size="l"
              mode="primary"
              onClick={() => {
                setActiveModal(null);
                setTour(0);
                setSnackbar(
                  <Snackbar
                    layout="vertical"
                    duration={3000}
                    className={!isDesktop ? "snackBar-fix" : ""}
                    onClose={() => setSnackbar(null)}
                    before={
                      <Avatar size={24} style={{ background: "#45BF45" }} />
                    }
                  >
                    Тур по сервису окончен! Спасибо за прохождение!
                  </Snackbar>
                );
              }}
            >
              Завершить тур
            </Button>
          }
        />

        <ModalCard
          id="remove"
          onClose={() => {
            setActiveModal(null);
          }}
          icon={<Avatar mode="app" src={data.img} size={56} />}
          header={data.name}
          subheader={
            "Вы действительно хотите отключить уведомления от этого пользователя?"
          }
          actions={
            <Button
              style={{ marginTop: -20 }}
              size="l"
              mode="primary"
              onClick={() => {
                fetch2(
                  "disableService",
                  "id=" + data.service_id + "&data=" + data.data
                ).then((data2) => {
                  if (data2.response) {
                    setUpdated(true);
                    setTimeout(() => setUpdated(false), 100);
                    setSnackbar(
                      <Snackbar
                        layout="vertical"
                        duration={2000}
                        className={!isDesktop ? "snackBar-fix" : ""}
                        onClose={() => setSnackbar(null)}
                        before={
                          <Avatar
                            size={24}
                            style={{ background: "var(--accent)" }}
                          >
                            <Icon16Done fill="#fff" width={14} height={14} />
                          </Avatar>
                        }
                      >
                        Уведомления от «{data.name}» отключены.
                      </Snackbar>
                    );
                  } else if (data2.message === "already_deleted") {
                    setUpdated(true);
                    setTimeout(() => setUpdated(false), 100);
                    openAction(
                      "Еще раз? Зачем?",
                      "Вы уже отключили уведомления от этого пользователя."
                    );
                  } else {
                    openAction(
                      "Девочки, мы упали!",
                      "Что-то пошло не так... попробуйте позже или обратитесь в поддержку"
                    );
                  }
                });
                setActiveModal(null);
              }}
            >
              Да, отключить
            </Button>
          }
        />

        <ModalPage
          id="contentMakerServices"
          onClose={() => {
            setActiveModal(null);
          }}
          settlingHeight={100}
          header={
            <ModalPageHeader
              right={
                isDesktop ? (
                  ""
                ) : (
                  <PanelHeaderButton
                    style={{ marginRight: 10 }}
                    onClick={() => setActiveModal(null)}
                  >
                    <Icon24Dismiss />
                  </PanelHeaderButton>
                )
              }
              separator={false}
            >
              Подписка
            </ModalPageHeader>
          }
        >
          <ContentMakerServices
            isDesktop={isDesktop}
            setSnackbar={setSnackbar}
            openAction={openAction}
            data={data2}
            setActiveModal={setActiveModal}
          />
        </ModalPage>

        <ModalPage
          id="setLink"
          onClose={() => {
            setActiveModal(null);
          }}
          settlingHeight={100}
          header={
            <ModalPageHeader
              right={
                isDesktop ? (
                  ""
                ) : (
                  <PanelHeaderButton
                    style={{ marginRight: 10 }}
                    onClick={() => setActiveModal(null)}
                  >
                    <Icon24Dismiss />
                  </PanelHeaderButton>
                )
              }
              separator={false}
            >
              Создание ссылки
            </ModalPageHeader>
          }
        >
          <SetLink openAction={openAction} setActiveModal={setActiveModal} />
        </ModalPage>

        <ModalPage
          id="refLink"
          onClose={() => {
            setActiveModal(null);
          }}
          settlingHeight={100}
          header={
            <ModalPageHeader
              right={
                isDesktop ? (
                  ""
                ) : (
                  <PanelHeaderButton
                    style={{ marginRight: 10 }}
                    onClick={() => setActiveModal(null)}
                  >
                    <Icon24Dismiss />
                  </PanelHeaderButton>
                )
              }
              separator={false}
            >
              Просмотр ссылки
            </ModalPageHeader>
          }
        >
          <RefLink link={data.link} setActiveModal={setActiveModal} />
        </ModalPage>

        <ModalPage
          id="startMailing"
          onClose={() => {
            setActiveModal(null);
          }}
          settlingHeight={100}
          header={
            <ModalPageHeader
              right={
                isDesktop ? (
                  ""
                ) : (
                  <PanelHeaderButton
                    style={{ marginRight: 10 }}
                    onClick={() => setActiveModal(null)}
                  >
                    <Icon24Dismiss />
                  </PanelHeaderButton>
                )
              }
              separator={false}
            >
              Рассылка
            </ModalPageHeader>
          }
        >
          <Mailing openAction={openAction} setActiveModal={setActiveModal} />
        </ModalPage>

        <ModalPage
          id="contentMakerRequest"
          onClose={() => {
            setActiveModal(null);
          }}
          settlingHeight={100}
          header={
            <ModalPageHeader
              right={
                isDesktop ? (
                  ""
                ) : (
                  <PanelHeaderButton
                    style={{ marginRight: 10 }}
                    onClick={() => setActiveModal(null)}
                  >
                    <Icon24Dismiss />
                  </PanelHeaderButton>
                )
              }
              separator={false}
            >
              Новая заявка
            </ModalPageHeader>
          }
        >
          <Request openAction={openAction} setActiveModal={setActiveModal} />
        </ModalPage>

        <ModalPage
          id="1"
          onClose={() => {
            setActiveModal(null);
          }}
          header={
            <ModalPageHeader
              right={
                isDesktop ? (
                  ""
                ) : (
                  <PanelHeaderButton
                    style={{ marginRight: 10 }}
                    onClick={() => setActiveModal(null)}
                  >
                    <Icon24Dismiss />
                  </PanelHeaderButton>
                )
              }
              separator={false}
            >
              Twitch
            </ModalPageHeader>
          }
        >
          <Placeholder
            style={{ marginTop: -40 }}
            icon={<Avatar mode="app" src={data.img} size={96} />}
            header="Подключение Twitch"
          >
            Для подключения уведомлений введите имя пользователя, которого Вы
            хотите отслеживать.
          </Placeholder>
          <Twitch
            isDesktop={isDesktop}
            openAction={openAction}
            setSnackbar={setSnackbar}
            setActiveModal={setActiveModal}
          />
        </ModalPage>

        <ModalPage
          id="2"
          onClose={() => {
            setActiveModal(null);
          }}
          header={
            <ModalPageHeader
              right={
                isDesktop ? (
                  ""
                ) : (
                  <PanelHeaderButton
                    style={{ marginRight: 10 }}
                    onClick={() => setActiveModal(null)}
                  >
                    <Icon24Dismiss />
                  </PanelHeaderButton>
                )
              }
              separator={false}
            >
              YouTube
            </ModalPageHeader>
          }
        >
          <Placeholder
            style={{ marginTop: -40 }}
            icon={<Avatar mode="app" src={data.img} size={96} />}
            header="Подключение YouTube"
          >
            Для подключения уведомлений введите ссылку на канал пользователя,
            которого Вы хотите отслеживать.
          </Placeholder>
          <YouTube
            isDesktop={isDesktop}
            openAction={openAction}
            setSnackbar={setSnackbar}
            setActiveModal={setActiveModal}
          />
        </ModalPage>

        <ModalPage
          id="3"
          onClose={() => {
            setActiveModal(null);
          }}
          header={
            <ModalPageHeader
              right={
                isDesktop ? (
                  ""
                ) : (
                  <PanelHeaderButton
                    style={{ marginRight: 10 }}
                    onClick={() => setActiveModal(null)}
                  >
                    <Icon24Dismiss />
                  </PanelHeaderButton>
                )
              }
              separator={false}
            >
              TikTok
            </ModalPageHeader>
          }
        >
          <Placeholder
            style={{ marginTop: -40 }}
            icon={<Avatar mode="app" src={data.img} size={96} />}
            header="Подключение TikTok"
          >
            Для подключения уведомлений введите тег пользователя, которого Вы
            хотите отслеживать.
          </Placeholder>
          <TikTok
            isDesktop={isDesktop}
            openAction={openAction}
            setSnackbar={setSnackbar}
            setActiveModal={setActiveModal}
          />
        </ModalPage>
      </ModalRoot>
    );

    return (
      <React.Fragment>
        {loaded === true && (
          <SplitLayout
            header={hasHeader && <PanelHeader separator={false} />}
            style={{ justifyContent: "center" }}
          >
            {isDesktop && (
              <SplitCol fixed width="280px" maxWidth="280px">
                <Panel nav="navigationDesktop">
                  {hasHeader && <PanelHeader />}
                  <Group>
                    <Cell
                      disabled={activeStory === "profile"}
                      style={
                        activeStory === "profile"
                          ? {
                              backgroundColor:
                                "var(--button_secondary_background)",
                              borderRadius: 8,
                            }
                          : {}
                      }
                      data-story="profile"
                      onClick={onStoryChange}
                      indicator={tour === 6 && <Badge mode="prominent" />}
                      before={<Icon28UserCircleOutline />}
                    >
                      Профиль
                    </Cell>
                    <Cell
                      disabled={activeStory === "feed"}
                      indicator={tour === 4 && <Badge mode="prominent" />}
                      style={
                        activeStory === "feed"
                          ? {
                              backgroundColor:
                                "var(--button_secondary_background)",
                              borderRadius: 8,
                            }
                          : {}
                      }
                      data-story="feed"
                      onClick={onStoryChange}
                      before={<Icon28NewsfeedOutline />}
                    >
                      Лента уведомлений
                    </Cell>
                    <Cell
                      disabled={activeStory === "subscriptions"}
                      style={
                        activeStory === "subscriptions"
                          ? {
                              backgroundColor:
                                "var(--button_secondary_background)",
                              borderRadius: 8,
                            }
                          : {}
                      }
                      data-story="subscriptions"
                      onClick={onStoryChange}
                      indicator={tour === 3 && <Badge mode="prominent" />}
                      before={<Icon28Notifications />}
                    >
                      Ваши подписки
                    </Cell>
                    <Cell
                      disabled={activeStory === "services"}
                      style={
                        activeStory === "services"
                          ? {
                              backgroundColor:
                                "var(--button_secondary_background)",
                              borderRadius: 8,
                            }
                          : {}
                      }
                      data-story="services"
                      onClick={onStoryChange}
                      indicator={
                        (tour === 1 || tour === 2) && <Badge mode="prominent" />
                      }
                      before={<Icon28ServicesOutline />}
                    >
                      Доступные сервисы
                    </Cell>
                    <Cell
                      disabled={activeStory === "rating"}
                      style={
                        activeStory === "rating"
                          ? {
                              backgroundColor:
                                "var(--button_secondary_background)",
                              borderRadius: 8,
                            }
                          : {}
                      }
                      data-story="rating"
                      indicator={tour === 5 && <Badge mode="prominent" />}
                      onClick={onStoryChange}
                      before={<Icon28LikeOutline />}
                    >
                      Популярные
                    </Cell>
                  </Group>
                  <Footer style={{ marginTop: -10 }}>
                    Версия приложения: 1.0.0 <br />
                    Разработчик:{" "}
                    <a
                      href="https://vk.com/id172118960"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Никита Балин
                    </a>
                  </Footer>
                </Panel>
              </SplitCol>
            )}

            <SplitCol
              animate={!isDesktop}
              spaced={isDesktop}
              width={isDesktop ? "560px" : "100%"}
              maxWidth={isDesktop ? "560px" : "100%"}
            >
              <Epic
                activeStory={activeStory}
                tabbar={
                  !isDesktop && (
                    <Tabbar disabled>
                      <TabbarItem
                        onClick={onStoryChange}
                        selected={activeStory === "feed"}
                        data-story="feed"
                        text="Лента"
                        indicator={tour === 4 && <Badge mode="prominent" />}
                      >
                        <Icon28NewsfeedOutline />
                      </TabbarItem>

                      <TabbarItem
                        onClick={onStoryChange}
                        selected={activeStory === "subscriptions"}
                        data-story="subscriptions"
                        text="Подписки"
                        indicator={tour === 3 && <Badge mode="prominent" />}
                      >
                        <Icon28Notifications />
                      </TabbarItem>

                      <TabbarItem
                        onClick={onStoryChange}
                        selected={activeStory === "services"}
                        data-story="services"
                        text="Сервисы"
                        indicator={
                          (tour === 1 || tour === 2) && (
                            <Badge mode="prominent" />
                          )
                        }
                      >
                        <Icon28ServicesOutline />
                      </TabbarItem>

                      <TabbarItem
                        onClick={onStoryChange}
                        selected={activeStory === "rating"}
                        data-story="rating"
                        text="Популярные"
                        indicator={tour === 5 && <Badge mode="prominent" />}
                      >
                        <Icon28LikeOutline />
                      </TabbarItem>

                      <TabbarItem
                        onClick={onStoryChange}
                        selected={activeStory === "profile"}
                        data-story="profile"
                        text="Профиль"
                        indicator={tour === 6 && <Badge mode="prominent" />}
                      >
                        <Icon28UserCircleOutline />
                      </TabbarItem>
                    </Tabbar>
                  )
                }
              >
                <View
                  id="rating"
                  popout={popout}
                  activePanel={activePanel}
                  modal={modal}
                >
                  <Panel id="rating">
                    <Rating isDesktop={isDesktop} setSnackbar={setSnackbar} />
                    {snackbar}
                  </Panel>
                </View>
                <View
                  id="feed"
                  activePanel={activePanel}
                  popout={popout}
                  modal={modal}
                >
                  <Panel id="feed">
                    <Feed
                      isDesktop={isDesktop}
                      setActiveModal={setActiveModal}
                      setSnackbar={setSnackbar}
                    />
                    {snackbar}
                  </Panel>
                </View>
                <View
                  id="subscriptions"
                  activePanel={activePanel}
                  popout={popout}
                  modal={modal}
                >
                  <Panel id="subscriptions">
                    <Subscriptions
                      go={go}
                      updated={updated}
                      tour={tour}
                      setSnackbar={setSnackbar}
                      isDesktop={isDesktop}
                      setActiveModal={setActiveModal}
                    />
                    {snackbar}
                  </Panel>
                  <Panel id="settings">
                    <Settings
                      goBack={goBack}
                      tour={tour}
                      setActiveModal={setActiveModal}
                      isDesktop={isDesktop}
                      data={goData}
                    />
                    {snackbar}
                  </Panel>
                </View>
                <View
                  id="services"
                  activePanel={activePanel}
                  popout={popout}
                  modal={modal}
                >
                  <Panel id="services">
                    <PanelHeader separator={isDesktop ? true : false}>
                      {isDesktop ? "Доступные сервисы" : "Сервисы"}
                    </PanelHeader>
                    <Services setActiveModal={setActiveModal} />
                    {snackbar}
                  </Panel>
                </View>
                <View
                  id="profile"
                  activePanel={activePanel}
                  popout={popout}
                  modal={modal}
                >
                  <Panel id="profile">
                    <Profile
                      user={user}
                      setSnackbar={setSnackbar}
                      go={go}
                      isDesktop={isDesktop}
                      setActiveModal={setActiveModal}
                    />
                    {snackbar}
                  </Panel>
                  <Panel id="faq">
                    <FAQ goBack={goBack} isDesktop={isDesktop} />
                  </Panel>
                </View>
              </Epic>
            </SplitCol>
          </SplitLayout>
        )}
      </React.Fragment>
    );
  },
  {
    viewWidth: true,
  }
);

export default App;
