//fetch autocomplete results

console.log("working!!!");

let profilePrefix = `profile-data`;
const Selectors = {
  profilePicture: `[${profilePrefix}=profile-picture]`,
  fullname: `[${profilePrefix}=fullname]`,
  username: `[${profilePrefix}=username]`,
  profileLink: `[${profilePrefix}=profile-link]`,
  profileVerified: `[${profilePrefix}=is-verified]`,
  profileCopyLink: `[${profilePrefix}=copy-link]`,
  popupImage: `[${profilePrefix}=popup-image]`,
  popupUsername: `[${profilePrefix}=popup-username]`,
  engagementRate: `[${profilePrefix}=eng-rate]`,
  medianER: `[${profilePrefix}=median-er]`,
  highLowThan: `[${profilePrefix}=higher-lower]`,
  followers: `[${profilePrefix}=followers]`,
  avgLikes: `[${profilePrefix}=avg-likes]`,
  avgComments: `[${profilePrefix}=avg-comments]`,
  TabsWrapper: `[${profilePrefix}=tabs-wrapper]`,
  ContentWrapperTab1: `[${profilePrefix}=content-wrapper-1]`,
  ContentWrapperTab2: `[${profilePrefix}=content-wrapper-2]`,
  ContentWrapperTab3: `[${profilePrefix}=content-wrapper-3]`,
  SampleHeader: `[${profilePrefix}=sample-header]`,
  ContentCardTab1: `[tab-1-item=card]`,
  ContentCardTab2: `[tab-2-item=card]`,
  ContentCardTab3: `[tab-3-item=card]`,
  CardDate: `[card-item=date]`,
  CardImage: `[card-item=image]`,
  CardDesc: `[card-item=description]`,
  CardLikes: `[card-item=likes]`,
  CardComments: `[card-item=comments]`,
  CardER: `[card-item=eng-rate]`,
  CardPP: `[card-item=dp]`,
  AutocompleteLoader: `[input-data=loader-dots]`,
  ButtonLoader: `[input-data=btn-loader]`,
  MainLoader: `[input-data=main-loader]`,
  HeroWrapper: `[input-data=hero-wrapper]`,
  NoSponsoredContent: `[input-data=no-sponsored-content]`,
  NoProfileData: `[input-data=no-profile-data]`,
  MainHeroSection: `[input-data=main-hero-section]`,
};

let HeadingColor = "#13144d";
let TextColorWhite = "#ffffff";
let HeaderTitle = `Engagement rate for`;

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

//dropdown list
const resultList = document.querySelector("[data=result-list]");
const listItem = document.querySelector("[data=list-item]");
const listItemImgAttr = "[data=item-image]";
const listItemNameAttr = "[data=list-item-name]";
const listItemUsernameAttr = "[data=list-item-username]";
const listItemIsVerifiedAttr = "[data=item-is-verified]";

//const loaderEle = document.querySelector("[data=loader]");

const Search_URL = "https://insightiq-api.nrj.life/search?";

