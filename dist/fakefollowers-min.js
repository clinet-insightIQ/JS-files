let profilePrefix = "profile-data";
const Selectors = {
  profilePicture: `[${profilePrefix}=profile-picture]`,
  fullname: `[${profilePrefix}=fullname]`,
  username: `[${profilePrefix}=username]`,
  profileLink: `[${profilePrefix}=profile-link]`,
  getContactDetails: `[${profilePrefix}=get-contact-details]`,
  checkForFreeBtn: `[${profilePrefix}=check-for-free-btn]`,
  profileVerified: `[${profilePrefix}=is-verified]`,
  profileCopyLink: `[${profilePrefix}=copy-link]`,
  popupImage: `[${profilePrefix}=popup-image]`,
  popupUsername: `[${profilePrefix}=popup-username]`,
  engagementRate: `[${profilePrefix}=eng-rate]`,
  medianER: `[${profilePrefix}=median-er]`,
  highLowThan: `[${profilePrefix}=higher-lower]`,
  fakeFollowers: `[${profilePrefix}=fakeFollowers]`,
  realFollowersPP: `[${profilePrefix}=real-followers-count]`,
  followers: `[${profilePrefix}=followers]`,
  avgLikes: `[${profilePrefix}=avg-likes]`,
  avgComments: `[${profilePrefix}=avg-comments]`,
  realFollowers: `[${profilePrefix}=real-followers]`,
  influencersFollowers: `[${profilePrefix}=influencers-followers]`,
  suspiciousFollowers: `[${profilePrefix}=suspicious-followers]`,
  massFollowers: `[${profilePrefix}=mass-followers]`,
  SampleHeader: `[${profilePrefix}=sample-header]`,
  AutocompleteLoader: "[input-data=loader-dots]",
  ButtonLoader: "[input-data=btn-loader]",
  MainLoader: "[input-data=main-loader]",
  HeroWrapper: "[input-data=hero-wrapper]",
  NoSponsoredContent: "[input-data=no-sponsored-content]",
  NoProfileData: "[input-data=no-profile-data]",
  MainHeroSection: "[input-data=main-hero-section]",
  HeaderUsername: "[profile-data=header-username]",
  placeholderTitle: "[profile-data=placeholder-title]",
  mainSpinner: "[profile-data=main-spinner]",
  analyseProfile: `[${profilePrefix}=analyze-full-profile]`,
};
let HeadingColor = "#13144d",
  TextColorWhite = "#ffffff",
  UsernameColor = "#121b2e",
  HeaderTitle = "Here's what our report looks like for";
const searchInput = document.querySelector("[input-data=query]"),
  submitButton = document.querySelector("[input-btn=check-profile]"),
  autocompleteLoaderEle = document.querySelector(Selectors.AutocompleteLoader),
  buttonLoaderEle = document.querySelector(Selectors.ButtonLoader),
  SampleHeaderEle = document.querySelector(Selectors.SampleHeader),
  HeroAreaEle = document.querySelector(Selectors.HeroWrapper),
  copyLinkEle = document.querySelector(Selectors.profileCopyLink),
  MainHeroSectionEle = document.querySelector(Selectors.MainHeroSection),
  NoProfileDateEle = document.querySelector(Selectors.NoProfileData),
  NoSponsoredContentEle = document.querySelector(Selectors.NoSponsoredContent),
  SampleHeaderUsernameEle = document.querySelector(Selectors.HeaderUsername),
  fakeFollowersEle = document.querySelector(Selectors.fakeFollowers),
  placeholderTitleEle = document.querySelector(Selectors.placeholderTitle),
  mainSpinnerEle = document.querySelector(Selectors.mainSpinner),
  analyseProfileButton = document.querySelector(Selectors.analyseProfile),
  realFollowersPPEle = document.querySelector(Selectors.realFollowersPP),
  resultList = document.querySelector("[data=result-list]"),
  listItem = document.querySelector("[data=list-item]"),
  listItemImgAttr = "[data=item-image]",
  listItemNameAttr = "[data=list-item-name]",
  listItemUsernameAttr = "[data=list-item-username]",
  listItemIsVerifiedAttr = "[data=item-is-verified]",
  getContactDetailsEle = document.querySelector(Selectors.getContactDetails),
  checkForFreeBtn = document.querySelector(Selectors.checkForFreeBtn),
  Search_URL = "https://insightiq-api.nrj.life/search?",
  fetchResults = debounce(async (e) => {
    const t = new URL(Search_URL);
    t.searchParams.set("q", e.query),
      t.searchParams.set("p", e.platform || "it"),
      t.searchParams.set("sf", "ff"),
      TrackEvent(EventNames.ffUserNameEntered, {
        username: e.query,
        platform_name: "instagram",
      });
    try {
      const r = await (await fetch(t, { method: "GET" })).json();
      return e.onSuccess(r), r;
    } catch (e) {}
  }, 500),
  fetchFakeDataInfo = async (e) => {
    const t = new URL("https://insightiq-api.nrj.life/fake-data");
    let r;
    t.searchParams.set("h", e.handle);
    try {
      (r = await fetch(t)), r.ok && (r = await r.json());
    } catch (e) {
      return e;
    }
    return r;
  };
