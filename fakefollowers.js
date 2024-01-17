//fetch autocomplete results

console.log("working!!!");

let profilePrefix = `profile-data`;
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

  AutocompleteLoader: `[input-data=loader-dots]`,
  ButtonLoader: `[input-data=btn-loader]`,
  MainLoader: `[input-data=main-loader]`,
  HeroWrapper: `[input-data=hero-wrapper]`,
  NoSponsoredContent: `[input-data=no-sponsored-content]`,
  NoProfileData: `[input-data=no-profile-data]`,
  MainHeroSection: `[input-data=main-hero-section]`,
  HeaderUsername: `[profile-data=header-username]`,
  placeholderTitle: "[profile-data=placeholder-title]",
  mainSpinner: `[profile-data=main-spinner]`,
  analyseProfile: `[${profilePrefix}=analyze-full-profile]`,
};

let HeadingColor = "#13144d";
let TextColorWhite = "#ffffff";
let UsernameColor = "#121b2e";
let HeaderTitle = `Here's what our report looks like for`;

//input
const searchInput = document.querySelector("[input-data=query]");
const submitButton = document.querySelector("[input-btn=check-profile]");
const autocompleteLoaderEle = document.querySelector(
  Selectors.AutocompleteLoader
);
const buttonLoaderEle = document.querySelector(Selectors.ButtonLoader);
const SampleHeaderEle = document.querySelector(Selectors.SampleHeader);
const HeroAreaEle = document.querySelector(Selectors.HeroWrapper);
const copyLinkEle = document.querySelector(Selectors.profileCopyLink);
const MainHeroSectionEle = document.querySelector(Selectors.MainHeroSection);
const NoProfileDateEle = document.querySelector(Selectors.NoProfileData);
const NoSponsoredContentEle = document.querySelector(
  Selectors.NoSponsoredContent
);
const SampleHeaderUsernameEle = document.querySelector(
  Selectors.HeaderUsername
);

const fakeFollowersEle = document.querySelector(Selectors.fakeFollowers);
const placeholderTitleEle = document.querySelector(Selectors.placeholderTitle);
const mainSpinnerEle = document.querySelector(Selectors.mainSpinner);
const analyseProfileButton = document.querySelector(Selectors.analyseProfile);
const realFollowersPPEle = document.querySelector(Selectors.realFollowersPP);

//dropdown list
const resultList = document.querySelector("[data=result-list]");
const listItem = document.querySelector("[data=list-item]");
const listItemImgAttr = "[data=item-image]";
const listItemNameAttr = "[data=list-item-name]";
const listItemUsernameAttr = "[data=list-item-username]";
const listItemIsVerifiedAttr = "[data=item-is-verified]";

const getContactDetailsEle = document.querySelector(
  Selectors.getContactDetails
);
const checkForFreeBtn = document.querySelector(Selectors.checkForFreeBtn);

//const loaderEle = document.querySelector("[data=loader]");

const Search_URL = "https://insightiq-api.nrj.life/search?";

const fetchResults = debounce(async (req) => {
  const FinalUrl = new URL(Search_URL);
  FinalUrl.searchParams.set("q", req.query);
  FinalUrl.searchParams.set("p", req.platform || "it");
  FinalUrl.searchParams.set("sf", "ff");

  TrackEvent(EventNames.ffUserNameEntered, {
    username: req.query,
    platform_name: "instagram",
  });

  try {
    const response = await (
      await fetch(FinalUrl, {
        method: "GET",
      })
    ).json();
    req.onSuccess(response);
    return response;
  } catch (err) {
    console.log("<< Error in fethcing >>", err);
  }
}, 500);

const fetchFakeDataInfo = async (req) => {
  const profileURL = new URL(`https://insightiq-api.nrj.life/fake-data`);
  profileURL.searchParams.set("h", req.handle);
  //profileURL.searchParams.set("p", req.platform || "it");

  let response;
  try {
    response = await fetch(profileURL);
    if (response.ok) {
      response = await response.json();
    } else {
      console.log("Error in Profile ::", response);
    }
  } catch (err) {
    console.error(err);
    return err;
  }
  return response;
};