const fetchResults = debounce(async (req) => {
  const FinalUrl = new URL(Search_URL);
  FinalUrl.searchParams.set("q", req.query);
  FinalUrl.searchParams.set("p", req.platform || "tt");

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

const fetchProfileInfo = async (req) => {
  const profileURL = new URL(`https://insightiq-api.nrj.life/engagement-data`);
  profileURL.searchParams.set("h", req.handle);
  profileURL.searchParams.set("p", req.platform || "tt");

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
  console.log("Testing values::", { query, query_input_value });
  if (!query || !query.length) {
    autocompleteLoaderEle.style.display = "none";
    resultList.innerHTML = "";
    return;
  }
  //let results;
  fetchResults({
    query,
    onSuccess: (results) => {
      console.log("Autocomplte values", results);

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
            //handleUsernameSubmit();
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
//let chart3;
const updateGraphs = (graphsData) => {
  const { latest, top, sponsored } = graphsData;

  const latestBarGraph = document.getElementById("bar-chart-latest");
  const topBarGraph = document.getElementById("bar-chart-top");
  //const sponsoredBarGraph = document.getElementById("bar-chart-sponsored");

  if (chart1 && chart2) {
    chart1.destroy();
    chart2.destroy();
  }

  chart1 = renderBarGraphs({
    ref: latestBarGraph,
    yAxisData: latest.engagementRates,
    xAxisData: latest.publishedDates.map((date) => formatDate(new Date(date))),
  });
  chart2 = renderBarGraphs({
    ref: topBarGraph,
    yAxisData: top.engagementRates,
    xAxisData: top.publishedDates.map((date) => formatDate(new Date(date))),
  });
  /* chart3 = renderBarGraphs({
    ref: sponsoredBarGraph,
    yAxisData: sponsored.engagementRates,
    xAxisData: sponsored.publishedDates.map((date) =>
      formatDate(new Date(date))
    )
  }); */
};

function replaceImageWithVideo(imageElement, videoEle) {
  // Select the image element
  // const imageElement = document.getElementById("imageElement");

  // Create a new video element
  const videoElement = document.createElement("video");
  videoElement.src = videoEle.url;
  videoElement.width = videoEle.width || "300";
  videoElement.height = videoEle.height || "200";
  videoElement.className = videoEle.className || "image"; // Apply the same class for styles

  // Replace the image with the video element
  imageElement.replaceWith(videoElement);
}

function updateTabContent(tabId, data, profilepicUrl) {
  let wrapper;
  let dummyCard;

  const ContentWrapperTab1Ele = document.querySelector(
    Selectors.ContentWrapperTab1
  );
  const ContentWrapperTab2Ele = document.querySelector(
    Selectors.ContentWrapperTab2
  );
  const ContentWrapperTab3Ele = document.querySelector(
    Selectors.ContentWrapperTab3
  );
  const ContentCardTab1Ele = document.querySelector(Selectors.ContentCardTab1);
  const ContentCardTab2Ele = document.querySelector(Selectors.ContentCardTab2);
  const ContentCardTab3Ele = document.querySelector(Selectors.ContentCardTab3);

  if (tabId === "top") {
    wrapper = ContentWrapperTab2Ele;
    dummyCard = ContentCardTab2Ele;
  }
  if (tabId === "latest") {
    wrapper = ContentWrapperTab1Ele;
    dummyCard = ContentCardTab1Ele;
  }
  if (tabId === "sponsored") {
    wrapper = ContentWrapperTab3Ele;
    dummyCard = ContentCardTab3Ele;
  }

  if (data && data.length) {
    wrapper.innerHTML = "";
    data.forEach((eachItem) => {
      const clonedListItem = dummyCard?.cloneNode(true);
      //refs
      if (!clonedListItem) return;
      const CardProfileEle = clonedListItem.querySelector(Selectors.CardPP);
      const DateEle = clonedListItem.querySelector(Selectors.CardDate);
      const ImageEle = clonedListItem.querySelector(Selectors.CardImage);
      // const videoEle = clonedListItem.querySelector(Selectors.CardVideo)
      const DescEle = clonedListItem.querySelector(Selectors.CardDesc);
      const LikesEle = clonedListItem.querySelector(Selectors.CardLikes);
      const CommentsEle = clonedListItem.querySelector(Selectors.CardComments);
      const EngEle = clonedListItem.querySelector(Selectors.CardER);

      //updated values
      CardProfileEle.src = profilepicUrl;
      CardProfileEle.srcset = "";
      DateEle.innerText = formatDateTime(new Date(eachItem.published_at));

      console.log("Photo URL set", eachItem.thumbnail_url);
      if (!eachItem.thumbnail_url) {
        ImageEle.src = "https://i.stack.imgur.com/drHbk.jpg";
        ImageEle.srcset = "";
      } else {
        ImageEle.src = eachItem.thumbnail_url;
        // ImageEle.srcset = `${eachItem.thumbnail_url}500w`;
        ImageEle.srcset = "";
      }

      DescEle.innerText = eachItem.description;
      if (eachItem.engagementRate) {
        EngEle.innerText = `${eachItem.engagementRate?.toFixed(1)}%`;
      } else {
        EngEle.parentElement.style.dsiplay = "none";
      }
      LikesEle.innerText = eachItem.engagement.like_count || "";
      CommentsEle.innerText = eachItem.engagement.comment_count || "";
      clonedListItem.addEventListener("click", () =>
        window.open(eachItem.url, "blank")
      );
      wrapper.appendChild(clonedListItem);
    });
  } else {
    console.log("No sponsored data", NoSponsoredContentEle);
    wrapper.innerHTML = "";
    NoSponsoredContentEle.style.display = "flex";
  }
}

const updateProfilePage = (results) => {
  NoProfileDateEle.style.display = "none";
  MainHeroSectionEle.style.display = "block";
  //basic profile info
  const profilePicEle = document.querySelector(Selectors.profilePicture);
  const profileNameEle = document.querySelector(Selectors.fullname);
  const profileVerifiedEle = document.querySelector(Selectors.profileVerified);
  const profileUsernameEle = document.querySelector(Selectors.username);
  const profilelinkEle = document.querySelector(Selectors.profileLink);
  const popupImageEle = document.querySelector(Selectors.popupImage);
  const popupUsernameEle = document.querySelector(Selectors.popupUsername);

  const engRateEle = document.querySelector(Selectors.engagementRate);
  const engMedianRateEle = document.querySelector(Selectors.medianER);
  const highLowThanEle = document.querySelector(Selectors.highLowThan);
  const followersEle = document.querySelector(Selectors.followers);
  const avgLikesEle = document.querySelector(Selectors.avgLikes);
  const avgCommentsEle = document.querySelector(Selectors.avgComments);

  if (results && Object.keys(results).length > 1) {
    const { profile, stats, posts, graphs } = results;
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
          },
          () => {
            copyLinkEle.innerText = "Failed to Copy!";
          }
        );
      });
    }

    if (stats) {
      engRateEle.innerText = `${stats.engagementRate}%`;
      engMedianRateEle.innerText = `${Math.abs(stats.medianRate)}%`;
      if (stats.medianRate < 0) {
        highLowThanEle.innerText = " lower ";
      }
      followersEle.innerText = stats.followers || "";
      avgLikesEle.innerText = stats.averageLikes || "";
      avgCommentsEle.innerText = stats.averageComments || "";
    }

    if (posts) {
      updateTabContent("latest", posts.latestContent, profile.imageUrl);
      updateTabContent("top", posts.topContent, profile.imageUrl);
      // updateTabContent("sponsored", posts.sponseredContent, profile.imageUrl);
      /*   ContentTabsEle.addEventListener("click", (e) => {
        const currentTab = e.target.innerText;
        console.log("Tab selected", currentTab);
      }); */
    }

    if (graphs) {
      updateGraphs(graphs);
    }
  } else {
    console.log("Show Error Toast");
    MainHeroSectionEle.style.display = "none";
    NoProfileDateEle.style.display = "flex";
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
  console.log("Curren Username", currentHandle);

  const results = await fetchProfileInfo({ handle: currentHandle });
  console.log("Profile Data:", results);

  //<!--- update UI --->
  updateProfilePage(results);
  buttonLoaderEle.style.display = "none";
  submitButton.style.color = TextColorWhite;

  //<!--- Hide header only if there's a profile param
  if (window.location.href.includes("profile")) {
    SampleHeaderEle.innerText = `${HeaderTitle} @${currentHandle}`;
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
submitButton.addEventListener("click", handleUsernameSubmit);
HeroAreaEle.addEventListener("click", (e) => {
  if (resultList.hasChildNodes) {
    resultList.style.display = "none";
  }
});
window.addEventListener("load", (ev) => {
  const url = new URL(window.location.href);
  const userhandle = url.searchParams.get("profile");

  //update the opacity accordingly
  updateAppState(userhandle);
  searchInput.value = userhandle;

  //opacity zero if no params exists
  if (!userhandle) {
    updateAppState("zachking");
  }
});

function debounce(cb, delay = 300) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      return cb(...args);
    }, delay);
  };
}