let currentHandle,
  timeId = null,
  searchedProfile = {};
const handleTextChange = async (e) => {
    autocompleteLoaderEle.style.display = "block";
    const t = e.target.value;
    searchInput.value;
    if (((currentHandle = t), !t || !t.length))
      return (
        (autocompleteLoaderEle.style.display = "none"),
        void (resultList.innerHTML = "")
      );
    fetchResults({
      query: t,
      onSuccess: (e) => {
        (autocompleteLoaderEle.style.display = "none"),
          t.length && e && e.data.length
            ? ((resultList.innerHTML = ""),
              e.data.forEach((e) => {
                const t = listItem.cloneNode(!0),
                  r = t.querySelector(listItemImgAttr),
                  o = t.querySelector(listItemNameAttr),
                  l = t.querySelector(listItemUsernameAttr),
                  a = t.querySelector(listItemIsVerifiedAttr);
                (r.src = e.picture),
                  (r.alt = `${e.fullname}'s image`),
                  (o.innerText = e.fullname),
                  (l.innerText = `@${e.username}`),
                  e.is_verified || (a.style.display = "none"),
                  t.addEventListener("click", () => {
                    (searchInput.value = e.username),
                      (currentHandle = e.username),
                      (resultList.style.display = "none"),
                      updateBrowserUrl(),
                      handleUsernameSubmit(),
                      TrackEvent(EventNames.ffProfileSelected, {
                        username: e.username,
                        platform_name: "instagram",
                      });
                  }),
                  resultList.appendChild(t);
              }),
              (resultList.style.zIndex = 10),
              (resultList.style.display = "flex"))
            : (resultList.innerHTML = "<div> No results found </div>");
      },
    });
  },
  formatDateTime = (e = new Date()) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: !0,
    }).format(e),
  formatDate = (e = new Date()) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    }).format(e);