let timeId = null;
let currentHandle;
let searchedProfile = {};
const handleTextChange = async (e) => {
  autocompleteLoaderEle.style.display = "block";
  //if (timeId) clearTimeout(timeId);
  const query = e.target.value;
  const query_input_value = searchInput.value;
  currentHandle = query;
  // console.log("Testing values::", { query, query_input_value });
  if (!query || !query.length) {
    autocompleteLoaderEle.style.display = "none";
    resultList.innerHTML = "";
    return;
  }
  //let results;
  fetchResults({
    query,
    onSuccess: (results) => {
      // console.log("Autocomplte values", results);

      autocompleteLoaderEle.style.display = "none";
      if (query.length && results && results.data.length) {
        resultList.innerHTML = "";
        results.data.forEach((profile) => {
          const cloneListItem = listItem.cloneNode(true);
          const itemImg = cloneListItem.querySelector(listItemImgAttr);
          const itemFullName = cloneListItem.querySelector(listItemNameAttr);
          const itemUsername =
            cloneListItem.querySelector(listItemUsernameAttr);
          const itemVerified = cloneListItem.querySelector(
            listItemIsVerifiedAttr
          );

          itemImg.src = profile.picture;
          itemImg.alt = `${profile.fullname}'s image`;
          itemFullName.innerText = profile.fullname;
          itemUsername.innerText = `@${profile.username}`;
          if (!profile.is_verified) {
            itemVerified.style.display = "none";
          }
          cloneListItem.addEventListener("click", () => {
            //searchInput.value = "";
            searchInput.value = profile.username;
            currentHandle = profile.username;
            resultList.style.display = "none";
            updateBrowserUrl();
            handleUsernameSubmit();
            TrackEvent(EventNames.ffProfileSelected, {
              username: profile.username,
              platform_name: "instagram",
            });
          });

          resultList.appendChild(cloneListItem);
        });
        resultList.style.zIndex = 10;
        resultList.style.display = "flex";
      } else {
        //resultList.style.display = "none";
        resultList.innerHTML = `<div> No results found </div>`;
      }
    },
  });
};

const formatDateTime = (date = new Date()) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  // console.log(formattedDate);
  return formattedDate;
};

const formatDate = (date = new Date()) => {
  const options = {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  };

  const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(date);
  // console.log(formattedDate);
  return formattedDate;
};
let chart1;
let chart2;
let chart3;
const updateGraphs = (graphsData) => {
  const { followerTypes, followers, likes } = graphsData;

  const followerTypesGraph = document.getElementById("followers-types");
  const followersGrowthGraph = document.getElementById("followers-growth");
  const likesGrowthGraph = document.getElementById("likes-growth");

  if (chart1 && chart2 && chart3) {
    chart1.destroy();
    chart2.destroy();
    chart3.destroy();
  }

  chart1 = renderDoughnutGraph({
    ref: followerTypesGraph,
    data: followerTypes,
  });
  chart2 = renderLineGraph({
    ref: followersGrowthGraph,
    yAxisData: followers.followersCount,
    xAxisData: followers.months,
    title: "Monthly trend of total followers",
  });
  chart3 = renderLineGraph({
    ref: likesGrowthGraph,
    yAxisData: likes.avgLikesCount,
    xAxisData: likes.months,
    title: "Monthly trend of average likes per post",
  });
};

