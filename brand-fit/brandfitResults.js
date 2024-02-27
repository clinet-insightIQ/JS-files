console.log("loaded fine");

const urlParams = new URLSearchParams(window.location.search);
const reqId = urlParams.get("uuid");

const fetchReportDetails = async (id) => {
  const url = new URL(
    "https://brand-report-apis.react-webflow-rp.workers.dev/get-report"
  );
  url.searchParams.append("reqId", id);

  try {
    const response = await (await fetch(url)).json();
    return response;
  } catch (err) {
    console.log("Error in fetching details for report", err);
  }
  return;
};

const selectors = {};
const prefix = ["form-input", "page-item", "data"];
const getElement = (selector) => document.querySelector(selector);
const getValue = (selector) => {
  return getElement(selector)?.value;
};
const setInnerText = (ref, text) => {
  ref.innerText = text;
};

selectors.brandPopup = getElement(`[${prefix[1]}=brandPopup]`);
//profile elements
selectors.userName = getElement(`[${prefix[1]}=username]`);
selector.mUsername = getElement(`[${prefix[1]}=m-username]`);
selectors.mUserhandle = getElement(`[${prefix[1]}=m-userhandle]`);
selectors.brandName = getElement(`[${prefix[1]}=brandname]`);
selectors.mBrandname = getElement(`[${prefix[1]}=m-brandname]`);
selectors.mBrandhandle = getElement(`[${prefix[1]}=m-brandhandle]`);
selectors.userhandle = getElement(`[${prefix[1]}=userhandle]`);
selectors.brandhandle = getElement(`[${prefix[1]}=brandhandle]`);
selectors.userFollowersCount = getElement(`[${prefix[1]}=userFollowersCount]`);
selectors.brandFollowersCount = getElement(
  `[${prefix[1]}=brandFollowersCount]`
);
selectors.userPicture = getElement(`[${prefix[1]}=userPicture]`);
selectors.brandPicture = getElement(`[${prefix[1]}=brandPicture]`);
selectors.matchScore = getElement(`[${prefix[1]}=matchScore]`);
selectors.matchScoreComment = getElement(`[${prefix[1]}=match-comment]`);
selectors.userCPQ = getElement(`[${prefix[1]}=userCPQ]`);
selectors.brandCPQ = getElement(`[${prefix[1]}=brandCPQ]`);
selectors.CPQ = getElement(`[${prefix[1]}=CPQ]`);
selectors.CPQWidth = getElement(`[${prefix[1]}=CPQ-width]`);
selectors.toneMatch = getElement(`[${prefix[1]}=toneMatch]`);
selectors.toneMatchWidth = getElement(`[${prefix[1]}=toneMatchWidth]`);
selectors.interestMatch = getElement(`[${prefix[1]}=interestMatch]`);
selectors.interestMatchWidth = getElement(`[${prefix[1]}=interestMatchWidth]`);
selectors.fullReportPage = getElement(`[${prefix[1]}=full-report]`);
selectors.mainLoaderEle = getElement(`[${prefix[1]}=main-loader]`);
selectors.drivingCircleEle = getElement(`[${prefix[1]}=driving-circle]`);
//TODO : sharedTone
//sharedEmotions
selectors.commonEmotionsEle = getElement(`[${prefix[1]}=emotions-row]`);
selectors.emotionChipEle = getElement(`[${prefix[1]}=emotion-chip]`);
selectors.emotionsCheckAllEle = getElement(`[${prefix[1]}=emotions-checkAll]`);
selectors.commonInterestsEle = getElement(`[${prefix[1]}=interests-row]`);
selectors.interestsCheckAllEle = getElement(
  `[${prefix[1]}=interests-checkAll]`
);
selectors.sharedPopupEle = getElement(`[${prefix[1]}=shared-popup]`);
selectors.sharedPopEleTitle = getElement(`[${prefix[1]}=sharedPopup-title]`);
selectors.sharedPopupEleCreatorImage = getElement(
  `[${prefix[1]}=sharedPopup-userimage]`
);
selectors.sharedPopupEleCreatorname = getElement(
  `[${prefix[1]}=sharedPopup-username]`
);
selectors.sharedPopupEleCreatorhandle = getElement(
  `[${prefix[1]}=sharedPopup-userhandle]`
);
selectors.sharedPopupEleBrandImage = getElement(
  `[${prefix[1]}=sharedPopup-brandimage]`
);
selectors.sharedPopupEleBrandname = getElement(
  `[${prefix[1]}=sharedPopup-brandname]`
);
selectors.sharedPopupEleBrandhandle = getElement(
  `[${prefix[1]}=sharedPopup-brandhandle]`
);
selectors.graphPoint = getElement(`[${prefix[1]}=graph-pointer]`);
selectors.popupSubtitle = getElement(`[${prefix[1]}=popup-subtitle]`);
selectors.sharedItems = getElement(`[${prefix[1]}=popup-shareditems]`);