function renderBarGraphs(graphData) {
  console.log("XAxis data:", graphData.xAxisData);
  const xAxisData = graphData.xAxisData?.map((date) => {
    const [day, month, year] = date.split("-");
    return `${day} ${month} '${year}`;
  });
  return new window.Chart(graphData.ref, {
    type: "bar",
    data: {
      labels: xAxisData,
      datasets: [
        {
          // label: "Date Posted",
          backgroundColor: new Array(10).fill("#00D176"),
          data: graphData.yAxisData,
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          enabled: true,
          displayColors: false,
          callbacks: {
            title: function (tooltipItem) {
              return "";
            },
            label: function (context) {
              let label = "";

              if (context.parsed.y !== null) {
                label += `${context.parsed.y?.toFixed(2)}%`;
              }
              return label;
            },
          },
        },

        legend: { display: false },
        responsive: true,
        title: {
          display: true,
          text: "Date Posted",
          position: "bottom",
          font: {
            weight: 700,
            size: 14,
          },
        },
      },
      scales: {
        y: {
          border: {
            dash: [5, 5], // An array defining the line style (e.g., [dash length, gap length])
          },
          ticks: {
            color: "#333",
            font: {
              weight: 700,
              // size: 14
            },
            callback: function (value, index, values) {
              // Your custom formatting logic for y-axis labels
              return value + "%"; // Example formatting
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              weight: 700,
              //size: 14
            },
          },
        },
      },
    },
  });
}