const updateProfilePage = (results) => {
  NoProfileDateEle.style.display = "none";
  MainHeroSectionEle.style.display = "block";
  mainSpinnerEle.style.display = "none";
  //basic profile info
  const profilePicEle = document.querySelector(Selectors.profilePicture);
  const profileNameEle = document.querySelector(Selectors.fullname);
  const profileVerifiedEle = document.querySelector(Selectors.profileVerified);
  const profileUsernameEle = document.querySelector(Selectors.username);
  const profilelinkEle = document.querySelector(Selectors.profileLink);
  const popupImageEle = document.querySelector(Selectors.popupImage);
  const popupUsernameEle = document.querySelector(Selectors.popupUsername);

  const engRateEle = document.querySelector(Selectors.engagementRate);
  const followersEle = document.querySelector(Selectors.followers);
  const avgLikesEle = document.querySelector(Selectors.avgLikes);
  const realFollowersEle = document.querySelector(Selectors.realFollowers);
  const influencersFollowersEle = document.querySelector(
    Selectors.influencersFollowers
  );
  const suspiciousFollowersEle = document.querySelector(
    Selectors.suspiciousFollowers
  );
  const massFollowersEle = document.querySelector(Selectors.massFollowers);

  // const engMedianRateEle = document.querySelector(Selectors.medianER);
  //const highLowThanEle = document.querySelector(Selectors.highLowThan);
  // const avgCommentsEle = document.querySelector(Selectors.avgComments);

  if (results && Object.keys(results).length > 1) {
    const { profile, stats, followers, growth } = results;
    if (profile) {
      profilePicEle.src = profile.imageUrl;
      profileNameEle.innerText = profile.fullName;
      profileUsernameEle.innerText = profile.username;
      popupImageEle.src = profile.imageUrl;
      popupUsernameEle.innerText = profile.username;
      if (!profile.isVerified) {
        profileVerifiedEle.style.display = "none";
      }
      profilelinkEle.addEventListener("click", () =>
        window.open(profile.url, "blank")
      );
      copyLinkEle.addEventListener("click", () => {
        generateCopyUrl(
          currentHandle,
          () => {
            copyLinkEle.innerText = "Copied!";
            setTimeout(() => {
              copyLinkEle.innerText = "Copy profile link";
            }, 1500);
          },
          () => {
            copyLinkEle.innerText = "Failed to Copy!";
          }
        );
        TrackEvent(EventNames.ffProfileShared, {
          username: currentHandle,
          platform_name: "instagram",
        });
      });
    }

    if (stats) {
      engRateEle.innerText = `${stats.engagementRate}%`;
      /*  engMedianRateEle.innerText = `${Math.abs(stats.medianRate)}%`;
      if (stats.medianRate < 0) {
        highLowThanEle.innerText = "lower ";
      } */
      fakeFollowersEle.innerText = `${stats.fakeFollowersRate}%` || "";
      followersEle.innerText = stats.followers || "";
      avgLikesEle.innerText = stats.averageLikes || "";
      //avgCommentsEle.innerText = stats.averageComments || "";
    }

    if (followers) {
      realFollowersEle.innerText = `${followers.real}%`;
      realFollowersPPEle.innerText = `${followers.real}`;
      influencersFollowersEle.innerText = `${followers.influencers}%`;
      suspiciousFollowersEle.innerText = `${followers.suspicious}%`;
      massFollowersEle.innerText = `${followers.massFollowers}%`;
    }

    if (growth) {
      let graphData = {
        followerTypes: Object.values(followers).map(parseFloat),
        followers: growth.followers,
        likes: growth.likes,
      };
      updateGraphs(graphData);
    }
  } else {
    // console.log("Show Error Toast");
    SampleHeaderUsernameEle.style.color = UsernameColor;
    SampleHeaderUsernameEle.innerText = `@${currentHandle}`;
    MainHeroSectionEle.style.display = "none";
    NoProfileDateEle.style.display = "flex";
    mainSpinnerEle.style.display = "none";
  }
};

const handleUsernameSubmit = async (e) => {
  e?.preventDefault();
  submitButton.style.color = HeadingColor;
  buttonLoaderEle.style.display = "block";
  resultList.innerHTML = "";
  copyLinkEle.innerText = "Copy profile link";

  if (!currentHandle || !currentHandle.length) {
    submitButton.style.color = TextColorWhite;
    buttonLoaderEle.style.display = "none";
    return;
  }
  //console.log("Curren Username", currentHandle);

  const results = await fetchFakeDataInfo({ handle: currentHandle });
  //console.log("Profile Data:", results);

  placeholderTitleEle.style.opacity = 1;
  //<!--- update UI --->
  updateProfilePage(results);
  buttonLoaderEle.style.display = "none";
  submitButton.style.color = TextColorWhite;

  //<!--- Hide header only if there's a profile param
  if (window.location.href.includes("profile")) {
    SampleHeaderEle.innerText = `${HeaderTitle} `;
    SampleHeaderUsernameEle.style.color = UsernameColor;
    SampleHeaderUsernameEle.innerText = `@${currentHandle}`;
  }
};

const generateCopyUrl = (query, onSuccess, onFailure) => {
  const shareUrl = new URL(`${window.location.href}`);
  shareUrl.searchParams.set("profile", query);
  function updateClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(
      () => {
        /* clipboard successfully set */
        console.log("Copied");
        onSuccess();
      },
      () => {
        /* clipboard write failed */
        onFailure();
      }
    );
  }
  updateClipboard(shareUrl);
};

const updateBrowserUrl = () => {
  if (!currentHandle || !currentHandle.length) return;
  const shareUrl = new URL(`${window.location.href}`);
  if (currentHandle !== "") {
    shareUrl.searchParams.set("profile", currentHandle);
  }
  window.history.pushState(null, null, `?profile=${currentHandle}`);
};

const updateAppState = (username) => {
  currentHandle = username;
  handleUsernameSubmit();
};

searchInput.addEventListener("input", handleTextChange);
submitButton.addEventListener("click", (e) => {
  e?.preventDefault();
  TrackEvent(EventNames.ffCheckProfileClicked, {
    username: currentHandle,
    platform_name: "instagram",
  });
  handleUsernameSubmit(e);
});
HeroAreaEle.addEventListener("click", (e) => {
  if (resultList.hasChildNodes) {
    resultList.style.display = "none";
  }
});
analyseProfileButton.addEventListener("click", () => {
  /* TrackEvent(EventNames.ffFullProfile, {
    username: currentHandle,
    platform_name: "instagram",
  });*/
});