let chart1, chart2, chart3;
const updateGraphs = (e) => {
    const { followerTypes: t, followers: r, likes: o } = e,
      l = document.getElementById("followers-types"),
      a = document.getElementById("followers-growth"),
      n = document.getElementById("likes-growth");
    chart1 &&
      chart2 &&
      chart3 &&
      (chart1.destroy(), chart2.destroy(), chart3.destroy()),
      (chart1 = renderDoughnutGraph({ ref: l, data: t })),
      (chart2 = renderLineGraph({
        ref: a,
        yAxisData: r.followersCount,
        xAxisData: r.months,
        title: "Monthly trend of total followers",
      })),
      (chart3 = renderLineGraph({
        ref: n,
        yAxisData: o.avgLikesCount,
        xAxisData: o.months,
        title: "Monthly trend of average likes per post",
      }));
  },
  updateProfilePage = (e) => {
    (NoProfileDateEle.style.display = "none"),
      (MainHeroSectionEle.style.display = "block"),
      (mainSpinnerEle.style.display = "none");
    const t = document.querySelector(Selectors.profilePicture),
      r = document.querySelector(Selectors.fullname),
      o = document.querySelector(Selectors.profileVerified),
      l = document.querySelector(Selectors.username),
      a = document.querySelector(Selectors.profileLink),
      n = document.querySelector(Selectors.popupImage),
      i = document.querySelector(Selectors.popupUsername),
      s = document.querySelector(Selectors.engagementRate),
      c = document.querySelector(Selectors.followers),
      d = document.querySelector(Selectors.avgLikes),
      u = document.querySelector(Selectors.realFollowers),
      p = document.querySelector(Selectors.influencersFollowers),
      f = document.querySelector(Selectors.suspiciousFollowers),
      m = document.querySelector(Selectors.massFollowers);
    if (e && Object.keys(e).length > 1) {
      const { profile: y, stats: h, followers: S, growth: E } = e;
      if (
        (y &&
          ((t.src = y.imageUrl),
          (r.innerText = y.fullName),
          (l.innerText = y.username),
          (n.src = y.imageUrl),
          (i.innerText = y.username),
          y.isVerified || (o.style.display = "none"),
          a.addEventListener("click", () => window.open(y.url, "blank")),
          copyLinkEle.addEventListener("click", () => {
            generateCopyUrl(
              currentHandle,
              () => {
                (copyLinkEle.innerText = "Copied!"),
                  setTimeout(() => {
                    copyLinkEle.innerText = "Copy profile link";
                  }, 1500);
              },
              () => {
                copyLinkEle.innerText = "Failed to Copy!";
              }
            ),
              TrackEvent(EventNames.ffProfileShared, {
                username: currentHandle,
                platform_name: "instagram",
              });
          })),
        h &&
          ((s.innerText = `${h.engagementRate}%`),
          (fakeFollowersEle.innerText = `${h.fakeFollowersRate}%` || ""),
          (c.innerText = h.followers || ""),
          (d.innerText = h.averageLikes || "")),
        S &&
          ((u.innerText = `${S.real}%`),
          (realFollowersPPEle.innerText = `${S.real}`),
          (p.innerText = `${S.influencers}%`),
          (f.innerText = `${S.suspicious}%`),
          (m.innerText = `${S.massFollowers}%`)),
        E)
      ) {
        let e = {
          followerTypes: Object.values(S).map(parseFloat),
          followers: E.followers,
          likes: E.likes,
        };
        updateGraphs(e);
      }
    } else
      (SampleHeaderUsernameEle.style.color = UsernameColor),
        (SampleHeaderUsernameEle.innerText = `@${currentHandle}`),
        (MainHeroSectionEle.style.display = "none"),
        (NoProfileDateEle.style.display = "flex"),
        (mainSpinnerEle.style.display = "none");
  },
  handleUsernameSubmit = async (e) => {
    if (
      (e?.preventDefault(),
      (submitButton.style.color = HeadingColor),
      (buttonLoaderEle.style.display = "block"),
      (resultList.innerHTML = ""),
      (copyLinkEle.innerText = "Copy profile link"),
      !currentHandle || !currentHandle.length)
    )
      return (
        (submitButton.style.color = TextColorWhite),
        void (buttonLoaderEle.style.display = "none")
      );
    const t = await fetchFakeDataInfo({ handle: currentHandle });
    (placeholderTitleEle.style.opacity = 1),
      updateProfilePage(t),
      (buttonLoaderEle.style.display = "none"),
      (submitButton.style.color = TextColorWhite),
      window.location.href.includes("profile") &&
        ((SampleHeaderEle.innerText = `${HeaderTitle} `),
        (SampleHeaderUsernameEle.style.color = UsernameColor),
        (SampleHeaderUsernameEle.innerText = `@${currentHandle}`));
  },
  generateCopyUrl = (e, t, r) => {
    const o = new URL(`${window.location.href}`);
    var l;
    o.searchParams.set("profile", e),
      (l = o),
      navigator.clipboard.writeText(l).then(
        () => {
          t();
        },
        () => {
          r();
        }
      );
  },
  updateBrowserUrl = () => {
    if (!currentHandle || !currentHandle.length) return;
    const e = new URL(`${window.location.href}`);
    "" !== currentHandle && e.searchParams.set("profile", currentHandle),
      window.history.pushState(null, null, `?profile=${currentHandle}`);
  },
  updateAppState = (e) => {
    (currentHandle = e), handleUsernameSubmit();
  };