function calculateRotation(score) {
  // Ensure the score is within the range [0, 100]
  score = Math.max(0, Math.min(100, score));

  // Calculate the degree of rotation
  var rotation = Math.round((score / 100) * 180);

  return rotation;
}

rotateItem = (item, val) => {
  const finalValue = -90 + val;
  item.style.transform = "rotate(" + finalValue + "deg)";
  item.style.webkitTransform = "rotate(" + finalValue + "deg)";
  item.style.mozTransform = "rotate(" + finalValue + "deg)";
  updateDotBorderColorNText(finalValue);
};

const updateDotBorderColorNText = (val) => {
  let color = "";
  let textTitle = "";
  if (val > -91 && val < -27) {
    color = "#f70c10";
    textTitle = "Not a fit";
  }
  if (val > -27 && val < 20) {
    color = "#e4be13";
    textTitle = "Could be a match";
  }
  if (val > 20 && val < 51) {
    color = "#3ff70c";
    textTitle = "Great Fit";
  }
  if (val > 51 && val < 91) {
    color = "#065e09";
    textTitle = "Couldn’t get better";
  }

  selectors.graphPoint.style.borderColor = color;
  setInnerText(selectors.matchScoreComment, textTitle);
};

const updateReportPage = (reportDetails) => {
  if (!reportDetails) return;

  //user profile data
  setInnerText(selectors.userName, reportDetails?.userProfileData?.username);
  setInnerText(selectors.mUsername, reportDetails?.userProfileData?.username);
  setInnerText(selectors.mUserhandle, reportDetails?.userhandle);
  setInnerText(
    selectors.userhandle,
    reportDetails?.userProfileData?.userhandle
  );
  setInnerText(
    selectors.userFollowersCount,
    reportDetails?.userProfileData?.followers
  );
  selectors.userPicture.src = reportDetails?.userProfileData?.profilePicture;

  //brand profile data
  setInnerText(selectors.brandName, reportDetails?.brandProfileData?.username);
  setInnerText(
    selectors.brandhandle,
    reportDetails?.brandProfileData?.userhandle
  );
  setInnerText(selectors.mBrandname, reportDetails?.brandProfileData?.username);
  setInnerText(selectors.mBrandhandle, brandProfileData?.userhandle);
  setInnerText(
    selectors.brandFollowersCount,
    reportDetails?.brandProfileData?.followers
  );
  selectors.brandPicture.src = reportDetails?.brandProfileData?.profilePicture;

  //report data
  rotateItem(
    selectors.drivingCircleEle,
    calculateRotation(reportDetails?.matchScore)
  );
  setInnerText(selectors.matchScore, reportDetails?.matchScore);
  //setInnerText(selectors.matchScoreComment, reportDetails?.comment);
  setInnerText(selectors.userCPQ, reportDetails?.userCPQ);
  setInnerText(selectors.brandCPQ, reportDetails?.brandCPQ);
  setInnerText(selectors.CPQ, reportDetails?.CPQ);
  selectors.CPQWidth.style.width = reportDetails?.CPQWidth;
  setInnerText(selectors.toneMatch, reportDetails?.toneMatch);
  selectors.toneMatchWidth.style.width = reportDetails?.toneMatchWidth;
  setInnerText(selectors.interestMatch, reportDetails?.interestMatch);
  selectors.interestMatchWidth.style.width = reportDetails?.interestMatchWidth;

  //popup general info
  setInnerText(
    selectors.sharedPopupEleBrandname,
    reportDetails?.brandProfileData?.username
  );
  setInnerText(
    selectors.sharedPopupEleBrandhandle,
    reportDetails?.brandProfileData?.userhandle
  );
  selectors.sharedPopupEleBrandImage.src =
    reportDetails?.brandProfileData?.profilePicture;
  setInnerText(
    selectors.sharedPopupEleCreatorname,
    reportDetails?.userProfileData?.username
  );
  setInnerText(
    selectors.sharedPopupEleCreatorhandle,
    reportDetails?.userProfileData?.userhandle
  );
  selectors.sharedPopupEleCreatorImage.src =
    reportDetails?.userProfileData?.profilePicture;

  //Emotions
  if (reportDetails?.sharedEmotions?.length > 4) {
    console.log("Shared emotions");
    selectors.emotionsCheckAllEle.style.display = "block";
    selectors.emotionsCheckAllEle.addEventListener("click", () => {
      selectors.sharedPopupEle.style.display = "block";
    });
    setInnerText(selectors.sharedPopEleTitle, "Shared Tones");
    selectors.sharedItems.innerHTML = "";
    reportDetails?.sharedEmotions?.forEach((interest) => {
      const chipEle = selectors.emotionChipEle?.cloneNode(true);
      setInnerText(chipEle, interest);
      selectors.sharedItems.appendChild(chipEle);
    });
  }
  selectors.commonEmotionsEle.innerHTML = "";
  reportDetails?.sharedEmotions?.slice(0, 4)?.forEach((interest) => {
    const chipEle = selectors.emotionChipEle?.cloneNode(true);
    setInnerText(chipEle, interest);
    selectors.commonEmotionsEle.appendChild(chipEle);
  });

  //INTERESTS : if chips > 4 show checkAll
  if (reportDetails?.sharedInterests?.length > 4) {
    selectors.interestsCheckAllEle.style.display = "block";
    selectors.interestsCheckAllEle.addEventListener("click", () => {
      selectors.sharedPopupEle.style.display = "block";
    });
    setInnerText(selectors.sharedPopEleTitle, "Shared Interests");
    setInnerText(selectors.popupSubtitle, "Shared Interests");
    selectors.sharedItems.innerHTML = "";
    reportDetails?.sharedInterests?.forEach((interest) => {
      const chipEle = selectors.emotionChipEle?.cloneNode(true);
      setInnerText(chipEle, interest);
      selectors.sharedItems.appendChild(chipEle);
    });
  }
  selectors.commonInterestsEle.innerHTML = "";
  reportDetails?.sharedInterests?.slice(0, 4)?.forEach((interest) => {
    console.log("this worked");
    const chipEle = selectors.emotionChipEle?.cloneNode(true);
    setInnerText(chipEle, interest);
    selectors.commonInterestsEle.appendChild(chipEle);
  });
};

const init = async () => {
  if (!reqId || reqId === "") {
    alert("Report Url is invalid. Please request a new report");
    window.location.href = "https://phyllo.webflow.io/brand-fit";
  }
  selectors.fullReportPage.style.display = "none";
  selectors.mainLoaderEle.style.display = "block";
  const reportDetails = await fetchReportDetails(reqId);
  console.log("Final report >>", reportDetails);
  if (reportDetails.status === "IN_PROGRESS") {
    //show something?
  }
  updateReportPage(reportDetails);
  selectors.mainLoaderEle.style.display = "none";
  selectors.fullReportPage.style.display = "block";
};

window.addEventListener("load", init);