getContactDetailsEle.addEventListener("click", () => {
  TrackEvent(EventNames.ffContactButtonClicked, {
    username: currentHandle,
    platform_name: "instagram",
  });
});

checkForFreeBtn.addEventListener("click", () => {
  TrackEvent(EventNames.ffCheckForFree, {
    username: currentHandle,
    platform_name: "instagram",
  });
});

window.addEventListener("load", (ev) => {
  const url = new URL(window.location.href);
  const userhandle = url.searchParams.get("profile");

  //update the opacity accordingly
  updateAppState(userhandle);
  searchInput.value = userhandle;

  //opacity zero if no params exists
  if (!userhandle) {
    updateAppState("emmachamberlain");
  }
});

//init mixpanel
window.mixpanel.init("57d1ea6085714f5117a2c1bd6b2615c2", {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});

const EventNames = {
  ffUserNameEntered: "FF_USERNAME_ENTERED",
  ffCheckProfileClicked: "FF_CHECK_PROFILE_CLICKED",
  //ffFullProfile: "FF_FULL_PROFILE_ANALYSED",
  ffContentTag: "FF_ENGAGEMENT_CONTENT_TAG_CLICKED",
  ffProfileSelected: "FF_PROFILE_SELECTED",
  ffProfileShared: "FF_PROFILE_SHARED",
  ffContactButtonClicked: "FF_CONTACT_BUTTON_CLICK",
  ffCheckForFree: "FF_CHECK_FREE",
};

const TrackEvent = (eventName, properties) => {
  window.mixpanel.track(eventName, properties);
};

function debounce(cb, delay = 300) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      return cb(...args);
    }, delay);
  };
}

function renderDoughnutGraph(graphData) {
  // console.log("XAxis data:", graphData);

  return new window.Chart(graphData.ref, {
    type: "doughnut",
    data: {
      labels: ["Real", "Influencers", "Suspicious", "Mass followers"],
      datasets: [
        {
          // label: "My First Dataset",
          data: graphData.data,
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
        tooltip: {
          enabled: true,
          displayColors: false,
          /* callbacks: {
            title: function (tooltipItem) {
              return "";
            },
            label: function (context) {
              let label = "";

              if (context.parsed.y !== null) {
                label += `${context.parsed.y?.toFixed(2)}%`;
              }
              return label;
            }
          } */
        },

        legend: { display: false },
        responsive: true,
      },
      scales: {
        y: {
          display: false,
        },
        x: {
          display: false,
        },
      },
      animation: false,
    },
  });
}

function renderLineGraph(graphData) {
  // console.log("XAxis data:", graphData);
  const formattedMonths = graphData.xAxisData.map((date) => {
    const dateObj = new Date(`${date}-01`);
    const formatedDate = formatDate(dateObj);
    // console.log("<<Formated date >>", formatedDate);
    const [day, month, year] = formatedDate.split("-");
    return `${month} '${year}`;
  });

  return new window.Chart(graphData.ref, {
    type: "line",
    data: {
      labels: formattedMonths,
      datasets: [
        {
          // label: "My First Dataset",
          data: graphData.yAxisData,
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
        display: true,
        text: graphData.title,
        position: "top",
        font: {
          weight: 700,
          size: 14,
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
          displayColors: false,
          callbacks: {
            title: function (tooltipItem) {
              return "";
            },
            /* label: function (context) {
              let label = "";

              if (context.parsed.y !== null) {
                label += `${context.parsed.y}`;
              }
              return label;
            } */
          },
        },

        legend: { display: false },
        responsive: true,
      },
      scales: {
        y: {
          border: {
            dash: [5, 5], // An array defining the line style (e.g., [dash length, gap length])
          },
          ticks: {
            autoSkipPadding: 20,
            color: "#333",
            font: {
              weight: 500,
              size: 14,
            },
            callback: function (value, index, values) {
              // Your custom formatting logic for y-axis labels
              return largeNumberFormatter(value); // Example formatting
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            autoSkipPadding: 20,
            color: "#333",
            font: {
              weight: 500,
              size: 14,
            },
          },
        },
      },
      animation: false,
    },
  });
}

const largeNumberFormatter = (value) => {
  if (!value) return;
  let formatter = Intl.NumberFormat("en", { notation: "compact" });
  // example 1
  let formattedValue = formatter.format(value);
  // print
  //console.log(`Before:${value}  and after values: ${formattedValue} >>> `);
  return formattedValue;
};