searchInput.addEventListener("input", handleTextChange),
  submitButton.addEventListener("click", (e) => {
    e?.preventDefault(),
      TrackEvent(EventNames.ffCheckProfileClicked, {
        username: currentHandle,
        platform_name: "instagram",
      }),
      handleUsernameSubmit(e);
  }),
  HeroAreaEle.addEventListener("click", (e) => {
    resultList.hasChildNodes && (resultList.style.display = "none");
  }),
  analyseProfileButton.addEventListener("click", () => {}),
  getContactDetailsEle.addEventListener("click", () => {
    TrackEvent(EventNames.ffContactButtonClicked, {
      username: currentHandle,
      platform_name: "instagram",
    });
  }),
  checkForFreeBtn.addEventListener("click", () => {
    TrackEvent(EventNames.ffCheckForFree, {
      username: currentHandle,
      platform_name: "instagram",
    });
  }),
  window.addEventListener("load", (e) => {
    const t = new URL(window.location.href).searchParams.get("profile");
    updateAppState(t),
      (searchInput.value = t),
      t || updateAppState("emmachamberlain");
  }),
  window.mixpanel.init("57d1ea6085714f5117a2c1bd6b2615c2", {
    debug: !0,
    track_pageview: !0,
    persistence: "localStorage",
  });
const EventNames = {
    ffUserNameEntered: "FF_USERNAME_ENTERED",
    ffCheckProfileClicked: "FF_CHECK_PROFILE_CLICKED",
    ffContentTag: "FF_ENGAGEMENT_CONTENT_TAG_CLICKED",
    ffProfileSelected: "FF_PROFILE_SELECTED",
    ffProfileShared: "FF_PROFILE_SHARED",
    ffContactButtonClicked: "FF_CONTACT_BUTTON_CLICK",
    ffCheckForFree: "FF_CHECK_FREE",
  },
  TrackEvent = (e, t) => {
    window.mixpanel.track(e, t);
  };
function debounce(e, t = 300) {
  let r;
  return (...o) => {
    clearTimeout(r), (r = setTimeout(() => e(...o), t));
  };
}
function renderDoughnutGraph(e) {
  return new window.Chart(e.ref, {
    type: "doughnut",
    data: {
      labels: ["Real", "Influencers", "Suspicious", "Mass followers"],
      datasets: [
        {
          data: e.data,
          backgroundColor: ["#00C65F", "#680DE4", "#D91D4A", "#B3F001"],
          hoverOffset: 4,
          spacing: 5,
          borderRadius: 10,
          rotation: 180,
        },
      ],
    },
    options: {
      cutout: 115,
      plugins: {
        tooltip: { enabled: !0, displayColors: !1 },
        legend: { display: !1 },
        responsive: !0,
      },
      scales: { y: { display: !1 }, x: { display: !1 } },
      animation: !1,
    },
  });
}
function renderLineGraph(e) {
  const t = e.xAxisData.map((e) => {
    const t = new Date(`${e}-01`),
      r = formatDate(t),
      [o, l, a] = r.split("-");
    return `${l} '${a}`;
  });
  return new window.Chart(e.ref, {
    type: "line",
    data: {
      labels: t,
      datasets: [
        {
          data: e.yAxisData,
          backgroundColor: "#fffff",
          borderWidth: 2,
          borderColor: "#680DE4",
          pointRadius: 2,
          pointBorderColor: "#680DE4",
          stepSize: 2,
        },
      ],
    },
    options: {
      title: {
        display: !0,
        text: e.title,
        position: "top",
        font: { weight: 700, size: 14 },
      },
      plugins: {
        tooltip: {
          enabled: !0,
          displayColors: !1,
          callbacks: {
            title: function (e) {
              return "";
            },
          },
        },
        legend: { display: !1 },
        responsive: !0,
      },
      scales: {
        y: {
          border: { dash: [5, 5] },
          ticks: {
            autoSkipPadding: 20,
            color: "#333",
            font: { weight: 500, size: 14 },
            callback: function (e, t, r) {
              return largeNumberFormatter(e);
            },
          },
        },
        x: {
          grid: { display: !1 },
          ticks: {
            autoSkipPadding: 20,
            color: "#333",
            font: { weight: 500, size: 14 },
          },
        },
      },
      animation: !1,
    },
  });
}
const largeNumberFormatter = (e) => {
  if (!e) return;
  return Intl.NumberFormat("en", { notation: "compact" }).format(e);
};
